'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

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
    const geometry = new THREE.BoxGeometry(2.2, 1.4, 0.08)
    const material = new THREE.MeshStandardMaterial({ color: 0xcaa23a, metalness: 0.7, roughness: 0.35 })
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)
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
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
