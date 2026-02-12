"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function BrainBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup = () => {}

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

      // --- 1. Definir colores para los temas ---
      const darkColor = new THREE.Color(0x00f2ff); // Cian neón para modo oscuro
      const lightColor = new THREE.Color(0x0891b2); // Un cian más oscuro y visible para el modo claro

      // --- 2. EL NÚCLEO (Esfera) ---
      const coreGeo = new THREE.IcosahedronGeometry(10, 1) 
      const edges = new THREE.EdgesGeometry(coreGeo)
      const coreMat = new THREE.LineBasicMaterial({ 
        color: darkColor, // Color inicial
        linewidth: 2.25, // Aquí puedes ajustar el grosor para mejorarlo
        transparent: true,
        opacity: 0.7 
      }) 
      const coreLines = new THREE.LineSegments(edges, coreMat)
      mainGroup.add(coreLines)

      // --- 3. LA ATMÓSFERA (Puntos) ---
      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = 150 // Reducido para que el cerebro sea el protagonista
      const posArray = new Float32Array(particleCount * 3)
      
      for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40 // Un poco más de dispersión
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: darkColor, // Color inicial
        transparent: true,
        opacity: 0.3,
      })
      
      const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
      mainGroup.add(particlesMesh)

      // --- 4. Lógica de Tema (Claro/Oscuro) ---
      const updateTheme = () => {
        const isLight = document.body.classList.contains('light-mode');
        const newColor = isLight ? lightColor : darkColor;
        coreMat.color.set(newColor);
        particlesMat.color.set(newColor);
        // También ajustamos la opacidad general del canvas para mejor visibilidad en modo claro
        canvas.style.opacity = isLight ? '1' : '0.4';
      }

      // Observador para cambios en el body (cambio de tema)
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            updateTheme();
          }
        });
      });
      observer.observe(document.body, { attributes: true });

      // --- 5. Lógica de Tamaño (PC/Móvil) ---
      const updateCameraPosition = () => {
        // En móvil (menos de 768px), alejamos la cámara para que el cerebro se vea más pequeño
        camera.position.z = window.innerWidth < 768 ? 40 : 25;
      }
      
      // Llamadas iniciales
      updateCameraPosition();
      updateTheme();


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
        
        coreLines.rotation.y += 0.002
        coreLines.rotation.x += 0.001
        particlesMesh.rotation.y -= 0.0015
        
        mainGroup.rotation.y += 0.05 * (mouseX - mainGroup.rotation.y)
        mainGroup.rotation.x += 0.05 * (mouseY - mainGroup.rotation.x)

        renderer.render(scene, camera)
      }
      animate()

      // Limpieza y responsividad
      const handleResize = () => {
        // Actualizar tamaño del renderer y aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        // Actualizar posición de la cámara según el nuevo tamaño
        updateCameraPosition();
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("mousemove", handleMouseMove)
        observer.disconnect() // <--- Importante: desconectar el observador
        coreGeo.dispose()
        edges.dispose()
        particlesGeo.dispose()
        renderer.dispose()
      }
    }

    initAnimation()

    return () => cleanup()
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      id="bg-canvas" 
      className="fixed top-0 left-0 z-0 w-full h-full opacity-40 transition-opacity duration-300 pointer-events-none"
    />
  )
}
