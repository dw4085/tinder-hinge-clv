import { useState, useRef } from 'react'
import { HelpCircle } from 'lucide-react'

// Tooltip explanations for each assumption
const ASSUMPTION_EXPLANATIONS = {
  churnEconomics: {
    title: "Churn Economics",
    explanation: `This assumption explores the "success paradox" of dating apps: if an app helps users find partners, those users leave. 

The key question is whether a shorter, more intense customer relationship (Hinge) generates more lifetime value than a longer, lower-engagement one (Tinder).

Customer Lifetime Value (CLV) is calculated as:
• Monthly Revenue × Tenure × Operating Margin

A user who pays $33/month for 6 months with 34% margin generates similar CLV to one who pays $18/month for 9 months with 40% margin.

The "resurrection factor" adds another dimension: users return to dating apps when relationships end. Tinder's casual positioning may drive more return visits, while Hinge's success stories may create stronger brand loyalty for returning users.`
  },
  marketTrajectory: {
    title: "Market Trajectory", 
    explanation: `This assumption tests whether Tinder's casual positioning or Hinge's relationship focus is better aligned with where the market is heading.

Key insight: 80% of Tinder users report wanting "more than casual" relationships—suggesting a mismatch between Tinder's brand and user intent.

The market has three segments:
• Casual (hookups, short-term): ~20% of market, declining
• Relationship-seeking (dating with intent): ~55% of market, growing
• Marriage-focused (explicitly seeking marriage): ~25% of market, stable

Gen Z preferences matter enormously: they're now the primary dating demographic but show lower willingness to pay for premium features (31% vs ~50% for Millennials) and stronger preference for authentic, meaningful connections.

If the relationship-seeking market grows faster, Hinge's positioning becomes increasingly valuable.`
  },
  networkEffects: {
    title: "Network Effect Quality",
    explanation: `Traditional platform theory suggests more users = more value. But dating apps may exhibit diminishing or even negative network effects at scale.

The crowding problem: Tinder's user base is ~75% male. Adding more male users doesn't help other men—it hurts them by increasing competition. Each woman has 3+ men competing for her attention, driving match rates down to 0.6% for men.

Quality vs. quantity trade-off:
• Tinder: 100 daily swipes, binary yes/no, mass swiping behavior
• Hinge: 8-10 daily likes, must engage with specific content, intentional matching

The "funnel efficiency multiplier" captures how much better Hinge's curation makes the matching process. If Hinge users need 23x fewer interactions to get a phone number, the smaller user base becomes an advantage, not a liability.

At some point, scale becomes a liability when it degrades match quality.`
  }
}

function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState('below') // 'below' or 'above'
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)
  
  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const tooltipHeight = 350 // approximate max height of tooltip
      
      // If not enough space below, show above
      if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
        setPosition('above')
      } else {
        setPosition('below')
      }
    }
    setIsVisible(true)
  }
  
  const handleMouseLeave = () => {
    // Small delay before hiding to allow mouse to move to popup
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }
  
  const handlePopupMouseEnter = () => {
    // Cancel the hide timeout when mouse enters popup
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }
  
  const handlePopupMouseLeave = () => {
    // Hide when mouse leaves popup
    setIsVisible(false)
  }
  
  const isAbove = position === 'above'
  
  return (
    <div 
      ref={triggerRef}
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
    >
      {children}
      <HelpCircle 
        size={16} 
        style={{ 
          color: 'var(--hinge-rose)', 
          cursor: 'help',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }} 
      />
      {isVisible && (
        <div 
          className="tooltip-popup"
          role="tooltip"
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          style={{
            position: 'absolute',
            ...(isAbove 
              ? { bottom: '100%', marginBottom: '8px' } 
              : { top: '100%', marginTop: '8px' }
            ),
            left: '0',
            width: '320px',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '16px',
            background: 'var(--hinge-warm-white)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 40px rgba(125, 46, 77, 0.2)',
            border: '1px solid var(--warm-gray-200)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Arrow pointing to trigger */}
          <div style={{
            position: 'absolute',
            ...(isAbove 
              ? { bottom: '-6px', transform: 'rotate(225deg)' }
              : { top: '-6px', transform: 'rotate(45deg)' }
            ),
            left: '20px',
            width: '12px',
            height: '12px',
            background: 'var(--hinge-warm-white)',
            border: '1px solid var(--warm-gray-200)',
            borderRight: 'none',
            borderBottom: 'none',
          }} />
          <h4 style={{ 
            color: 'var(--hinge-burgundy)', 
            marginBottom: '8px',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-display)'
          }}>
            {content.title}
          </h4>
          <p style={{ 
            color: 'var(--warm-gray-600)', 
            fontSize: '0.8rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
            margin: 0
          }}>
            {content.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

function Slider({ label, value, onChange, min, max, step = 1, unit = '', platform }) {
  const formatValue = (val) => {
    if (unit === '$') return `$${val.toFixed(2)}`
    if (unit === '%') return `${val}%`
    if (unit === 'mo') return `${val} mo`
    if (unit === 'x') return `${val}x`
    if (unit === 'yr') return `${val} yr`
    return val
  }

  return (
    <div className={`control-group ${platform ? `control-item--${platform}` : ''}`}>
      <div className="control-label">
        <span className="control-label__text">{label}</span>
        <span className="control-label__value">{formatValue(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  )
}

function ControlPanel({ values, updateValue, activeTab }) {
  // Render controls based on active tab
  if (activeTab === 'churn') {
    return (
      <div className="control-section">
        <div className="control-section__header">
          <Tooltip content={ASSUMPTION_EXPLANATIONS.churnEconomics}>
            <h3 className="control-section__title">Churn Economics</h3>
          </Tooltip>
        </div>
        
        <div className="control-row">
          <div className="control-item">
            <span className="control-item__label">Tinder</span>
            <Slider
              label="Paid Tenure"
              value={values.tinderTenure}
              onChange={(v) => updateValue('tinderTenure', v)}
              min={3}
              max={24}
              unit="mo"
              platform="tinder"
            />
          </div>
          <div className="control-item">
            <span className="control-item__label">Hinge</span>
            <Slider
              label="Paid Tenure"
              value={values.hingeTenure}
              onChange={(v) => updateValue('hingeTenure', v)}
              min={2}
              max={18}
              unit="mo"
              platform="hinge"
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-item">
            <Slider
              label="Operating Margin"
              value={values.tinderMargin}
              onChange={(v) => updateValue('tinderMargin', v)}
              min={20}
              max={60}
              unit="%"
              platform="tinder"
            />
          </div>
          <div className="control-item">
            <Slider
              label="Operating Margin"
              value={values.hingeMargin}
              onChange={(v) => updateValue('hingeMargin', v)}
              min={20}
              max={60}
              unit="%"
              platform="hinge"
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-item">
            <Slider
              label="RPP ($/month)"
              value={values.tinderRPP}
              onChange={(v) => updateValue('tinderRPP', v)}
              min={10}
              max={35}
              step={0.5}
              unit="$"
              platform="tinder"
            />
          </div>
          <div className="control-item">
            <Slider
              label="RPP ($/month)"
              value={values.hingeRPP}
              onChange={(v) => updateValue('hingeRPP', v)}
              min={20}
              max={50}
              step={0.5}
              unit="$"
              platform="hinge"
            />
          </div>
        </div>

        <div className="control-row">
          <div className="control-item">
            <Slider
              label="Sessions/10yr"
              value={values.tinderSessions}
              onChange={(v) => updateValue('tinderSessions', v)}
              min={1}
              max={5}
              step={0.5}
              platform="tinder"
            />
          </div>
          <div className="control-item">
            <Slider
              label="Sessions/10yr"
              value={values.hingeSessions}
              onChange={(v) => updateValue('hingeSessions', v)}
              min={1}
              max={5}
              step={0.5}
              platform="hinge"
            />
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'market') {
    return (
      <div className="control-section">
        <div className="control-section__header">
          <Tooltip content={ASSUMPTION_EXPLANATIONS.marketTrajectory}>
            <h3 className="control-section__title">Market Trajectory</h3>
          </Tooltip>
        </div>

        <Slider
          label="Casual Market CAGR"
          value={values.casualGrowth}
          onChange={(v) => updateValue('casualGrowth', v)}
          min={-25}
          max={10}
          unit="%"
        />

        <Slider
          label="Relationship Market CAGR"
          value={values.relationshipGrowth}
          onChange={(v) => updateValue('relationshipGrowth', v)}
          min={-10}
          max={30}
          unit="%"
        />

        <Slider
          label="Marriage Market CAGR"
          value={values.marriageGrowth}
          onChange={(v) => updateValue('marriageGrowth', v)}
          min={-10}
          max={15}
          unit="%"
        />

        <Slider
          label="Gen Z Willingness to Pay"
          value={values.genZWillingnessToPay}
          onChange={(v) => updateValue('genZWillingnessToPay', v)}
          min={10}
          max={60}
          unit="%"
        />

        <Slider
          label="Projection Horizon"
          value={values.timeHorizon}
          onChange={(v) => updateValue('timeHorizon', v)}
          min={3}
          max={10}
          unit="yr"
        />
      </div>
    )
  }

  if (activeTab === 'network') {
    return (
      <div className="control-section">
        <div className="control-section__header">
          <Tooltip content={ASSUMPTION_EXPLANATIONS.networkEffects}>
            <h3 className="control-section__title">Network Effect Quality</h3>
          </Tooltip>
        </div>

        <Slider
          label="Hinge Funnel Efficiency"
          value={values.hingeFunnelMultiplier}
          onChange={(v) => updateValue('hingeFunnelMultiplier', v)}
          min={1}
          max={7}
          step={0.5}
          unit="x"
        />

        <Slider
          label="Tinder % Male Users"
          value={values.tinderGenderRatio}
          onChange={(v) => updateValue('tinderGenderRatio', v)}
          min={50}
          max={90}
          unit="%"
        />
      </div>
    )
  }

  return null
}

export default ControlPanel
