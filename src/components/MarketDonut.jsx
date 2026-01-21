import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function MarketDonut({ data, year, timeHorizon = 5 }) {
  const isCurrent = year === 'current'
  const yearData = isCurrent ? data[0] : data[data.length - 1]
  const displayYear = isCurrent ? 2025 : 2025 + timeHorizon

  const chartData = [
    { name: 'Casual', value: yearData.casualRevenue, color: '#FF6B5B' },
    { name: 'Relationship', value: yearData.relationshipRevenue, color: '#7D2E4D' },
    { name: 'Marriage', value: yearData.marriageRevenue, color: '#6B9B7A' }
  ]

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          background: 'var(--hinge-warm-white)',
          border: '1px solid var(--warm-gray-200)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ fontWeight: 600, color: data.color, marginBottom: '0.25rem' }}>{data.name}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)' }}>
            ${data.value}M ({((data.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="market-chart">
      <h3 className="market-chart__title">
        {isCurrent ? 'Current' : 'Projected'} Market Mix ({displayYear})
      </h3>
      
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warm-gray-700)', fontFamily: 'var(--font-display)' }}>
            ${total}M
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)' }}>
            Total TAM
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 'var(--space-lg)', 
        marginTop: 'var(--space-md)',
        flexWrap: 'wrap'
      }}>
        {chartData.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              background: item.color 
            }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--warm-gray-600)' }}>
              {item.name} ({((item.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>

      {/* Insight */}
      <p style={{ 
        marginTop: 'var(--space-lg)', 
        padding: 'var(--space-md)',
        background: 'var(--warm-gray-100)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: 'var(--warm-gray-600)',
        textAlign: 'center'
      }}>
        {isCurrent 
          ? 'The relationship-seeking segment represents the largest revenue opportunity today.'
          : `By ${displayYear}, relationship-seeking grows to ${((chartData[1].value / total) * 100).toFixed(0)}% of the market.`
        }
      </p>
    </div>
  )
}

export default MarketDonut
