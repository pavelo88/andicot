"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function BrainBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup = () => {}

    // ==========================================
    // "NÚCLEO DE PROCESAMIENTO" UNIFICADO (Three.js)
    // ==========================================
    const initAnimation = () => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      // 1. EL NÚCLEO (Esfera de Alambre Tecnológica) - LÍNEAS MÁS GRUESAS
      const coreGeo = new THREE.IcosahedronGeometry(10, 1) 
      const edges = new THREE.EdgesGeometry(coreGeo)
      const coreMat = new THREE.LineBasicMaterial({ 
        color: 0x00f2ff, 
        linewidth: 1.25, 
        transparent: true,
        opacity: 0.4
      }) 
      const coreLines = new THREE.LineSegments(edges, coreMat)
      mainGroup.add(coreLines)

      // 2. LA ATMÓSFERA (Nube de Puntos Orbitando)
      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = 700
      const posArray = new Float32Array(particleCount * 3)
      
      for(let i = 0; i < particleCount * 3; i++) {
        // Reducimos la dispersión para un efecto más "comprimido"
        posArray[i] = (Math.random() - 0.5) * 30 
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

      // Posición de la cámara alejada para un efecto "más chico"
      camera.position.z = 28

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
        coreLines.rotation.y += 0.002
        coreLines.rotation.x += 0.001

        // Rotar Atmósfera
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
        edges.dispose()
        particlesGeo.dispose()
        renderer.dispose()
      }
    }

    // --- EJECUTAR ANIMACIÓN UNIFICADA ---
    initAnimation()

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
