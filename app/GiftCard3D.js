'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeCardTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  bg.addColorStop(0, '#b91c1c')
  bg.addColorStop(1, '#450a0a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.moveTo(canvas.width, 0)
  ctx.lineTo(canvas.width, 220)
  ctx.lineTo(canvas.width - 220, 0)
  ctx.closePath()
  ctx.fill()

  ctx.font = 'bold 64px Arial'
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'top'
  ctx.fillText('LIVE', 60, 60)
  ctx.fillStyle = '#fbbf24'
  ctx.fillText('STEALS', 60 + ctx.measureText('LIVE').width + 10, 60)

  const goldGrad = ctx.createLinearGradient(60, 280, 60, 420)
  goldGrad.addColorStop(0, '#fde68a')
  goldGrad.addColorStop(1, '#d97706')
  ctx.fillStyle = goldGrad
  ctx.font = 'bold 88px Arial'
  ctx.fillText('Amazon', 60, 280)
  ctx.fillText('Gift Card', 60, 380)

  ctx.font = 'bold 36px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('livesteals.co', 60, 540)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Card() {
  const group = useRef()
  const frontTexture = useMemo(() => makeCardTexture(), [])

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
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.1, 1.32]} />
        <meshStandardMaterial map={frontTexture} metalness={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.1, 1.32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
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
