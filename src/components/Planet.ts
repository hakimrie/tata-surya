import * as THREE from 'three';
import { PlanetData } from '../data/planets';
import { TextureGenerator } from '../utils/textureGenerator';

export class Planet {
  public data: PlanetData;
  public group: THREE.Group;
  public tiltGroup: THREE.Group;
  public bodyMesh: THREE.Mesh;
  public atmosphereMesh?: THREE.Mesh;
  public ringMesh?: THREE.Mesh;
  public orbitLine?: THREE.Line;
  public selectionIndicator?: THREE.Mesh;
  public isSelected: boolean = false;
  public visualRadius: number;

  private rotationSpeed: number = 0; // rad/s in visual time

  constructor(data: PlanetData, visualRadius: number) {
    this.data = data;
    this.visualRadius = visualRadius;
    this.group = new THREE.Group();
    this.group.name = data.id;

    // Fixed axial tilt group: preserves astronomical tilt in space without spinning wobble
    this.tiltGroup = new THREE.Group();
    this.group.add(this.tiltGroup);
    const tiltRad = (data.axialTilt * Math.PI) / 180;
    this.tiltGroup.rotation.z = tiltRad;

    // Body Geometry & Material
    const texture = TextureGenerator.getTexture(data.textureType);
    const geometry = new THREE.SphereGeometry(visualRadius, 64, 64);

    let material: THREE.Material;
    if (data.type === 'star') {
      // Sun emits its own bright light
      material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.65,
        metalness: 0.05
      });
    }

    this.bodyMesh = new THREE.Mesh(geometry, material);
    this.bodyMesh.castShadow = data.type !== 'star';
    this.bodyMesh.receiveShadow = !!data.hasRings;
    this.tiltGroup.add(this.bodyMesh);

    // Sun Corona / Atmosphere glow
    if (data.type === 'star') {
      this.createSunCorona(visualRadius);
    } else if (data.hasAtmosphere && data.atmosphereColor) {
      this.createAtmosphere(visualRadius, data.atmosphereColor);
    }

    // Rings (e.g. Saturn)
    if (data.hasRings) {
      this.createRings(visualRadius);
    }

    // Selection ring
    this.createSelectionIndicator(visualRadius);

    // Calculate graceful, educational visual spin speed (rad/s in real viewing time)
    // Earth rotates once every ~30 seconds (0.2 rad/s).
    // Relative rate preserves real physics: Jupiter rotates ~2.4x faster than Earth,
    // Venus rotates retrograde very slowly, etc., without strobing or spinning crazily!
    if (data.rotationPeriod !== 0) {
      const earthSiderealDay = 86164.1; // seconds
      const relativeRate = earthSiderealDay / data.rotationPeriod;
      const baseSpin = 0.2;
      this.rotationSpeed = THREE.MathUtils.clamp(baseSpin * relativeRate, -0.45, 0.45);
    }
  }

  private createSunCorona(radius: number): void {
    const coronaGeo = new THREE.SphereGeometry(radius * 1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    this.group.add(corona);

    // Secondary soft outer glow
    const outerCoronaGeo = new THREE.SphereGeometry(radius * 1.5, 32, 32);
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.group.add(new THREE.Mesh(outerCoronaGeo, outerCoronaMat));
  }

  private createAtmosphere(radius: number, colorHex: string): void {
    const atmosGeo = new THREE.SphereGeometry(radius * 1.05, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    this.tiltGroup.add(this.atmosphereMesh);
  }

  /**
   * Build ring geometry lying in equatorial plane
   */
  /**
   * Build ring geometry lying in equatorial plane with upward (+Y) normal
   */
  private buildRingGeometry(radius: number): THREE.RingGeometry {
    const innerR = radius * 1.28;
    const outerR = radius * 2.42;
    // 160 theta segments for circular silhouette, 1 radial segment (per-pixel shader handles radial detail)
    const ringGeo = new THREE.RingGeometry(innerR, outerR, 160, 1);
    // Rotate -Math.PI / 2 so the geometry normal points +Y (northward) matching planetary coordinates
    ringGeo.rotateX(-Math.PI / 2);
    return ringGeo;
  }

  private createRings(radius: number): void {
    const ringTex = TextureGenerator.getTexture('saturn-ring');
    const innerR = radius * 1.28;
    const outerR = radius * 2.42;
    const ringGeo = this.buildRingGeometry(radius);

    const ringMat = new THREE.MeshStandardMaterial({
      map: ringTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      roughness: 0.35,
      metalness: 0.04,
      shadowSide: THREE.DoubleSide,
      alphaTest: 0.005,
      depthWrite: false
    });

    ringMat.userData.innerRadius = { value: innerR };
    ringMat.userData.outerRadius = { value: outerR };

    // Per-pixel concentric radial mapping & ice-particle lighting in fragment shader:
    // Calculates true mathematical Euclidean distance at EVERY pixel!
    // Completely eliminates polygon diagonal shearing / chevron artifacts!
    ringMat.onBeforeCompile = (shader) => {
      shader.uniforms.innerRadius = ringMat.userData.innerRadius;
      shader.uniforms.outerRadius = ringMat.userData.outerRadius;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_pars_vertex>',
        `#include <uv_pars_vertex>
         varying vec3 vRingPosition;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vRingPosition = position;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <uv_pars_fragment>',
        `#include <uv_pars_fragment>
         varying vec3 vRingPosition;
         uniform float innerRadius;
         uniform float outerRadius;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#ifdef USE_MAP
           float ringDist = length(vRingPosition.xz);
           float ringU = clamp((ringDist - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);
           vec4 sampledDiffuseColor = texture2D( map, vec2(ringU, 0.5) );
           #ifdef DECODE_VIDEO_TEXTURE
             sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
           #endif
           diffuseColor *= sampledDiffuseColor;
         #endif`
      );

      // Enhance ring lighting:
      // Real planetary rings are sheets of icy particles that scatter sunlight in all directions.
      // Modifying dotNL prevents grazing-angle darkening while fully preserving Saturn's cast shadow!
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_physical_pars_fragment>',
        THREE.ShaderChunk.lights_physical_pars_fragment.replace(
          'float dotNL = saturate( dot( geometryNormal, directLight.direction ) );',
          'float dotNL = max(0.65, abs(dot(geometryNormal, directLight.direction)));'
        )
      );
    };

    // Custom depth material so ring shadows cast onto Saturn globe also show Cassini & gaps
    const depthMat = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: ringTex,
      alphaTest: 0.25,
      side: THREE.DoubleSide
    });
    depthMat.userData.innerRadius = ringMat.userData.innerRadius;
    depthMat.userData.outerRadius = ringMat.userData.outerRadius;
    depthMat.onBeforeCompile = (shader) => {
      shader.uniforms.innerRadius = depthMat.userData.innerRadius;
      shader.uniforms.outerRadius = depthMat.userData.outerRadius;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_pars_vertex>',
        `#include <uv_pars_vertex>
         varying vec3 vRingPosition;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vRingPosition = position;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <uv_pars_fragment>',
        `#include <uv_pars_fragment>
         varying vec3 vRingPosition;
         uniform float innerRadius;
         uniform float outerRadius;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#ifdef USE_MAP
           float ringDist = length(vRingPosition.xz);
           float ringU = clamp((ringDist - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);
           vec4 sampledDiffuseColor = texture2D( map, vec2(ringU, 0.5) );
           diffuseColor *= sampledDiffuseColor;
         #endif`
      );
    };

    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.castShadow = false; // Planar rings receive sphere shadow without self-shadow acne
    this.ringMesh.receiveShadow = true;
    this.ringMesh.renderOrder = 1;
    this.bodyMesh.renderOrder = 0;
    this.tiltGroup.add(this.ringMesh);
  }

  private createSelectionIndicator(radius: number): void {
    // For planets with rings (Saturn), place indicator safely outside outer rings
    const indRadius = this.data.hasRings ? radius * 2.55 : radius * 1.35;
    const ringGeo = new THREE.RingGeometry(indRadius, indRadius * 1.025, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    this.selectionIndicator = new THREE.Mesh(ringGeo, ringMat);
    this.selectionIndicator.visible = false;
    this.group.add(this.selectionIndicator);
  }

  setSelected(selected: boolean, isCloseUp: boolean = false): void {
    this.isSelected = selected;
    if (this.selectionIndicator) {
      this.selectionIndicator.visible = selected && !isCloseUp;
    }
  }

  /**
   * Update visual spin rotation each frame
   */
  updateRotation(deltaRealSec: number, isSimPaused: boolean = false): void {
    if (this.rotationSpeed !== 0) {
      const rate = isSimPaused ? this.rotationSpeed * 0.25 : this.rotationSpeed;
      this.bodyMesh.rotation.y += rate * deltaRealSec;
    }

    if (this.isSelected && this.selectionIndicator) {
      this.selectionIndicator.rotation.y += 0.02;
    }
  }

  /**
   * Update size scale
   */
  setVisualRadius(visualRadius: number): void {
    this.visualRadius = visualRadius;
    this.bodyMesh.geometry.dispose();
    this.bodyMesh.geometry = new THREE.SphereGeometry(visualRadius, 64, 64);

    if (this.atmosphereMesh) {
      this.atmosphereMesh.geometry.dispose();
      this.atmosphereMesh.geometry = new THREE.SphereGeometry(visualRadius * 1.05, 48, 48);
    }

    if (this.ringMesh) {
      this.ringMesh.geometry.dispose();
      this.ringMesh.geometry = this.buildRingGeometry(visualRadius);
      const ringMat = this.ringMesh.material as THREE.MeshStandardMaterial;
      if (ringMat.userData?.innerRadius) {
        ringMat.userData.innerRadius.value = visualRadius * 1.28;
        ringMat.userData.outerRadius.value = visualRadius * 2.42;
      }
      if (this.ringMesh.customDepthMaterial?.userData?.innerRadius) {
        this.ringMesh.customDepthMaterial.userData.innerRadius.value = visualRadius * 1.28;
        this.ringMesh.customDepthMaterial.userData.outerRadius.value = visualRadius * 2.42;
      }
    }

    if (this.selectionIndicator) {
      this.selectionIndicator.geometry.dispose();
      const indRadius = this.data.hasRings ? visualRadius * 2.55 : visualRadius * 1.35;
      const ringGeo = new THREE.RingGeometry(indRadius, indRadius * 1.025, 64);
      ringGeo.rotateX(Math.PI / 2);
      this.selectionIndicator.geometry = ringGeo;
    }
  }
}
