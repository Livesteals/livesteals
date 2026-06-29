'use client'
import { useEffect, useRef } from 'react'
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

export default function GiftCard3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dirLight = new THREE.DirectionalLight(0xffd98a, 1.4)
    dirLight.position.set(3, 3, 4)
    scene.add(dirLight)
    const pointLight = new THREE.PointLight(0xff3b3b, 1.2)
    pointLight.position.set(-3, -2, -3)
    scene.add(pointLight)

    const group = new THREE.Group()

    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xcaa23a, metalness: 0.7, roughness: 0.35 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.08), sideMaterial)
    group.add(body)

    const frontTexture = makeCardTexture()
    const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture, metalness: 0.1, roughness: 0.5 })
    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.3125), frontMaterial)
    front.position.z = 0.045
    group.add(front)

    const backMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.4 })
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.3125), backMaterial)
    back.position.z = -0.045
    back.rotation.y = Math.PI
    group.add(back)

    scene.add(group)

    let raf
    const clock = new THREE.Clock()
    const pointer = { x: 0, y: 0 }

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointerMove)

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const delta = clock.getDelta()
      group.position.y = Math.sin(t * 1.1) * 0.15
      const targetY = t * 0.25 + pointer.x * 0.4
      const targetX = -pointer.y * 0.3
      group.rotation.y += (targetY - group.rotation.y) * Math.min(delta * 3, 1)
      group.rotation.x += (targetX - group.rotation.x) * Math.min(delta * 3, 1)
      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      body.geometry.dispose()
      front.geometry.dispose()
      back.geometry.dispose()
      sideMaterial.dispose()
      frontMaterial.dispose()
      backMaterial.dispose()
      frontTexture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
