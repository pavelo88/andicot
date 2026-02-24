"use client"

import React from "react"

// =========================================================
// COMPONENTE: FONDOS "BLUEPRINT" DE ALTO IMPACTO
// =========================================================
export function BlueprintBackground({ type }: { type: string }) {
  const t = type.toLowerCase()
  const accentColor = "#A4C851"; // Verde Lima

  // ---------------------------------------------------------
  // 0. DEFINICIÓN DE ANIMACIONES ULTRA-DINÁMICAS (CSS INYECTADO)
  // ---------------------------------------------------------
  const styles = (
    <style jsx global>{`
      /* Giros más rápidos y fluidos */
      @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes spin-rev-fast { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      
      /* Latido intenso */
      @keyframes pulse-intense { 
        0%, 100% { opacity: 0.5; transform: scale(1); filter: brightness(1); } 
        50% { opacity: 1; transform: scale(1.15); filter: brightness(1.5) drop-shadow(0 0 10px ${accentColor}); } 
      }
      
      /* Barrido de escáner vertical */
      @keyframes scan-sweep { 
        0% { transform: translateY(-100%); opacity: 0; } 
        30% { opacity: 1; } 
        70% { opacity: 1; } 
        100% { transform: translateY(200%); opacity: 0; } 
      }
      
      /* Flotación suave pero visible */
      @keyframes float-heavy { 
        0%, 100% { transform: translateY(0) rotateX(10deg); } 
        50% { transform: translateY(-20px) rotateX(-10deg); } 
      }
      
      /* Ondas de sonido expansivas */
      @keyframes sound-blast { 
        0% { r: 10; opacity: 1; stroke-width: 3; } 
        100% { r: 180; opacity: 0; stroke-width: 1; } 
      }

      /* Parpadeo eléctrico rápido */
      @keyframes flicker-tech {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0.8; }
        20%, 24%, 55% { opacity: 0.2; }
      }

      /* --- CLASES UTILITARIAS --- */
      .bp-spin { animation: spin-fast 12s linear infinite; transform-origin: center; }
      .bp-spin-rev { animation: spin-rev-fast 15s linear infinite; transform-origin: center; }
      .bp-pulse { animation: pulse-intense 2.5s ease-in-out infinite; transform-origin: center; }
      .bp-scan-line { animation: scan-sweep 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      .bp-float { animation: float-heavy 5s ease-in-out infinite; transform-origin: center; }
      .bp-sound { animation: sound-blast 1.8s ease-out infinite; transform-origin: center; }
      .bp-flicker { animation: flicker-tech 4s infinite rough; }
      
      /* --- FILTROS DE NEÓN GLOBAL --- */
      .neon-glow { filter: drop-shadow(0 0 5px ${accentColor}) drop-shadow(0 0 15px rgba(164, 200, 81, 0.5)); }
      .tech-grid { stroke: ${accentColor}; stroke-width: 0.5; opacity: 0.3; }
    `}</style>
  )

  const svgProps = {
    viewBox: "0 0 400 400",
    className: "w-full h-full opacity-70 mix-blend-screen absolute inset-0",
    preserveAspectRatio: "xMidYMid slice",
  }

  if (t.includes("cctv") || t.includes("camara") || t.includes("video")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <defs>
            <radialGradient id="grad-cctv" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
              <stop offset="80%" stopColor={accentColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <pattern id="tech-pat" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" className="tech-grid"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-pat)" opacity="0.4" />
          <circle cx="200" cy="200" r="60" fill="url(#grad-cctv)" className="bp-pulse neon-glow" />
          <g className="bp-spin">
             <circle cx="200" cy="200" r="140" stroke={accentColor} strokeWidth="2" fill="none" strokeDasharray="80 40" className="neon-glow" />
             <path d="M200 60 L200 40 M200 360 L200 340 M60 200 L40 200 M360 200 L340 200" stroke={accentColor} strokeWidth="3" />
          </g>
          <g className="bp-spin-rev">
             <circle cx="200" cy="200" r="170" stroke={accentColor} strokeWidth="1" fill="none" strokeDasharray="20 10" opacity="0.7" className="neon-glow" />
          </g>
          <g className="bp-flicker neon-glow" stroke={accentColor} strokeWidth="4" fill="none" strokeLinecap="round">
              <path d="M40 100 V40 H100 M300 40 H360 V100 M360 300 V360 H300 M100 360 H40 V300" />
          </g>
          <text x="50" y="380" fill={accentColor} fontFamily="Roboto, monospace" fontSize="10" opacity="0.8" className="bp-flicker">SYSTEM: OPTICAL_TRACKING // STATUS: LOCKED</text>
        </svg>
      </>
    )
  }

  if (t.includes("incendio") || t.includes("fuego") || t.includes("alarma")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <defs>
            <radialGradient id="heat-grad" cx="50%" cy="80%" r="80%">
                <stop offset="0%" stopColor="#ff5e00" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#ff0055" stopOpacity="0.6"/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.1"/>
            </radialGradient>
          </defs>
          <g className="bp-float neon-glow" style={{ mixBlendMode: 'screen' }}>
            <path d="M0 400 Q200 100 400 400" stroke="url(#heat-grad)" strokeWidth="3" fill="none" opacity="0.8" />
            <path d="M50 420 Q200 150 350 420" stroke="url(#heat-grad)" strokeWidth="3" fill="none" opacity="0.6" style={{animationDelay:'-1s'}} />
            <path d="M100 440 Q200 200 300 440" stroke="url(#heat-grad)" strokeWidth="3" fill="none" opacity="0.4" style={{animationDelay:'-2s'}} />
          </g>
          <g className="bp-pulse" transform="translate(200 100)">
             <path d="M-30 0 L30 0 L0 -50 Z" fill="#ff5e00" className="neon-glow" opacity="0.9"/>
             <circle cx="0" cy="30" r="10" fill="#ff0055" className="neon-glow" />
             <text x="0" y="60" textAnchor="middle" fill="#ff5e00" fontFamily="Roboto" fontSize="14" className="bp-flicker">ALERT</text>
          </g>
          {[...Array(10)].map((_, i) => (
              <circle key={i} cx={Math.random()*400} cy={Math.random()*400} r={Math.random()*4} fill="#ff5e00" opacity="0.6" className="bp-float" style={{animationDelay: `${Math.random()*-5}s`, animationDuration: `${3+Math.random()*4}s`}} />
          ))}
        </svg>
      </>
    )
  }

  if (t.includes("acceso") || t.includes("biom") || t.includes("puerta")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <rect x="40" y="20" width="320" height="360" rx="20" stroke={accentColor} strokeWidth="2" fill="none" className="neon-glow" opacity="0.6" />
          <g transform="translate(200 200)" opacity="0.4" className="neon-glow">
            {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx="0" cy={i*15 - 60} rx={60 - i*5} ry={20 + i*2} stroke={accentColor} strokeWidth="1" fill="none" strokeDasharray="5 5" className="bp-spin-rev" style={{animationDuration: `${20+i*2}s`}}/>
            ))}
          </g>
          <rect x="40" y="-10" width="320" height="10" fill={accentColor} className="bp-scan-line neon-glow" style={{ filter: "blur(4px) brightness(2)" }} />
          <rect x="60" y="40" width="10" height="10" fill={accentColor} className="bp-pulse" />
          <text x="80" y="50" fill={accentColor} fontFamily="Roboto" fontSize="12" className="bp-flicker">SCANNING ID...</text>
        </svg>
      </>
    )
  }

  if (t.includes("datos") || t.includes("red") || t.includes("wifi") || t.includes("fibra") || t.includes("cableado")) {
    const nodes = [
        {x: 200, y: 50, r: 15}, {x: 50, y: 250, r: 10}, {x: 350, y: 250, r: 10},
        {x: 120, y: 150, r: 8}, {x: 280, y: 150, r: 8}, {x: 200, y: 350, r: 12}
    ];
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <g className="bp-spin" style={{transformOrigin:'200px 200px'}}>
            <circle cx="200" cy="200" r="180" stroke={accentColor} strokeWidth="0.5" fill="none" strokeDasharray="10 20" opacity="0.4" />
            <circle cx="200" cy="200" r="100" stroke={accentColor} strokeWidth="1" fill="none" strokeDasharray="50 50" className="neon-glow" opacity="0.6"/>
          </g>
          <g className="neon-glow" stroke={accentColor} strokeWidth="1.5" opacity="0.7">
             <path d="M200 50 L50 250 L350 250 Z" className="bp-pulse" fill="rgba(164, 200, 81,0.05)"/>
             <path d="M120 150 L280 150 M200 50 L200 350" />
             <path d="M50 250 L200 350 L350 250" />
          </g>
          {nodes.map((n, i) => (
            <g key={i} className="bp-pulse" style={{animationDelay: `${i*0.3}s`}}>
                <circle cx={n.x} cy={n.y} r={n.r} fill={accentColor} className="neon-glow" />
                <circle cx={n.x} cy={n.y} r={n.r*2} stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" className="bp-sound" />
            </g>
          ))}
          <g transform="translate(200 200)" className="bp-flicker neon-glow">
             <path d="M-30 -10 Q0 -40 30 -10 M-20 5 Q0 -15 20 5 M-10 20 Q0 10 10 20" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
             <circle cx="0" cy="35" r="5" fill={accentColor} />
          </g>
        </svg>
      </>
    )
  }

  if (t.includes("elect") || t.includes("luz") || t.includes("ups") || t.includes("energia")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
           <defs>
               <pattern id="circuit-pat" width="100" height="100" patternUnits="userSpaceOnUse">
                   <path d="M0 50 H100 M50 0 V100 M20 20 H80 M20 80 H80" stroke={accentColor} strokeWidth="0.5" opacity="0.2" fill="none"/>
                   <circle cx="50" cy="50" r="5" fill={accentColor} opacity="0.3"/>
               </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#circuit-pat)" opacity="0.5"/>
           <path d="M240 20 L140 180 H260 L160 380" stroke={accentColor} strokeWidth="6" fill="none" className="bp-pulse neon-glow" style={{ filter: `drop-shadow(0 0 20px ${accentColor})` }} strokeLinejoin="round" />
           <g className="bp-flicker neon-glow" stroke={accentColor} strokeWidth="2" fill="none">
               <path d="M140 180 Q100 150 120 100" opacity="0.6"/>
               <path d="M260 180 Q300 210 280 260" opacity="0.6"/>
           </g>
           <rect x="20" y="350" width="100" height="30" stroke={accentColor} fill={`rgba(164, 200, 81,0.1)`} className="neon-glow"/>
           <text x="30" y="370" fill={accentColor} fontFamily="Roboto" fontSize="12" fontWeight="bold" className="bp-flicker">HIGH VOLTAGE</text>
        </svg>
      </>
    )
  }

  if (t.includes("domot") || t.includes("intel") || t.includes("auto") || t.includes("edificio") || t.includes("inmotica")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <g transform="translate(200 300) scale(1 0.5)" className="neon-glow" opacity="0.5">
             <circle cx="0" cy="0" r="150" stroke={accentColor} strokeWidth="2" fill="none" className="bp-spin"/>
             <circle cx="0" cy="0" r="100" stroke={accentColor} strokeWidth="1" fill="none" className="bp-spin-rev"/>
          </g>
          <g transform="translate(200 180)" className="bp-float neon-glow">
             <path d="M0 -120 L100 -60 L100 60 L0 120 L-100 60 L-100 -60 Z" stroke={accentColor} strokeWidth="3" fill="rgba(164, 200, 81,0.05)" />
             <path d="M0 -120 V0 M0 0 L100 60 M0 0 L-100 60 M100 -60 L0 0 L-100 -60" stroke={accentColor} strokeWidth="1.5" fill="none" />
             <circle cx="0" cy="0" r="20" fill={accentColor} className="bp-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
             </circle>
             {[0, 90, 180, 270].map((deg, i) => (
                 <g key={i} transform={`rotate(${deg}) translate(0 -140)`}>
                    <circle cx="0" cy="0" r="5" fill={accentColor} className="bp-pulse" style={{animationDelay: `${i*0.5}s`}}/>
                    <line x1="0" y1="0" x2="0" y2="20" stroke={accentColor} strokeWidth="1" opacity="0.5"/>
                 </g>
             ))}
          </g>
          <text x="20" y="40" fill={accentColor} fontFamily="Roboto" fontSize="14" className="bp-flicker" opacity="0.8">SMART_BUILDING // OS: ONLINE</text>
        </svg>
      </>
    )
  }

  if (t.includes("audio") || t.includes("evac") || t.includes("voceo") || t.includes("sonido")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <circle cx="200" cy="200" r="30" fill={accentColor} className="bp-pulse neon-glow" />
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx="200" cy="200" r="40" stroke={accentColor} strokeWidth="2" fill="none" className="bp-sound neon-glow" style={{animationDelay: `${i * 0.4}s`, animationDuration: '3s'}} />
          ))}
          <g transform="translate(50 350) scale(1 -1)" className="neon-glow" fill={accentColor} opacity="0.7">
             {[...Array(15)].map((_, i) => {
                 const h = Math.random() * 100 + 20;
                 return (
                     <rect key={i} x={i * 20} y="0" width="12" height={h} className="bp-pulse">
                        <animate attributeName="height" values={`${h};${h*1.5};${h}`} dur={`${0.5+Math.random()}s`} repeatCount="indefinite"/>
                     </rect>
                 )
             })}
          </g>
          <text x="200" y="50" textAnchor="middle" fill={accentColor} fontFamily="Roboto" fontSize="16" className="bp-flicker">EMERGENCY BROADCAST SYSTEM</text>
        </svg>
      </>
    )
  }

  if (t.includes("perimet") || t.includes("cerca") || t.includes("muro") || t.includes("barrera")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
           <rect x="20" y="20" width="30" height="360" fill={accentColor} opacity="0.3" className="neon-glow" />
           <rect x="350" y="20" width="30" height="360" fill={accentColor} opacity="0.3" className="neon-glow" />
           {[60, 100, 140, 180, 220, 260, 300, 340].map((y, i) => (
             <g key={y}>
                 <line x1="50" y1={y} x2="350" y2={y} stroke={accentColor} strokeWidth="3" className="neon-glow" style={{ filter: "blur(1px) brightness(1.5)" }}>
                    <animate attributeName="opacity" values="1;0.3;1" dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
                 </line>
                 <circle cx="50" cy={y} r="5" fill={accentColor} className="bp-pulse"/>
                 <circle cx="350" cy={y} r="5" fill={accentColor} className="bp-pulse"/>
             </g>
           ))}
           <rect x="50" y="20" width="300" height="5" fill={accentColor} opacity="0.2" className="bp-scan-line" style={{ animationDuration: '2s' }} />
           <text x="200" y="380" textAnchor="middle" fill={accentColor} fontFamily="Roboto" fontSize="12" className="bp-flicker">PERIMETER SECURE // ACTIVE IR BEAMS</text>
        </svg>
      </>
    )
  }

  if (t.includes("intrus") || t.includes("robo") || t.includes("seguridad") || t.includes("alarm")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
           <g className="bp-spin neon-glow" style={{transformOrigin:'200px 200px'}}>
             <circle cx="200" cy="200" r="160" stroke={accentColor} strokeWidth="2" fill="none" strokeDasharray="20 40" opacity="0.6" />
             <circle cx="200" cy="200" r="180" stroke={accentColor} strokeWidth="1" fill="none" strokeDasharray="5 15" opacity="0.4" />
           </g>
           <g className="bp-pulse neon-glow" transform="translate(200 200) scale(1.2)">
               <path d="M0 -100 L80 -60 V60 Q80 120 0 160 Q-80 120 -80 60 V-60 Z" stroke={accentColor} strokeWidth="4" fill="rgba(164, 200, 81,0.1)" />
               <g transform="translate(0 10)">
                   <rect x="-30" y="-10" width="60" height="50" rx="5" fill={accentColor} />
                   <path d="M-20 -10 V-30 Q-20 -50 0 -50 Q20 -50 20 -30 V-10" stroke={accentColor} strokeWidth="6" fill="none" strokeLinecap="round" />
                   <circle cx="0" cy="15" r="8" fill="#000000" />
               </g>
           </g>
           <text x="200" y="50" textAnchor="middle" fontFamily="Roboto" fontSize="16" fontWeight="bold" className="bp-flicker">
               <tspan fill={accentColor}>SYSTEM ARMED</tspan>
           </text>
        </svg>
      </>
    )
  }

  return (
    <>
      {styles}
      <svg {...svgProps} opacity="0.5">
        <defs>
            <pattern id="grid-pat" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
               <path d="M 0 20 H 40 M 20 0 V 40" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.4" className="neon-glow"/>
               <circle cx="20" cy="20" r="2" fill={accentColor} opacity="0.6" className="bp-pulse"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pat)" />
        <g className="bp-spin" style={{transformOrigin:'center'}}>
            <circle cx="200" cy="200" r="150" stroke={accentColor} strokeWidth="2" fill="none" strokeDasharray="50 50" className="neon-glow" opacity="0.7"/>
        </g>
        <g className="bp-spin-rev" style={{transformOrigin:'center'}}>
            <circle cx="200" cy="200" r="100" stroke={accentColor} strokeWidth="3" fill="none" strokeDasharray="20 20" className="neon-glow" opacity="0.5"/>
        </g>
        <circle cx="200" cy="200" r="40" fill="rgba(164, 200, 81,0.1)" stroke={accentColor} strokeWidth="2" className="bp-pulse neon-glow"/>
      </svg>
    </>
  )
}
