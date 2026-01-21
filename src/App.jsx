import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import {
  Heart,
  TrendingUp,
  Users,
  Info,
  Download,
  Sparkles,
} from 'lucide-react'
import './App.css'

// Components
import ControlPanel from './components/ControlPanel'
import CLVComparison from './components/CLVComparison'
import MarketProjections from './components/MarketProjections'
import MarketDonut from './components/MarketDonut'
import PopulationDots from './components/PopulationDots'

// Default values from the case study
const DEFAULT_VALUES = {
  // Assumption 1: Churn Economics
  tinderTenure: 9,
  hingeTenure: 6,
  tinderMargin: 40,
  hingeMargin: 34,
  tinderRPP: 17.66,
  hingeRPP: 32.87,
  tinderSessions: 3,
  hingeSessions: 2,
  
  // Assumption 2: Market Trajectory
  casualGrowth: -10,
  relationshipGrowth: 15,
  marriageGrowth: 2,
  genZWillingnessToPay: 31,
  
  // Assumption 3: Network Effect Quality
  hingeFunnelMultiplier: 3,
  tinderGenderRatio: 75, // % male
  
  // Time horizon
  timeHorizon: 5
}

// Preset scenarios
const PRESETS = {
  base: {
    name: 'Base Case',
    values: { ...DEFAULT_VALUES }
  },
  tinderBull: {
    name: 'Tinder Bull Case',
    values: {
      ...DEFAULT_VALUES,
      tinderTenure: 12,
      hingeTenure: 5,
      casualGrowth: -5,
      relationshipGrowth: 10,
      hingeFunnelMultiplier: 2,
      tinderSessions: 4,
      hingeSessions: 1.5
    }
  },
  hingeBull: {
    name: 'Hinge Bull Case',
    values: {
      ...DEFAULT_VALUES,
      tinderTenure: 7,
      hingeTenure: 8,
      casualGrowth: -15,
      relationshipGrowth: 20,
      hingeFunnelMultiplier: 5,
      tinderSessions: 2,
      hingeSessions: 3
    }
  }
}

// Tab configuration
const TABS = [
  { id: 'churn', label: 'Churn Economics', icon: Heart, number: 1 },
  { id: 'market', label: 'Market Trajectory', icon: TrendingUp, number: 2 },
  { id: 'network', label: 'Network Effects', icon: Users, number: 3 },
]

function App() {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [activePreset, setActivePreset] = useState('base')
  const [activeTab, setActiveTab] = useState('churn')
  const [showInstructions, setShowInstructions] = useState(true)
  const dashboardRef = useRef(null)

  const updateValue = useCallback((key, value) => {
    setValues(prev => ({ ...prev, [key]: value }))
    setActivePreset(null) // Clear preset when manually adjusting
  }, [])

  const applyPreset = useCallback((presetKey) => {
    setValues(PRESETS[presetKey].values)
    setActivePreset(presetKey)
  }, [])

  // Calculate CLV values
  const calculateCLV = useCallback(() => {
    const tinderGrossCLV = values.tinderRPP * values.tinderTenure
    const hingeGrossCLV = values.hingeRPP * values.hingeTenure
    const tinderContributionCLV = tinderGrossCLV * (values.tinderMargin / 100)
    const hingeContributionCLV = hingeGrossCLV * (values.hingeMargin / 100)
    
    // Extended CLV with resurrection factor (10-year horizon)
    const tinderExtendedCLV = tinderContributionCLV * values.tinderSessions
    const hingeExtendedCLV = hingeContributionCLV * values.hingeSessions
    
    // Breakeven tenure for Hinge
    const breakEvenTenure = (values.tinderRPP * values.tinderTenure * values.tinderMargin) / 
                           (values.hingeRPP * values.hingeMargin)
    
    return {
      tinderGrossCLV,
      hingeGrossCLV,
      tinderContributionCLV,
      hingeContributionCLV,
      tinderExtendedCLV,
      hingeExtendedCLV,
      breakEvenTenure,
      winner: hingeContributionCLV > tinderContributionCLV ? 'hinge' : 'tinder',
      extendedWinner: hingeExtendedCLV > tinderExtendedCLV ? 'hinge' : 'tinder',
      difference: Math.abs(hingeContributionCLV - tinderContributionCLV),
      percentDifference: ((Math.max(hingeContributionCLV, tinderContributionCLV) / 
                          Math.min(hingeContributionCLV, tinderContributionCLV)) - 1) * 100
    }
  }, [values])

  // Calculate market projections
  const calculateMarketProjections = useCallback(() => {
    const baseMarket = {
      casual: { payers: 672000, revenue: 142 },
      relationship: { payers: 2770000, revenue: 1090 },
      marriage: { payers: 1750000, revenue: 756 }
    }
    
    const projections = []
    for (let year = 0; year <= values.timeHorizon; year++) {
      const casualPayers = baseMarket.casual.payers * Math.pow(1 + values.casualGrowth / 100, year)
      const relationshipPayers = baseMarket.relationship.payers * Math.pow(1 + values.relationshipGrowth / 100, year)
      const marriagePayers = baseMarket.marriage.payers * Math.pow(1 + values.marriageGrowth / 100, year)
      
      const casualRevenue = baseMarket.casual.revenue * Math.pow(1 + values.casualGrowth / 100, year)
      const relationshipRevenue = baseMarket.relationship.revenue * Math.pow(1 + values.relationshipGrowth / 100, year)
      const marriageRevenue = baseMarket.marriage.revenue * Math.pow(1 + values.marriageGrowth / 100, year)
      
      projections.push({
        year: 2025 + year,
        casualPayers: Math.round(casualPayers),
        relationshipPayers: Math.round(relationshipPayers),
        marriagePayers: Math.round(marriagePayers),
        casualRevenue: Math.round(casualRevenue),
        relationshipRevenue: Math.round(relationshipRevenue),
        marriageRevenue: Math.round(marriageRevenue),
        totalRevenue: Math.round(casualRevenue + relationshipRevenue + marriageRevenue)
      })
    }
    
    return projections
  }, [values])

  const clvData = calculateCLV()
  const marketData = calculateMarketProjections()

  // Export screenshot
  const handleExport = async () => {
    if (dashboardRef.current) {
      try {
        const canvas = await html2canvas(dashboardRef.current, {
          backgroundColor: '#FFF8F2',
          scale: 2
        })
        const link = document.createElement('a')
        link.download = `tinder-hinge-analysis-${activeTab}-${new Date().toISOString().split('T')[0]}.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('Export failed:', error)
      }
    }
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header fade-in">
          <div className="header__branding">
            <Sparkles size={16} />
            Columbia Business School — Technology Strategy
          </div>
          <h1 className="header__title">Tinder vs. Hinge Unit Economics</h1>
          <p className="header__subtitle">
            Explore how key assumptions about churn, market trajectory, and network effects 
            determine which platform Match Group should prioritize.
          </p>
        </header>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="instructions fade-in stagger-1">
            <div className="instructions__icon">
              <Info size={24} />
            </div>
            <div className="instructions__content">
              <h3>How to Use This Dashboard</h3>
              <p>
                Select an assumption tab below to explore how different factors affect the 
                Tinder vs. Hinge comparison. Each tab lets you adjust relevant parameters 
                and see the results in real-time. Use the preset buttons to quickly load 
                different scenarios for classroom debate.
              </p>
              <button 
                className="instructions__toggle"
                onClick={() => setShowInstructions(false)}
                aria-label="Hide instructions"
              >
                Hide Instructions
              </button>
            </div>
          </div>
        )}
        
        {!showInstructions && (
          <button 
            className="btn btn-secondary fade-in"
            onClick={() => setShowInstructions(true)}
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            <Info size={16} /> Show Instructions
          </button>
        )}

        {/* Preset Buttons */}
        <div className="presets fade-in stagger-2" role="group" aria-label="Scenario presets">
          <button
            className={`preset-btn preset-btn--base ${activePreset === 'base' ? 'active' : ''}`}
            onClick={() => applyPreset('base')}
            aria-pressed={activePreset === 'base'}
          >
            📊 Base Case
          </button>
          <button
            className={`preset-btn preset-btn--tinder ${activePreset === 'tinderBull' ? 'active' : ''}`}
            onClick={() => applyPreset('tinderBull')}
            aria-pressed={activePreset === 'tinderBull'}
          >
            🔥 Tinder Bull Case
          </button>
          <button
            className={`preset-btn preset-btn--hinge ${activePreset === 'hingeBull' ? 'active' : ''}`}
            onClick={() => applyPreset('hingeBull')}
            aria-pressed={activePreset === 'hingeBull'}
          >
            💜 Hinge Bull Case
          </button>
        </div>

        {/* Assumption Tabs */}
        <div className="assumption-tabs fade-in stagger-2" role="tablist" aria-label="Assumption sections">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className={`assumption-tab ${activeTab === tab.id ? 'assumption-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="assumption-tab__number">{tab.number}</span>
                <Icon size={18} />
                <span className="assumption-tab__label">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content" ref={dashboardRef}>
          {/* Assumption 1: Churn Economics */}
          {activeTab === 'churn' && (
            <div 
              id="panel-churn" 
              role="tabpanel" 
              aria-labelledby="tab-churn"
              className="tab-panel fade-in"
            >
              {/* Winner Banner - Only shows for Assumption 1 */}
              <div 
                className={`winner-banner ${clvData.winner === 'tinder' ? 'winner-banner--tinder' : ''}`}
                role="status"
                aria-live="polite"
              >
                <div className="winner-banner__label">Based on your assumptions, Match Group should prioritize</div>
                <div className="winner-banner__platform">
                  {clvData.winner === 'hinge' ? '💜 HINGE' : '🔥 TINDER'}
                </div>
                <div className="winner-banner__difference">
                  {clvData.percentDifference.toFixed(1)}% higher contribution CLV 
                  (${clvData.difference.toFixed(2)} per customer)
                </div>
              </div>

              <div className="tab-panel__grid">
                {/* Controls */}
                <aside className="tab-panel__controls">
                  <ControlPanel 
                    values={values} 
                    updateValue={updateValue} 
                    activeTab={activeTab}
                  />
                </aside>

                {/* Visualizations */}
                <main className="tab-panel__viz">
                  <CLVComparison clvData={clvData} values={values} />
                </main>
              </div>
            </div>
          )}

          {/* Assumption 2: Market Trajectory */}
          {activeTab === 'market' && (
            <div 
              id="panel-market" 
              role="tabpanel" 
              aria-labelledby="tab-market"
              className="tab-panel fade-in"
            >
              <div className="tab-panel__grid">
                {/* Controls */}
                <aside className="tab-panel__controls">
                  <ControlPanel 
                    values={values} 
                    updateValue={updateValue} 
                    activeTab={activeTab}
                  />
                </aside>

                {/* Visualizations */}
                <main className="tab-panel__viz">
                  <MarketProjections data={marketData} timeHorizon={values.timeHorizon} />
                  
                  <div className="donut-section">
                    <MarketDonut data={marketData} year="current" />
                    <MarketDonut data={marketData} year="projected" timeHorizon={values.timeHorizon} />
                  </div>
                </main>
              </div>
            </div>
          )}

          {/* Assumption 3: Network Effect Quality */}
          {activeTab === 'network' && (
            <div 
              id="panel-network" 
              role="tabpanel" 
              aria-labelledby="tab-network"
              className="tab-panel fade-in"
            >
              <div className="tab-panel__grid">
                {/* Controls */}
                <aside className="tab-panel__controls">
                  <ControlPanel 
                    values={values} 
                    updateValue={updateValue} 
                    activeTab={activeTab}
                  />
                </aside>

                {/* Visualizations */}
                <main className="tab-panel__viz">
                  <PopulationDots genderRatio={values.tinderGenderRatio} funnelMultiplier={values.hingeFunnelMultiplier} />
                </main>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="export-section">
            <button className="btn btn-primary" onClick={handleExport}>
              <Download size={18} />
              Export Current View as Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
