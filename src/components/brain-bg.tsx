"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function BrainBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // DETECTAR DISPOSITIVO
    const isMobile = window.innerWidth < 768
    let cleanup = () => {}

    // ==========================================
    // MODO PC: "NÚCLEO DE PROCESAMIENTO" (Three.js)
    // ==========================================
    const initDesktop = () => {
      const scene = new THREE.Scene()
      // Cámara ajustada para ver el núcleo completo
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      // GRUPO PRINCIPAL (Para rotar todo junto si se requiere)
      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      // 1. EL NÚCLEO (Esfera de Alambre Tecnológica)
      const coreGeo = new THREE.IcosahedronGeometry(10, 1) // Radio 10
      const coreMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f2ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
      })
      const coreSphere = new THREE.Mesh(coreGeo, coreMat)
      mainGroup.add(coreSphere)

      // 2. LA ATMÓSFERA (Nube de Puntos Orbitando)
      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = 700 // Cantidad de datos flotando
      const posArray = new Float32Array(particleCount * 3)
      
      for(let i = 0; i < particleCount * 3; i++) {
        // Distribuir puntos en una esfera más grande (Radio 14 a 22)
        posArray[i] = (Math.random() - 0.5) * 35 
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      const particlesMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.8,
      })
      
      const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
      mainGroup.add(particlesMesh)

      // Posición de la cámara
      camera.position.z = 22

      // INTERACCIÓN CON MOUSE (Efecto Parallax suave)
      let mouseX = 0
      let mouseY = 0
      
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001
      }
      document.addEventListener("mousemove", handleMouseMove)

      // LOOP DE ANIMACIÓN
      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        // Rotar Núcleo
        coreSphere.rotation.y += 0.002
        coreSphere.rotation.x += 0.001

        // Rotar Atmósfera (Sentido contrario y más lento)
        particlesMesh.rotation.y -= 0.0015
        
        // Movimiento suave con el mouse (Tilt)
        mainGroup.rotation.y += 0.05 * (mouseX - mainGroup.rotation.y)
        mainGroup.rotation.x += 0.05 * (mouseY - mainGroup.rotation.x)

        renderer.render(scene, camera)
      }
      animate()

      // Limpieza
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        coreGeo.dispose()
        particlesGeo.dispose()
        renderer.dispose()
      }
    }

    // ==========================================
    // MODO MÓVIL: "RED NEURONAL LIGERA" (Canvas 2D)
    // ==========================================
    const initMobile = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let width = window.innerWidth
      let height = window.innerHeight
      canvas.width = width
      canvas.height = height

      const globeRadius = width * 0.35 
      const rotationSpeed = 0.003
      let angleTicker = 0

      // Puntos 3D simulados
      const particles: any[] = []
      const particleCount = 100 // Optimizado para batería

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * 2 * Math.PI
        const phi = Math.acos((Math.random() * 2) - 1)
        particles.push({
          baseX: globeRadius * Math.sin(phi) * Math.cos(theta),
          baseY: globeRadius * Math.sin(phi) * Math.sin(theta),
          baseZ: globeRadius * Math.cos(phi)
        })
      }

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        ctx.clearRect(0, 0, width, height)
        
        const cx = width / 2
        const cy = height / 2
        angleTicker += rotationSpeed

        // Estilo Cyan Stark
        ctx.strokeStyle = "rgba(0, 242, 255, 0.15)"
        ctx.lineWidth = 0.5

        const projected = particles.map(p => {
          const cosY = Math.cos(angleTicker)
          const sinY = Math.sin(angleTicker)
          let x = p.baseX * cosY - p.baseZ * sinY
          let z = p.baseZ * cosY + p.baseX * sinY
          const perspective = 300 / (300 + z)
          return { x: cx + x * perspective, y: cy + p.baseY * perspective, scale: perspective }
        })

        // Dibujar Puntos y Líneas (Solo vecinos cercanos)
        for (let i = 0; i < particleCount; i++) {
          const p = projected[i]
          const alpha = Math.max(0.1, (p.scale - 0.5) * 1.5)
          ctx.fillStyle = `rgba(0, 242, 255, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5 * p.scale, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      animate()

      cleanup = () => cancelAnimationFrame(animationId)
    }

    // --- EJECUTAR SEGÚN DISPOSITIVO ---
    if (isMobile) {
      initMobile()
    } else {
      initDesktop()
    }

    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      id="bg-canvas" 
      className="fixed top-0 left-0 z-0 w-full h-full opacity-40 pointer-events-none" 
    />
  )
}
