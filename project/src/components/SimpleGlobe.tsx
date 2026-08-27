import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Global cities with emission markers spread across the world
const WORLD_CITIES = [
  // South America (monitored focus)
  { lat: -23.55, lng: -46.63, hot: true  }, // São Paulo
  { lat: -22.90, lng: -43.17, hot: true  }, // Rio de Janeiro
  { lat: -19.92, lng: -43.93, hot: false }, // Belo Horizonte
  { lat:  -3.73, lng: -38.52, hot: false }, // Fortaleza
  { lat:  -1.46, lng: -48.50, hot: false }, // Belém
  { lat:  -3.12, lng: -60.02, hot: false }, // Manaus
  { lat: -34.60, lng: -58.38, hot: false }, // Buenos Aires
  { lat:   4.71, lng: -74.07, hot: false }, // Bogotá
  // North America
  { lat:  40.71, lng: -74.01, hot: true  }, // New York
  { lat:  19.43, lng: -99.13, hot: true  }, // Mexico City
  { lat:  34.05, lng: -118.2, hot: false }, // Los Angeles
  // Europe
  { lat:  51.51, lng:  -0.13, hot: false }, // London
  { lat:  48.85, lng:   2.35, hot: false }, // Paris
  { lat:  55.75, lng:  37.62, hot: false }, // Moscow
  { lat:  41.01, lng:  28.96, hot: false }, // Istanbul
  // Africa
  { lat:   6.52, lng:   3.38, hot: true  }, // Lagos
  { lat:  30.04, lng:  31.24, hot: false }, // Cairo
  { lat:  -1.29, lng:  36.82, hot: false }, // Nairobi
  // Asia
  { lat:  19.08, lng:  72.88, hot: true  }, // Mumbai
  { lat:  28.61, lng:  77.21, hot: false }, // Delhi
  { lat:  39.91, lng: 116.39, hot: true  }, // Beijing
  { lat:  31.23, lng: 121.47, hot: false }, // Shanghai
  { lat:  35.69, lng: 139.69, hot: false }, // Tokyo
  { lat:  -6.21, lng: 106.85, hot: true  }, // Jakarta
  { lat:  13.76, lng: 100.50, hot: false }, // Bangkok
  // Middle East
  { lat:  25.20, lng:  55.27, hot: false }, // Dubai
  // Oceania
  { lat: -33.87, lng: 151.21, hot: false }, // Sydney
];

export default function EarthGlobe({ size = 460 }: { size?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    // Guarantee transparent canvas corners
    renderer.domElement.style.background = 'transparent';
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 3.2;

    // ── Lights ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x223344, 1.2));

    // Sun — angled to create a dramatic day/night terminator
    const sun = new THREE.DirectionalLight(0xfff5e8, 2.8);
    sun.position.set(-4, 2, 4);
    scene.add(sun);

    // Soft earthshine from the opposite side
    const fill = new THREE.DirectionalLight(0x1a4466, 0.35);
    fill.position.set(4, -1, -3);
    scene.add(fill);

    // ── Earth group ───────────────────────────────────────
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Real Earth texture (NASA Blue Marble, stored in /public)
    const loader = new THREE.TextureLoader();
    const earthTex = loader.load('/earth.jpg');
    earthTex.colorSpace = THREE.SRGBColorSpace;

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        specular: new THREE.Color(0x1a3a55),
        shininess: 20,
      })
    );
    earthGroup.add(earth);

    // Thin cloud layer — rotates slightly faster than Earth
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.007, 48, 48),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      })
    );
    earthGroup.add(clouds);

    // ── Atmosphere (Fresnel shaders) ──────────────────────
    const makeAtm = (
      radius: number,
      power: number,
      col: [number, number, number],
      intensity: number
    ) =>
      new THREE.Mesh(
        new THREE.SphereGeometry(radius, 48, 48),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            uPow:       { value: power },
            uIntensity: { value: intensity },
            uColor:     { value: new THREE.Vector3(...col) },
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uPow;
            uniform float uIntensity;
            uniform vec3 uColor;
            varying vec3 vNormal;
            void main() {
              float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
              float g = pow(rim, uPow) * uIntensity;
              gl_FragColor = vec4(uColor, clamp(g, 0.0, 1.0));
            }
          `,
        })
      );

    scene.add(makeAtm(1.15, 2.2, [0.15, 0.55, 0.9], 1.3));
    scene.add(makeAtm(1.34, 4.0, [0.05, 0.25, 0.6], 0.5));

    // ── Emission markers (global cities) ─────────────────
    type PulseInfo = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number };
    const pulses: PulseInfo[] = [];

    WORLD_CITIES.forEach(({ lat, lng, hot }, i) => {
      const phi   = (90 - lat)  * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const r = 1.018;
      const x = -Math.sin(phi) * Math.cos(theta) * r;
      const y =  Math.cos(phi)                   * r;
      const z =  Math.sin(phi) * Math.sin(theta) * r;

      const color = hot ? 0xff6855 : 0x00d4a0;

      // Core dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 8, 8),
        new THREE.MeshBasicMaterial({ color })
      );
      dot.position.set(x, y, z);
      earthGroup.add(dot);

      // Soft glow halo
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 10, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 })
      );
      glowMesh.position.set(x, y, z);
      earthGroup.add(glowMesh);

      // Expanding pulse ring
      const pulseMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        wireframe: true,
      });
      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 10),
        pulseMat
      );
      pulseMesh.position.set(x, y, z);
      earthGroup.add(pulseMesh);
      // Stagger phases so all markers don't pulse simultaneously
      pulses.push({ mesh: pulseMesh, mat: pulseMat, phase: (i / WORLD_CITIES.length) });
    });

    // ── Stars ─────────────────────────────────────────────
    const starPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 140;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.38 })
      )
    );

    // ── Animation loop ────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Earth rotation (west → east)
      earthGroup.rotation.y = t * 0.07;

      // Cloud layer rotates a tiny bit faster
      clouds.rotation.y = t * 0.075;

      // Staggered pulse animations
      pulses.forEach(({ mesh, mat, phase }) => {
        const p = (t * 0.6 + phase) % 1;
        mesh.scale.setScalar(1 + p * 5);
        mat.opacity = Math.max(0, (1 - p) * 0.38);
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size, overflow: 'visible' }}
    />
  );
}
