'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Camera3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 9.8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Lighting — warm key, red rim
    scene.add(new THREE.AmbientLight(0xffffff, 0.85))
    const keyLight = new THREE.DirectionalLight(0xfff0d8, 1.6)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0xff5b3b, 2.0)
    rimLight.position.set(-4, -1, -3)
    scene.add(rimLight)
    const fillLight = new THREE.PointLight(0xffd98a, 1.0)
    fillLight.position.set(2, -2, 3)
    scene.add(fillLight)

    const group = new THREE.Group()
    const disposables = []
    function track(geo, mat) { disposables.push(geo, mat) }

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1d, metalness: 0.5, roughness: 0.45 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, metalness: 0.6, roughness: 0.4 })
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xcaa23a, metalness: 0.85, roughness: 0.28 })
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc41a1a, metalness: 0.4, roughness: 0.45 })
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x16222e, metalness: 0.95, roughness: 0.08 })

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.7, 1.7, 0.95)
    const body = new THREE.Mesh(bodyGeo, blackMat)
    group.add(body)
    track(bodyGeo, blackMat)

    // Top plate
    const topGeo = new THREE.BoxGeometry(2.7, 0.32, 0.95)
    const topPlate = new THREE.Mesh(topGeo, darkMat)
    topPlate.position.y = 1.0
    group.add(topPlate)
    track(topGeo)

    // Pentaprism / viewfinder bump
    const prismGeo = new THREE.BoxGeometry(0.8, 0.4, 0.78)
    const prism = new THREE.Mesh(prismGeo, darkMat)
    prism.position.set(0, 1.36, 0)
    group.add(prism)
    track(prismGeo)

    // Hotshoe on top of prism
    const shoeGeo = new THREE.BoxGeometry(0.34, 0.1, 0.34)
    const shoe = new THREE.Mesh(shoeGeo, blackMat)
    shoe.position.set(0, 1.61, 0)
    group.add(shoe)
    track(shoeGeo)

    // Shutter button (red)
    const shutterGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.14, 28)
    const shutter = new THREE.Mesh(shutterGeo, redMat)
    shutter.position.set(0.92, 1.2, 0.1)
    group.add(shutter)
    track(shutterGeo, redMat)

    // Dial (gold) on the other side
    const dialGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32)
    const dial = new THREE.Mesh(dialGeo, goldMat)
    dial.position.set(-0.95, 1.22, 0)
    group.add(dial)
    track(dialGeo)

    // Lens barrel (points toward viewer, +z)
    const barrelGeo = new THREE.CylinderGeometry(0.64, 0.64, 0.65, 48)
    const barrel = new THREE.Mesh(barrelGeo, darkMat)
    barrel.rotation.x = Math.PI / 2
    barrel.position.z = 0.78
    group.add(barrel)
    track(barrelGeo)

    // Lens gold ring (front face)
    const ringGeo = new THREE.CylinderGeometry(0.68, 0.66, 0.14, 48)
    const ring = new THREE.Mesh(ringGeo, goldMat)
    ring.rotation.x = Math.PI / 2
    ring.position.z = 1.12
    group.add(ring)
    track(ringGeo)

    // Lens glass
    const glassGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.07, 48)
    const glass = new THREE.Mesh(glassGeo, glassMat)
    glass.rotation.x = Math.PI / 2
    glass.position.z = 1.18
    group.add(glass)
    track(glassGeo, glassMat)

    // Red accent stripe on body
    const stripeGeo = new THREE.BoxGeometry(2.72, 0.12, 0.97)
    const stripe = new THREE.Mesh(stripeGeo, redMat)
    stripe.position.y = -0.55
    group.add(stripe)
    track(stripeGeo)

    scene.add(group)

    // Start in a 3/4 floating pose
    group.rotation.set(0.12, -0.45, 0.16)

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
      group.position.y = Math.sin(t * 1.0) * 0.18
      const targetY = -0.45 + Math.sin(t * 0.35) * 0.5 + pointer.x * 0.5
      const targetX = 0.12 + -pointer.y * 0.3
      group.rotation.y += (targetY - group.rotation.y) * Math.min(delta * 2.5, 1)
      group.rotation.x += (targetX - group.rotation.x) * Math.min(delta * 2.5, 1)
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
      disposables.forEach(d => d && d.dispose && d.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
