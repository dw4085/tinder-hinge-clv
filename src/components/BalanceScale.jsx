import { useEffect, useState } from 'react'

function BalanceScale({ clvData }) {
  const [animate, setAnimate] = useState(false)
  
  useEffect(() => {
    setAnimate(false)
    const timer = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [clvData.tinderContributionCLV, clvData.hingeContributionCLV])

  // Calculate tilt angle based on CLV difference
  const maxCLV = Math.max(clvData.tinderContributionCLV, clvData.hingeContributionCLV)
  const minCLV = Math.min(clvData.tinderContributionCLV, clvData.hingeContributionCLV)
  const ratio = maxCLV / minCLV
  
  // Tilt angle: positive = Hinge heavier (tilts right down), negative = Tinder heavier
  const maxTilt = 15
  let tiltAngle = 0
  if (clvData.hingeContributionCLV > clvData.tinderContributionCLV) {
    tiltAngle = Math.min((ratio - 1) * 30, maxTilt)
  } else {
    tiltAngle = -Math.min((ratio - 1) * 30, maxTilt)
  }

  return (
    <div className="balance-scale">
      <h3 className="balance-scale__title">Strategic Balance: Which Platform to Prioritize?</h3>
      
      <svg 
        viewBox="0 0 400 250" 
        style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'block' }}
        role="img"
        aria-label={`Balance scale showing ${clvData.winner === 'hinge' ? 'Hinge' : 'Tinder'} has higher CLV`}
      >
        {/* Base/Stand */}
        <defs>
          <linearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7D2E4D" />
            <stop offset="100%" stopColor="#B85C75" />
          </linearGradient>
          <linearGradient id="tinderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FE3C72" />
            <stop offset="100%" stopColor="#FF6B5B" />
          </linearGradient>
          <linearGradient id="hingeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7D2E4D" />
            <stop offset="100%" stopColor="#B85C75" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Base triangle */}
        <polygon 
          points="200,230 170,250 230,250" 
          fill="url(#standGradient)"
        />
        
        {/* Stand post */}
        <rect 
          x="195" 
          y="120" 
          width="10" 
          height="110" 
          fill="url(#standGradient)"
          rx="2"
        />
        
        {/* Pivot point */}
        <circle cx="200" cy="120" r="8" fill="url(#standGradient)" />
        
        {/* Balance beam */}
        <g 
          style={{ 
            transformOrigin: '200px 120px',
            transform: animate ? `rotate(${tiltAngle}deg)` : 'rotate(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Beam */}
          <rect 
            x="50" 
            y="115" 
            width="300" 
            height="10" 
            fill="url(#standGradient)"
            rx="3"
          />
          
          {/* Left chain (Tinder) */}
          <line x1="80" y1="125" x2="80" y2="170" stroke="#E8E0D8" strokeWidth="2"/>
          <line x1="70" y1="125" x2="70" y2="170" stroke="#E8E0D8" strokeWidth="2"/>
          
          {/* Right chain (Hinge) */}
          <line x1="320" y1="125" x2="320" y2="170" stroke="#E8E0D8" strokeWidth="2"/>
          <line x1="330" y1="125" x2="330" y2="170" stroke="#E8E0D8" strokeWidth="2"/>
          
          {/* Tinder pan */}
          <ellipse 
            cx="75" 
            cy="180" 
            rx="45" 
            ry="15" 
            fill="url(#tinderGradient)"
            filter="url(#shadow)"
          />
          <text 
            x="75" 
            y="175" 
            textAnchor="middle" 
            fontSize="12" 
            fill="white"
            fontWeight="600"
          >
            🔥 Tinder
          </text>
          <text 
            x="75" 
            y="190" 
            textAnchor="middle" 
            fontSize="10" 
            fill="white"
          >
            ${clvData.tinderContributionCLV.toFixed(0)}
          </text>
          
          {/* Hinge pan */}
          <ellipse 
            cx="325" 
            cy="180" 
            rx="45" 
            ry="15" 
            fill="url(#hingeGradient)"
            filter="url(#shadow)"
          />
          <text 
            x="325" 
            y="175" 
            textAnchor="middle" 
            fontSize="12" 
            fill="white"
            fontWeight="600"
          >
            💜 Hinge
          </text>
          <text 
            x="325" 
            y="190" 
            textAnchor="middle" 
            fontSize="10" 
            fill="white"
          >
            ${clvData.hingeContributionCLV.toFixed(0)}
          </text>
        </g>
      </svg>
      
      <p style={{ 
        textAlign: 'center', 
        color: 'var(--warm-gray-500)', 
        fontSize: '0.85rem',
        marginTop: 'var(--space-md)'
      }}>
        The scale tips toward the platform with higher contribution CLV
      </p>
    </div>
  )
}

export default BalanceScale
