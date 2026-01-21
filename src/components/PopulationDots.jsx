function PopulationDots({ genderRatio, funnelMultiplier }) {
  // Create array of 100 dots representing the user base
  const totalDots = 100
  const maleDots = Math.round(genderRatio)
  const femaleDots = totalDots - maleDots
  
  const dots = []
  
  // Shuffle dots for visual variety (but keep consistent for same ratio)
  for (let i = 0; i < totalDots; i++) {
    const isMale = i < maleDots
    dots.push({
      id: i,
      gender: isMale ? 'male' : 'female'
    })
  }
  
  // Shuffle array deterministically based on ratio
  const shuffled = dots.sort((a, b) => {
    const aVal = (a.id * 7 + (a.gender === 'male' ? 3 : 11)) % 100
    const bVal = (b.id * 7 + (b.gender === 'male' ? 3 : 11)) % 100
    return aVal - bVal
  })

  // Calculate funnel metrics
  const tinderSwipesPerPhoneNumber = 25000
  const hingeSwipesPerPhoneNumber = Math.round(tinderSwipesPerPhoneNumber / funnelMultiplier)
  const efficiencyGain = Math.round((1 - (1 / funnelMultiplier)) * 100)

  return (
    <div className="population-dots">
      {/* Gender Distribution Section */}
      <h3 className="population-dots__title">Tinder Gender Distribution</h3>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        color: 'var(--warm-gray-500)',
        marginBottom: 'var(--space-lg)'
      }}>
        Each icon represents 1% of Tinder's user base
      </p>
      
      <div className="population-dots__grid" role="img" aria-label={`Gender distribution: ${maleDots}% male, ${femaleDots}% female`}>
        {shuffled.map((dot) => (
          <div 
            key={dot.id} 
            className={`population-dot population-dot--${dot.gender}`}
            title={dot.gender === 'male' ? 'Male user' : 'Female user'}
          >
            {dot.gender === 'male' ? '♂' : '♀'}
          </div>
        ))}
      </div>
      
      <div className="population-dots__legend">
        <div className="population-dots__legend-item">
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: 'rgba(100, 149, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4169E1',
            fontSize: '12px'
          }}>♂</div>
          <span>Male ({maleDots}%)</span>
        </div>
        <div className="population-dots__legend-item">
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: 'rgba(255, 105, 180, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF69B4',
            fontSize: '12px'
          }}>♀</div>
          <span>Female ({femaleDots}%)</span>
        </div>
      </div>

      {/* Crowding Effect Insight */}
      <div style={{ 
        marginTop: 'var(--space-xl)', 
        padding: 'var(--space-lg)',
        background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--warm-gray-200)'
      }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)', color: 'var(--warm-gray-700)' }}>
          The Crowding Effect
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)', marginBottom: 'var(--space-sm)' }}>
          With a <strong>{maleDots}:{femaleDots}</strong> ratio, each female user has <strong>{(maleDots / femaleDots).toFixed(1)}</strong> male users competing for her attention.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)' }}>
          This creates <em>negative network effects</em> for male users: adding more men to the platform actually <em>hurts</em> other men by increasing competition.
        </p>
      </div>

      {/* Match Rate Comparison */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--space-md)',
        marginTop: 'var(--space-lg)'
      }}>
        <div style={{ 
          padding: 'var(--space-lg)',
          background: 'rgba(100, 149, 237, 0.1)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4169E1', fontFamily: 'var(--font-display)' }}>
            0.6%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--warm-gray-500)' }}>
            Tinder Male Match Rate
          </div>
        </div>
        <div style={{ 
          padding: 'var(--space-lg)',
          background: 'rgba(255, 105, 180, 0.1)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FF69B4', fontFamily: 'var(--font-display)' }}>
            10.5%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--warm-gray-500)' }}>
            Tinder Female Match Rate
          </div>
        </div>
      </div>

      {/* Funnel Efficiency Section */}
      <div style={{ 
        marginTop: 'var(--space-2xl)',
        paddingTop: 'var(--space-xl)',
        borderTop: '1px solid var(--warm-gray-200)'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-lg)',
          color: 'var(--warm-gray-700)',
          fontFamily: 'var(--font-display)'
        }}>
          Hinge Funnel Efficiency: {funnelMultiplier}x
        </h3>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.9rem', 
          color: 'var(--warm-gray-500)',
          marginBottom: 'var(--space-xl)',
          maxWidth: '500px',
          margin: '0 auto var(--space-xl)'
        }}>
          Hinge's curation (prompts, limited likes, intentional engagement) improves conversion efficiency
        </p>

        {/* Swipes/Likes needed comparison */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 'var(--space-lg)',
        }}>
          <div style={{ 
            padding: 'var(--space-xl)',
            background: 'linear-gradient(135deg, rgba(254, 60, 114, 0.1) 0%, rgba(255, 107, 91, 0.1) 100%)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            border: '1px solid rgba(254, 60, 114, 0.2)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
              🔥 Tinder
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--tinder-coral)', fontFamily: 'var(--font-display)' }}>
              {tinderSwipesPerPhoneNumber.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)' }}>
              swipes per phone number
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--space-xl)',
            background: 'linear-gradient(135deg, rgba(125, 46, 77, 0.1) 0%, rgba(184, 92, 117, 0.1) 100%)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            border: '1px solid rgba(125, 46, 77, 0.2)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
              💜 Hinge
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hinge-burgundy)', fontFamily: 'var(--font-display)' }}>
              {hingeSwipesPerPhoneNumber.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)' }}>
              likes per phone number
            </div>
          </div>
        </div>

        {/* Efficiency Summary */}
        <div style={{ 
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          background: 'linear-gradient(135deg, var(--hinge-burgundy) 0%, var(--hinge-rose) 100%)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
            {efficiencyGain}% fewer interactions needed
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Hinge users reach meaningful outcomes with {funnelMultiplier}x less effort
          </div>
        </div>

        {/* Strategic Insight */}
        <div style={{ 
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-lg)',
          background: 'var(--warm-gray-100)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)', color: 'var(--warm-gray-700)' }}>
            Strategic Implication
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)', margin: 0 }}>
            {funnelMultiplier >= 3 
              ? `At ${funnelMultiplier}x efficiency, Hinge's smaller user base (12M vs 75M) becomes a feature, not a bug. Quality curation can outperform raw scale when it dramatically improves outcomes.`
              : `At ${funnelMultiplier}x efficiency, Tinder's scale advantage remains meaningful. Hinge needs significantly better curation to overcome a 6x user base disadvantage.`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopulationDots
