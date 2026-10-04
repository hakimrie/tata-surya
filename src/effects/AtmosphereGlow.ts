import * as THREE from 'three';

export interface AtmosphereConfig {
  color: THREE.Color;
  coefficient: number; // inner radius factor, e.g. 1.08
  power: number;       // Fresnel sharpness exponent, e.g. 2.4 - 3.8
  intensity: number;   // Brightness, e.g. 0.8
}

export class AtmosphereGlow {
  /**
   * Preset atmospheric glow configurations for major bodies
   */
  public static readonly PRESETS: Record<string, AtmosphereConfig> = {
    earth: {
      color: new THREE.Color(0x38bdf8), // Electric azure cyan-blue
      coefficient: 1.07,
      power: 2.8,
      intensity: 0.95
    },
    venus: {
      color: new THREE.Color(0xfde047), // Sulfuric pale golden yellow
      coefficient: 1.06,
      power: 2.2,
      intensity: 0.75
    },
    mars: {
      color: new THREE.Color(0xfb923c), // Delicate dusty ochre-pink
      coefficient: 1.04,
      power: 3.5,
      intensity: 0.55
    },
    titan: {
      color: new THREE.Color(0xf59e0b), // Deep orange-amber photochemical haze
      coefficient: 1.12,
      power: 2.0,
      intensity: 0.85
    }
  };

  /**
   * Creates a photorealistic Fresnel limb atmosphere mesh enveloping the planet globe
   */
  public static createAtmosphereMesh(planetId: string, radius: number): THREE.Mesh | null {
    const config = this.PRESETS[planetId];
    if (!config) return null;

    const geometry = new THREE.SphereGeometry(radius * config.coefficient, 48, 48);

    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 glowColor;
      uniform float power;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vPositionNormal;

      void main() {
        // Fresnel limb scattering: glow is intense at the edge (tangent to sightline)
        float viewDot = dot(-vPositionNormal, vNormal);
        float fresnel = 1.0 - max(0.0, viewDot);
        float glow = pow(fresnel, power) * intensity;

        gl_FragColor = vec4(glowColor, glow);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: config.color },
        power: { value: config.power },
        intensity: { value: config.intensity }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `atmosphere-glow-${planetId}`;
    return mesh;
  }
}
