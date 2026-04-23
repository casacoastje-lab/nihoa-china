import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Clean up WebGL resources when changing models/unmounting
  useEffect(() => {
    return () => {
      try {
        useGLTF.clear(url);
      } catch (e) {
        console.warn('Error clearing GLTF:', e);
      }
    };
  }, [url]);

  return <primitive object={scene} />;
}

// Preload standard URL for smoother first load - wrapped to prevent errors halting app
try {
  useGLTF.preload('https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/forbidden_city_model_-.glb');
} catch (e) {
  console.warn('Failed to preload 3D model:', e);
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 150] }} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center justify-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-2xl">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <div className="text-sm font-serif italic text-foreground whitespace-nowrap font-bold">Loading 3D Module...</div>
            </div>
          </Html>
        }>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.5} makeDefault />
      </Canvas>
    </div>
  );
}
