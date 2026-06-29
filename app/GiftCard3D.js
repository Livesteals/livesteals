'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Card() {
  const group = useRef()

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.position.y = Math.sin(t * 1.1) * 0.15
    const targetY = t * 0.25 + state.pointer.x * 0.4
    const targetX = -state.pointer.y * 0.3
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(delta * 3, 1)
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(delta * 3, 1)
  })

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#caa23a" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  )
}

export default function GiftCard3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color="#ffd98a" />
      <pointLight position={[-3, -2, -3]} intensity={1.2} color="#ff3b3b" />
      <Card />
    </Canvas>
  )
}
