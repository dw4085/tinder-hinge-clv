import { useEffect, useState, useRef } from 'react'

function PulseLine({ clvData, values }) {
  const [animated, setAnimated] = useState(false)
  const svgRef = useRef(null)
  
  useEffect(() => {
    setAnimated(false)
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [clvData, values])

  // Generate pulse points for Tinder (longer, lower amplitude)
  const generateTinderPulse = () => {
    const points = []
    const width = 340
    const height = 120
    const centerY = height / 2
    
    // Tinder: longer tenure, lower intensity (spread out over time)
    const tenureScale = values.tinderTenure / 12 // normalize to 1 year
    const amplitude = (values.tinderRPP / 35) * 30 // scale by RPP
    
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width + 30
      let y = centerY
      
      // Create heartbeat-like pattern with multiple sessions
      for (let session = 0; session < values.tinderSessions; session++) {
        const sessionStart = (session / values.tinderSessions) * 100
        const sessionEnd = sessionStart + (values.tinderTenure / (values.tinderSessions * 12)) * 100
        
        if (i >= sessionStart && i <= sessionEnd) {
          const sessionProgress = (i - sessionStart) / (sessionEnd - sessionStart)
          // Bell curve intensity
          const intensity = Math.sin(sessionProgress * Math.PI) * amplitude
          y = centerY - intensity
        }
      }
      
      points.push(`${x},${y}`)
    }
    
    return points.join(' ')
  }

  // Generate pulse points for Hinge (shorter, higher amplitude)
  const generateHingePulse = () => {
    const points = []
    const width = 340
    const height = 120
    const centerY = height / 2
    
    // Hinge: shorter tenure, higher intensity
    const amplitude = (values.hingeRPP / 50) * 40 // scale by RPP (higher base)
    
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width + 30
      let y = centerY
      
      // Create heartbeat-like pattern with sessions
      for (let session = 0; session < values.hingeSessions; session++) {
        const sessionStart = (session / values.hingeSessions) * 100
        const sessionEnd = sessionStart + (values.hingeTenure / (values.hingeSessions * 12)) * 100
        
        if (i >= sessionStart && i <= sessionEnd) {
          const sessionProgress = (i - sessionStart) / (sessionEnd - sessionStart)
          // Sharper peak for Hinge
          const intensity = Math.pow(Math.sin(sessionProgress * Math.PI), 0.7) * amplitude
          y = centerY - intensity
        }
      }
      
      points.push(`${x},${y}`)
    }
    
    return points.join(' ')
  }

  const tinderPath = generateTinderPulse()
  const hingePath = generateHingePulse()

  return (
    <div className="pulse-chart">
      <h3 className="pulse-chart__title">CLV Intensity Over 10-Year Horizon</h3>
      
      <p style={{ 
        fontSize: '0.85rem', 
        color: 'var(--warm-gray-500)', 
        marginBottom: 'var(--space-lg)',
        textAlign: 'center'
      }}>
        Visualizing how customer value accumulates over time: Tinder's longer, lower-intensity engagement vs. Hinge's shorter, higher-intensity bursts
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        {/* Tinder Pulse */}
        <div>
          <h4 style={{ 
            textAlign: 'center', 
            color: 'var(--tinder-coral)',
            marginBottom: 'var(--space-md)',
            fontSize: '0.9rem'
          }}>
            🔥 Tinder ({values.tinderSessions} sessions)
          </h4>
          <svg 
            ref={svgRef}
            viewBox="0 0 400 140" 
            style={{ width: '100%', height: 'auto' }}
            role="img"
            aria-label="Tinder CLV pulse visualization"
          >
            <defs>
              <linearGradient id="tinderPulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FE3C72" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#FE3C72" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <line x1="30" y1="20" x2="30" y2="120" stroke="var(--warm-gray-200)" strokeWidth="1"/>
            <line x1="30" y1="120" x2="370" y2="120" stroke="var(--warm-gray-200)" strokeWidth="1"/>
            
            {/* Time labels */}
            <text x="30" y="135" fontSize="10" fill="var(--warm-gray-400)">0</text>
            <text x="195" y="135" fontSize="10" fill="var(--warm-gray-400)" textAnchor="middle">5yr</text>
            <text x="360" y="135" fontSize="10" fill="var(--warm-gray-400)" textAnchor="end">10yr</text>
            
            {/* Baseline */}
            <line x1="30" y1="70" x2="370" y2="70" stroke="var(--warm-gray-200)" strokeDasharray="4" strokeWidth="1"/>
            
            {/* Pulse area */}
            <polygon 
              points={`30,70 ${tinderPath} 370,70`}
              fill="url(#tinderPulseGrad)"
              style={{
                opacity: animated ? 1 : 0,
                transition: 'opacity 0.8s ease'
              }}
            />
            
            {/* Pulse line */}
            <polyline 
              points={tinderPath}
              fill="none"
              stroke="#FE3C72"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: animated ? 'none' : '1000',
                strokeDashoffset: animated ? '0' : '1000',
                transition: 'stroke-dashoffset 1.5s ease'
              }}
            />
          </svg>
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-sm)',
            padding: 'var(--space-sm)',
            background: 'rgba(254, 60, 114, 0.1)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--tinder-coral)' }}>
              ${clvData.tinderExtendedCLV.toFixed(2)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--warm-gray-500)', marginLeft: '0.5rem' }}>
              10yr Extended CLV
            </span>
          </div>
        </div>

        {/* Hinge Pulse */}
        <div>
          <h4 style={{ 
            textAlign: 'center', 
            color: 'var(--hinge-burgundy)',
            marginBottom: 'var(--space-md)',
            fontSize: '0.9rem'
          }}>
            💜 Hinge ({values.hingeSessions} sessions)
          </h4>
          <svg 
            viewBox="0 0 400 140" 
            style={{ width: '100%', height: 'auto' }}
            role="img"
            aria-label="Hinge CLV pulse visualization"
          >
            <defs>
              <linearGradient id="hingePulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7D2E4D" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#7D2E4D" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <line x1="30" y1="20" x2="30" y2="120" stroke="var(--warm-gray-200)" strokeWidth="1"/>
            <line x1="30" y1="120" x2="370" y2="120" stroke="var(--warm-gray-200)" strokeWidth="1"/>
            
            {/* Time labels */}
            <text x="30" y="135" fontSize="10" fill="var(--warm-gray-400)">0</text>
            <text x="195" y="135" fontSize="10" fill="var(--warm-gray-400)" textAnchor="middle">5yr</text>
            <text x="360" y="135" fontSize="10" fill="var(--warm-gray-400)" textAnchor="end">10yr</text>
            
            {/* Baseline */}
            <line x1="30" y1="70" x2="370" y2="70" stroke="var(--warm-gray-200)" strokeDasharray="4" strokeWidth="1"/>
            
            {/* Pulse area */}
            <polygon 
              points={`30,70 ${hingePath} 370,70`}
              fill="url(#hingePulseGrad)"
              style={{
                opacity: animated ? 1 : 0,
                transition: 'opacity 0.8s ease'
              }}
            />
            
            {/* Pulse line */}
            <polyline 
              points={hingePath}
              fill="none"
              stroke="#7D2E4D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: animated ? 'none' : '1000',
                strokeDashoffset: animated ? '0' : '1000',
                transition: 'stroke-dashoffset 1.5s ease'
              }}
            />
          </svg>
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-sm)',
            padding: 'var(--space-sm)',
            background: 'rgba(125, 46, 77, 0.1)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--hinge-burgundy)' }}>
              ${clvData.hingeExtendedCLV.toFixed(2)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--warm-gray-500)', marginLeft: '0.5rem' }}>
              10yr Extended CLV
            </span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div style={{ 
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-lg)',
        background: 'var(--warm-gray-100)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray-600)' }}>
          <strong>The Resurrection Factor:</strong> {' '}
          {clvData.extendedWinner === 'tinder' 
            ? `Tinder's ${values.tinderSessions} sessions over 10 years give it a $${(clvData.tinderExtendedCLV - clvData.hingeExtendedCLV).toFixed(2)} extended CLV advantage despite lower per-session value.`
            : `Even with fewer sessions (${values.hingeSessions} vs ${values.tinderSessions}), Hinge's higher per-session value gives it a $${(clvData.hingeExtendedCLV - clvData.tinderExtendedCLV).toFixed(2)} extended CLV advantage.`
          }
        </p>
      </div>
    </div>
  )
}

export default PulseLine
