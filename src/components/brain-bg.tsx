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
        opacity: 0.4 
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
        size: 0.19,
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
    // MODO MÓVIL: "RED DE PLEXO DINÁMICA" (Canvas 2D)
    // ==========================================
    const initMobile = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let width = window.innerWidth
      let height = window.innerHeight
      canvas.width = width
      canvas.height = height

      const particles: any[] = []
      const particleCount = 60 // Optimizado para móviles
      const maxDistance = Math.min(width, height) / 5;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4, // Velocidad reducida
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5
        })
      }

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        ctx.clearRect(0, 0, width, height)

        particles.forEach(p => {
          p.x += p.vx
          p.y += p.vy

          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(0, 242, 255, 0.7)"
          ctx.fill()
        });

        ctx.lineWidth = 0.3
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const p1 = particles[i]
            const p2 = particles[j]
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)

            if (dist < maxDistance) {
              const opacity = 1 - (dist / maxDistance)
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(0, 242, 255, ${opacity * 0.4})`
              ctx.stroke()
            }
          }
        }
      }
      animate()

      const handleResize = () => {
          width = window.innerWidth
          height = window.innerHeight
          canvas.width = width
          canvas.height = height
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
      }
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
