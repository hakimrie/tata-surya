import * as THREE from 'three';
import { MoonData } from '../data/moons';
import { TextureGenerator } from '../utils/textureGenerator';

export class Moon {
  public data: MoonData;
  public group: THREE.Group;
  public bodyMesh: THREE.Mesh;
  public orbitLine?: THREE.Line;
  public selectionIndicator?: THREE.Mesh;
  public isSelected: boolean = false;
  public visualRadius: number;

  constructor(data: MoonData, visualRadius: number) {
    this.data = data;
    this.visualRadius = visualRadius;
    this.group = new THREE.Group();
    this.group.name = data.id;

    // Pick authentic procedural texture
    let texType = 'moon';
    if (data.id === 'io') texType = 'io';
    else if (data.id === 'europa') texType = 'europa';
    else if (data.id === 'ganymede') texType = 'ganymede';
    else if (data.id === 'callisto') texType = 'callisto';
    else if (data.id === 'titan') texType = 'titan';
    else if (data.id === 'enceladus') texType = 'enceladus';
    else if (data.id === 'phobos') texType = 'phobos';
    else if (data.id === 'deimos') texType = 'phobos';
    else if (data.id === 'triton') texType = 'triton';
    else if (data.id === 'miranda') texType = 'enceladus';

    const texture = TextureGenerator.getTexture(texType);
    const geometry = new THREE.SphereGeometry(visualRadius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
      metalness: 0.05
    });

    this.bodyMesh = new THREE.Mesh(geometry, material);
    this.bodyMesh.castShadow = false;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // Selection ring
    const ringGeo = new THREE.RingGeometry(visualRadius * 1.5, visualRadius * 1.6, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38ef7d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    this.selectionIndicator = new THREE.Mesh(ringGeo, ringMat);
    this.selectionIndicator.visible = false;
    this.group.add(this.selectionIndicator);
  }

  /**
   * Create orbit line circle around parent planet in parent's local space
   */
  createOrbitLine(orbitRadius: number): THREE.Line {
    if (this.orbitLine) {
      this.orbitLine.geometry.dispose();
      (this.orbitLine.material as THREE.Material).dispose();
      if (this.orbitLine.parent) {
        this.orbitLine.parent.remove(this.orbitLine);
      }
      this.orbitLine = undefined;
    }

    const segments = 64;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.data.color),
      transparent: true,
      opacity: 0.28,
      linewidth: 1
    });

    this.orbitLine = new THREE.Line(geometry, material);
    this.orbitLine.name = `orbit-${this.data.id}`;
    return this.orbitLine;
  }

  /**
   * Update existing orbit line when visual scale changes
   */
  updateOrbitLine(orbitRadius: number): void {
    if (!this.orbitLine) {
      this.createOrbitLine(orbitRadius);
      return;
    }

    const segments = 64;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius));
    }

    this.orbitLine.geometry.dispose();
    this.orbitLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  setOrbitLineVisible(visible: boolean): void {
    if (this.orbitLine) {
      this.orbitLine.visible = visible;
    }
  }

  setSelected(selected: boolean, isCloseUp: boolean = false): void {
    this.isSelected = selected;
    if (this.selectionIndicator) {
      this.selectionIndicator.visible = selected && !isCloseUp;
    }
  }

  setVisualRadius(visualRadius: number): void {
    this.visualRadius = visualRadius;
    this.bodyMesh.geometry.dispose();
    this.bodyMesh.geometry = new THREE.SphereGeometry(visualRadius, 32, 32);

    if (this.selectionIndicator) {
      this.selectionIndicator.geometry.dispose();
      const ringGeo = new THREE.RingGeometry(visualRadius * 1.5, visualRadius * 1.6, 32);
      ringGeo.rotateX(Math.PI / 2);
      this.selectionIndicator.geometry = ringGeo;
    }
  }
}
