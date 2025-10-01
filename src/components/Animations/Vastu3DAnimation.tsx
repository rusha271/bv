import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';

// OrbitControls implementation with zoom fix
class OrbitControls {
  object: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  enabled = true;
  minDistance = 80;
  maxDistance = 200;
  enableDamping = true;
  dampingFactor = 0.05;
  
  private spherical = new THREE.Spherical();
  private sphericalDelta = new THREE.Spherical();
  private scale = 1;
  private panOffset = new THREE.Vector3();
  private zoomChanged = false;
  private rotateStart = new THREE.Vector2();
  private rotateEnd = new THREE.Vector2();
  private rotateDelta = new THREE.Vector2();
  private panStart = new THREE.Vector2();
  private panEnd = new THREE.Vector2();
  private panDelta = new THREE.Vector2();
  private dollyStart = new THREE.Vector2();
  private dollyEnd = new THREE.Vector2();
  private dollyDelta = new THREE.Vector2();
  private target = new THREE.Vector3();
  private lastPosition = new THREE.Vector3();
  private lastQuaternion = new THREE.Quaternion();

  constructor(object: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.object = object;
    this.domElement = domElement;
    this.target.copy(this.object.position).add(new THREE.Vector3(0, 0, -1).transformDirection(this.object.matrix));
    this.addEventListeners();
  }

  setTarget(newTarget: THREE.Vector3) {
    this.target.copy(newTarget);
  }

  getTarget(): THREE.Vector3 {
    return this.target;
  }

  private addEventListeners() {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    // Prevent pinch-to-zoom on touch devices
    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.rotateStart.set(event.clientX, event.clientY);
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  private onMouseMove(event: MouseEvent) {
    this.rotateEnd.set(event.clientX, event.clientY);
    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(0.001);
    
    this.sphericalDelta.theta -= this.rotateDelta.x;
    this.sphericalDelta.phi -= this.rotateDelta.y;
    
    this.rotateStart.copy(this.rotateEnd);
  }

  private onMouseUp() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseWheel(event: WheelEvent) {
    event.preventDefault(); // Prevent browser zoom
    if (event.deltaY < 0) {
      this.scale /= 1.02;
    } else {
      this.scale *= 1.02;
    }
    this.zoomChanged = true;
  }

  update() {
    const offset = new THREE.Vector3();
    const quat = new THREE.Quaternion().setFromUnitVectors(this.object.up, new THREE.Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();

    offset.copy(this.object.position).sub(this.target);
    offset.applyQuaternion(quat);
    this.spherical.setFromVector3(offset);

    if (this.enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
    }

    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

    this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));

    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(quatInverse);
    this.object.position.copy(this.target).add(offset);
    this.object.lookAt(this.target);

    this.scale = 1;
    this.zoomChanged = false;

    if (this.lastPosition.distanceToSquared(this.object.position) > 0.01 ||
        8 * (1 - this.lastQuaternion.dot(this.object.quaternion)) > 0.01) {
      this.lastPosition.copy(this.object.position);
      this.lastQuaternion.copy(this.object.quaternion);
      return true;
    }
    return false;
  }
}

const DynamicSolarSystem = () => {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  
  // Debug theme detection
  useEffect(() => {
    // console.log('Vastu3DAnimation theme mode:', theme.palette.mode, 'isDarkMode:', isDarkMode);
  }, [theme.palette.mode, isDarkMode]);
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 });
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isInitialized = useRef(false);
  const planetsRef = useRef<{ [key: string]: { mesh: THREE.Mesh, group: THREE.Group } }>({});
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const [targetPlanetPosition, setTargetPlanetPosition] = useState<THREE.Vector3 | null>(null);

  const planetsData = [
    { 
      name: 'Mercury',
      radius: 1.2,
      distance: 18,
      orbitalPeriod: 87.97,
      color: 0x8C7853,
      description: 'Closest planet to the Sun',
      facts: 'Temperature: -173°C to 427°C',
      meanLongitude: 252.25,
      dailyMotion: 4.0923,
      eccentricity: 0.2056,
      inclination: 7.00
    },
    { 
      name: 'Venus',
      radius: 1.8,
      distance: 26,
      orbitalPeriod: 224.70,
      color: 0xFFC649,
      description: 'Hottest planet in our solar system',
      facts: 'Surface temperature: 462°C',
      meanLongitude: 181.98,
      dailyMotion: 1.6021,
      eccentricity: 0.0067,
      inclination: 3.39
    },
    { 
      name: 'Earth',
      radius: 2.0,
      distance: 35,
      orbitalPeriod: 365.26,
      color: 0x6B93D6,
      description: 'Our home planet',
      facts: '71% of surface covered by water',
      meanLongitude: 100.47,
      dailyMotion: 0.9856,
      eccentricity: 0.0167,
      inclination: 0.00
    },
    { 
      name: 'Mars',
      radius: 1.5,
      distance: 48,
      orbitalPeriod: 686.98,
      color: 0xCD5C5C,
      description: 'The Red Planet',
      facts: 'Has the largest volcano in the solar system',
      meanLongitude: 355.43,
      dailyMotion: 0.5240,
      eccentricity: 0.0935,
      inclination: 1.85
    },
    { 
      name: 'Jupiter',
      radius: 7,
      distance: 75,
      orbitalPeriod: 4332.59,
      color: 0xD8CA9D,
      description: 'Largest planet in our solar system',
      facts: 'Has over 80 known moons',
      meanLongitude: 34.35,
      dailyMotion: 0.0831,
      eccentricity: 0.0489,
      inclination: 1.31
    },
    { 
      name: 'Saturn',
      radius: 6,
      distance: 90,
      orbitalPeriod: 10759.22,
      color: 0xFAD5A5,
      description: 'The ringed planet',
      facts: 'Has spectacular ring system',
      meanLongitude: 50.08,
      dailyMotion: 0.0334,
      eccentricity: 0.0565,
      inclination: 2.49
    },
    { 
      name: 'Uranus',
      radius: 3.5,
      distance: 105,
      orbitalPeriod: 30688.5,
      color: 0x4FD0E3,
      description: 'Ice giant tilted on its side',
      facts: 'Rotates on its side at 98° tilt',
      meanLongitude: 314.05,
      dailyMotion: 0.0117,
      eccentricity: 0.0457,
      inclination: 0.77
    },
    { 
      name: 'Neptune',
      radius: 3.3,
      distance: 120,
      orbitalPeriod: 60182,
      color: 0x4B70DD,
      description: 'Windiest planet in the solar system',
      facts: 'Wind speeds up to 2,100 km/h',
      meanLongitude: 304.35,
      dailyMotion: 0.0060,
      eccentricity: 0.0113,
      inclination: 1.77
    },
  ];

  const getJulianDay = (date: Date) => {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;
    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  };

  const calculatePlanetPosition = (planetData: any, date: Date) => {
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const jd = getJulianDay(date);
    const jd2000 = getJulianDay(j2000);
    const daysSinceJ2000 = jd - jd2000;
    
    const meanLongitude = (planetData.meanLongitude + planetData.dailyMotion * daysSinceJ2000) % 360;
    
    const angle = (meanLongitude * Math.PI) / 180;
    
    return {
      angle: angle,
      degrees: meanLongitude
    };
  };

  const createPlanetMaterial = (color: number, name: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 256;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    switch(name) {
      case 'Earth':
        gradient.addColorStop(0, '#4169E1');
        gradient.addColorStop(0.3, '#228B22');
        gradient.addColorStop(0.6, '#8B4513');
        gradient.addColorStop(1, '#FFFFFF');
        break;
      case 'Mars':
        gradient.addColorStop(0, '#CD5C5C');
        gradient.addColorStop(0.5, '#A0522D');
        gradient.addColorStop(1, '#8B4513');
        break;
      case 'Jupiter':
        gradient.addColorStop(0, '#DAA520');
        gradient.addColorStop(0.3, '#B8860B');
        gradient.addColorStop(0.7, '#CD853F');
        gradient.addColorStop(1, '#DEB887');
        break;
      case 'Saturn':
        gradient.addColorStop(0, '#FAD5A5');
        gradient.addColorStop(0.5, '#F4A460');
        gradient.addColorStop(1, '#DEB887');
        break;
      default:
        gradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`);
        gradient.addColorStop(1, `#${Math.floor(color * 0.7).toString(16).padStart(6, '0')}`);
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.3;
    for (let i = 0; i < 50; i++) {
      context.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
      context.beginPath();
      context.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 10 + 2,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshPhongMaterial({
      map: texture,
      shininess: name === 'Earth' ? 100 : 30,
      transparent: false
    });
  };

  const createPlanet = (planetData: any) => {
    const geometry = new THREE.SphereGeometry(planetData.radius, 64, 32);
    const material = createPlanetMaterial(planetData.color, planetData.name);
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.userData = { planetData };
    
    if (['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(planetData.name)) {
      const glowGeometry = new THREE.SphereGeometry(planetData.radius * 1.1, 32, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: planetData.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(glow);
    }

    if (planetData.name === 'Saturn') {
      const ringGeometry = new THREE.RingGeometry(planetData.radius * 1.2, planetData.radius * 2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xC4A484,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      planet.add(rings);
    }

    return planet;
  };

  const createOrbit = (radius: number) => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x444444, 
      transparent: true, 
      opacity: 0.3 
    });
    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = Math.PI / 2;
    return orbit;
  };

  const handleCanvasInteraction = (event: React.MouseEvent) => {
    if (!mountRef.current || !camera.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    setMousePosition({ x: event.clientX, y: event.clientY });

    raycaster.current.setFromCamera(mouse.current, camera.current);
    
    const planetMeshes = Object.values(planetsRef.current).map(p => p.mesh);
    const intersects = raycaster.current.intersectObjects(planetMeshes);

    if (event.type === 'click') {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData && intersectedObject.userData.planetData) {
          setTargetPlanetPosition(intersectedObject.position.clone());
        } else {
          setTargetPlanetPosition(null);
        }
      } else {
        setTargetPlanetPosition(null);
      }
    }

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      if (intersectedObject.userData && intersectedObject.userData.planetData) {
        const intersectedPlanet = intersectedObject.userData.planetData;
        setHoveredPlanet(intersectedPlanet.name);
      } else {
        setHoveredPlanet(null);
      }
    } else {
      setHoveredPlanet(null);
    }
  };

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const updateSize = () => {
      if (mountRef.current) {
        // Use requestAnimationFrame to prevent forced reflow
        requestAnimationFrame(() => {
          setContainerSize({
            width: mountRef.current!.clientWidth,
            height: mountRef.current!.clientHeight,
          });
        });
      }
    };
    
    const debouncedUpdateSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSize, 100);
    };
    
    if (mountRef.current) {
      updateSize();
    }
    window.addEventListener('resize', debouncedUpdateSize, { passive: true });
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedUpdateSize);
    };
  }, []);

  const updatePlanetaryPositions = () => {
    const date = new Date();
    
    Object.entries(planetsRef.current).forEach(([name, planetObj]) => {
      const planetData = planetsData.find(p => p.name === name);
      if (planetData) {
        const position = calculatePlanetPosition(planetData, date);
        const x = Math.cos(position.angle) * planetData.distance;
        const z = Math.sin(position.angle) * planetData.distance;
        planetObj.mesh.position.set(x, 0, z);
        planetObj.group.rotation.y = position.angle;
      }
    });
  };

  useEffect(() => {
    if (!mountRef.current || containerSize.width <= 1 || containerSize.height <= 1 || isInitialized.current) return;
    isInitialized.current = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x000011 : 0x001122);
    sceneRef.current = scene;

    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.6 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const cam = new THREE.PerspectiveCamera(
      35,
      containerSize.width / containerSize.height,
      0.1,
      2000
    );
    cam.position.set(0, 100, 200);
    camera.current = cam;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerSize.width, containerSize.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(15, 15, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 300;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const sunLight = new THREE.PointLight(0xFFFFAA, 2.0, 0, 2);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = false;
    scene.add(sunLight);

    const sunGeometry = new THREE.SphereGeometry(8, 64, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFF44
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    const coronaGeometry = new THREE.SphereGeometry(10, 32, 16);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFAA00,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sun.add(corona);
    scene.add(sun);

    planetsData.forEach((planetData) => {
      const planetGroup = new THREE.Group();
      const planet = createPlanet(planetData);
      const orbit = createOrbit(planetData.distance);
      
      planetGroup.add(planet);
      scene.add(orbit);
      scene.add(planetGroup);
      
      planetsRef.current[planetData.name] = {
        mesh: planet,
        group: planetGroup
      };
    });

    updatePlanetaryPositions();

    const controls = new OrbitControls(cam, renderer.domElement);
    controls.minDistance = 80;
    controls.maxDistance = 300;
    controlsRef.current = controls;

    let time = 0;
    const animate = () => {
      if (!controlsRef.current || !camera.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const controls = controlsRef.current;

      time += 0.02;

      if (targetPlanetPosition && controls.getTarget().distanceTo(targetPlanetPosition) > 0.1) {
        controls.setTarget(controls.getTarget().lerp(targetPlanetPosition, 0.08));
        controls.object.position.lerp(new THREE.Vector3().copy(targetPlanetPosition).add(new THREE.Vector3(0, 25, 50)), 0.08);
      } else if (!targetPlanetPosition && controls.getTarget().distanceTo(new THREE.Vector3(0,0,0)) > 0.1) {
        controls.setTarget(controls.getTarget().lerp(new THREE.Vector3(0,0,0), 0.03));
        controls.object.position.lerp(new THREE.Vector3(0, 100, 200), 0.03);
      }

      Object.entries(planetsRef.current).forEach(([name, planetObj]) => {
        const planetData = planetsData.find(p => p.name === name);
        if (planetData) {
          planetObj.mesh.rotation.y += 0.15;
          
          planetObj.group.rotation.y += 0.005 * (365.25 / planetData.orbitalPeriod);
        }
      });

      sun.rotation.y += 0.03;
      corona.rotation.y -= 0.02;

      stars.rotation.y += 0.00005;

      controls.update();
      renderer.render(scene, cam);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      if (!mountRef.current || !cam || !renderer) return;
      
      // Use requestAnimationFrame to prevent forced reflow
      requestAnimationFrame(() => {
        const width = mountRef.current!.clientWidth;
        const height = mountRef.current!.clientHeight;
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
    };
    
    const debouncedHandleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedHandleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedHandleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      isInitialized.current = false;
    };
  }, [containerSize, targetPlanetPosition]);

  useEffect(() => {
    if (isInitialized.current) {
      updatePlanetaryPositions();
    }
  }, []);

  const hoveredPlanetData = hoveredPlanet ? 
    planetsData.find(p => p.name === hoveredPlanet) : null;

  return (
    <div 
      className="w-full max-w-full mx-auto rounded-lg overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
        border: isDarkMode 
          ? '1px solid rgba(148, 163, 184, 0.1)' 
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: isDarkMode
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="relative">
        <div
          ref={mountRef} 
          className="w-full h-[40vh] cursor-grab active:cursor-grabbing"
          onMouseMove={handleCanvasInteraction}
          onClick={handleCanvasInteraction}
          style={{ touchAction: 'none' }}
        />
        
        {hoveredPlanet && hoveredPlanetData && (
          <div
            className="absolute pointer-events-none z-10 p-3 rounded-lg max-w-xs"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)',
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              color: isDarkMode ? '#ffffff' : '#000000',
              border: isDarkMode ? '1px solid #fbbf24' : '1px solid #f59e0b',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3 
              className="font-bold text-lg"
              style={{ color: isDarkMode ? '#fbbf24' : '#f59e0b' }}
            >
              {hoveredPlanetData.name}
            </h3>
            <p 
              className="text-sm mb-2"
              style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}
            >
              {hoveredPlanetData.description}
            </p>
            <p 
              className="text-xs"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              {hoveredPlanetData.facts}
            </p>
            <div 
              className="text-xs mt-2"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              <p>Orbital Period: {hoveredPlanetData.orbitalPeriod.toFixed(1)} days</p>
              <p>Distance from Sun: {hoveredPlanetData.distance * 5.9} million km</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSolarSystem;