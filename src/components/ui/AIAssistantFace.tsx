import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const AIAssistantFace: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const faceMeshRef = useRef<THREE.Mesh | null>(null);
  const eyesRef = useRef<THREE.Group[]>([]);
  const mouthRef = useRef<THREE.Mesh | null>(null);

  const [currentExpression, setCurrentExpression] = useState<string>('idle');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<string>('online');
  const [chatMessage, setChatMessage] = useState<string>('');

  // Expression states with realistic parameters
  const expressions = {
    idle: { eyeScale: 1, mouthOpen: 0, blinkRate: 3000 },
    thinking: { eyeScale: 0.9, mouthOpen: 0.1, blinkRate: 1000 },
    happy: { eyeScale: 0.95, mouthOpen: -0.2, blinkRate: 2000 },
    confused: { eyeScale: 1.05, mouthOpen: 0.15, blinkRate: 3500 },
    error: { eyeScale: 1.1, mouthOpen: 0.2, blinkRate: 500 },
    excited: { eyeScale: 0.9, mouthOpen: -0.25, blinkRate: 1500 },
    sad: { eyeScale: 1.05, mouthOpen: 0.1, blinkRate: 4000 },
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Realistic face geometry
    const headGeometry = new THREE.SphereGeometry(1, 64, 64);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd1dc,
      roughness: 0.5,
      metalness: 0.1,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0;
    scene.add(head);
    faceMeshRef.current = head;

    // Eyes (simplified realistic eyes)
    const eyeGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilGeometry = new THREE.SphereGeometry(0.07, 32, 32);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    const leftEye = new THREE.Group();
    const leftEyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.z = 0.1;
    leftEye.add(leftEyeball, leftPupil);
    leftEye.position.set(-0.3, 0, 0.5);
    scene.add(leftEye);

    const rightEye = new THREE.Group();
    const rightEyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.z = 0.1;
    rightEye.add(rightEyeball, rightPupil);
    rightEye.position.set(0.3, 0, 0.5);
    scene.add(rightEye);
    eyesRef.current = [leftEye, rightEye];

    // Mouth (simplified realistic mouth)
    const mouthShape = new THREE.Shape()
      .moveTo(-0.2, 0)
      .quadraticCurveTo(0, 0.2, 0.2, 0)
      .lineTo(0.2, -0.1)
      .quadraticCurveTo(0, -0.3, -0.2, -0.1)
      .closePath();
    const mouthGeometry = new THREE.ShapeGeometry(mouthShape);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xff8c94 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.5, 0.5);
    mouth.scale.y = 0.5;
    scene.add(mouth);
    mouthRef.current = mouth;

    // Lighting for realism
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 3, 2);
    scene.add(directionalLight);

    camera.position.z = 3;

    // Animation loop with smooth transitions
    const animate = () => {
      requestAnimationFrame(animate);
      if (faceMeshRef.current) {
        faceMeshRef.current.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // Apply expression changes with smooth animation
  useEffect(() => {
    const expr = expressions[currentExpression as keyof typeof expressions];
    [faceMeshRef.current, ...eyesRef.current, mouthRef.current].forEach((mesh) => {
      if (mesh) {
        gsap.to(mesh.scale, {
          y: expr.eyeScale + (mesh === mouthRef.current ? expr.mouthOpen : 0),
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });

    const blinkInterval = setInterval(() => {
      eyesRef.current.forEach((eye) => {
        gsap.to(eye.scale, {
          y: 0.1,
          duration: 0.1,
          onComplete: () => {
            gsap.to(eye.scale, { y: expr.eyeScale, duration: 0.1 });
          },
        });
      });
    }, expr.blinkRate);

    return () => clearInterval(blinkInterval);
  }, [currentExpression]);

  // Auto-detect expression based on chat content
  const analyzeMessage = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('error') || lowerMsg.includes('sorry') || lowerMsg.includes('cannot')) return 'error';
    if (lowerMsg.includes('!') || lowerMsg.includes('great') || lowerMsg.includes('awesome')) return 'excited';
    if (lowerMsg.includes('?') || lowerMsg.includes('confused') || lowerMsg.includes('unclear')) return 'confused';
    if (lowerMsg.includes('sad') || lowerMsg.includes('unfortunately')) return 'sad';
    if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('yes')) return 'happy';
    return 'idle';
  };

  const handleChatSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chatMessage.trim()) {
      setIsThinking(true);
      setCurrentExpression('thinking');
      setTimeout(() => {
        setIsThinking(false);
        const newExpression = analyzeMessage(chatMessage);
        setCurrentExpression(newExpression);
        setTimeout(() => setCurrentExpression('idle'), 3000);
      }, 1500);
      setChatMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h3>
      <div ref={mountRef} className="border-2 border-gray-200 rounded-full bg-white shadow-inner w-[200px] h-[200px]" />
      <div className="flex flex-wrap gap-2 mb-4 mt-4">
        {Object.keys(expressions).map((expr) => (
          <button
            key={expr}
            onClick={() => setCurrentExpression(expr)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              currentExpression === expr ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {expr.charAt(0).toUpperCase() + expr.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Server:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          serverStatus === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {serverStatus}
        </span>
      </div>
      <div className="w-full max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleChatSubmit}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => chatMessage.trim() && handleChatSubmit({ key: 'Enter' } as any)}
            disabled={isThinking}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isThinking ? '...' : 'Send'}
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Status: {isThinking ? 'Thinking...' : `Feeling ${currentExpression}`}</p>
        <p className="text-xs text-gray-400 mt-1">{serverStatus === 'offline' ? 'Connection lost' : 'Connected'}</p>
      </div>
    </div>
  );
};

export default AIAssistantFace;