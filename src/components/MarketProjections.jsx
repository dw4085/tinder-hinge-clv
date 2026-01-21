import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

function MarketProjections({ data, timeHorizon }) {
  // Format data for the chart
  const chartData = data.map(d => ({
    year: d.year,
    'Casual': d.casualRevenue,
    'Relationship': d.relationshipRevenue,
    'Marriage': d.marriageRevenue,
    'Total': d.totalRevenue
  }))

  const payerData = data.map(d => ({
    year: d.year,
    'Casual': d.casualPayers / 1000000,
    'Relationship': d.relationshipPayers / 1000000,
    'Marriage': d.marriagePayers / 1000000
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--hinge-warm-white)',
          border: '1px solid var(--warm-gray-200)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--warm-gray-700)' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: '0.85rem', margin: '0.25rem 0' }}>
              {entry.name}: {entry.name === 'Total' ? `$${entry.value}M` : 
                (entry.value > 100 ? `$${entry.value}M` : `${entry.value.toFixed(2)}M payers`)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="market-chart">
      <h3 className="market-chart__title">Market Revenue Projections by Segment</h3>
      
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="casualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B5B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF6B5B" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="relationshipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7D2E4D" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7D2E4D" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="marriageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B9B7A" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6B9B7A" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
            <XAxis 
              dataKey="year" 
              stroke="var(--warm-gray-400)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--warm-gray-400)"
              fontSize={12}
              tickFormatter={(value) => `$${value}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '0.85rem' }}
            />
            <Area 
              type="monotone" 
              dataKey="Casual" 
              stackId="1"
              stroke="#FF6B5B" 
              fill="url(#casualGrad)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="Relationship" 
              stackId="1"
              stroke="#7D2E4D" 
              fill="url(#relationshipGrad)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="Marriage" 
              stackId="1"
              stroke="#6B9B7A" 
              fill="url(#marriageGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--warm-gray-600)' }}>Payer Growth by Segment (Millions)</h4>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={payerData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
          <XAxis 
            dataKey="year" 
            stroke="var(--warm-gray-400)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--warm-gray-400)"
            fontSize={12}
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '0.85rem' }}
          />
          <Line 
            type="monotone" 
            dataKey="Casual" 
            stroke="#FF6B5B" 
            strokeWidth={3}
            dot={{ fill: '#FF6B5B', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Relationship" 
            stroke="#7D2E4D" 
            strokeWidth={3}
            dot={{ fill: '#7D2E4D', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Marriage" 
            stroke="#6B9B7A" 
            strokeWidth={3}
            dot={{ fill: '#6B9B7A', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 'var(--space-md)',
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-lg)',
        background: 'var(--warm-gray-100)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Casual Market {timeHorizon}yr Change
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: data[data.length - 1].casualRevenue < data[0].casualRevenue ? '#E74C3C' : '#27AE60',
            fontFamily: 'var(--font-mono)'
          }}>
            {(((data[data.length - 1].casualRevenue / data[0].casualRevenue) - 1) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Relationship Market {timeHorizon}yr Change
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: data[data.length - 1].relationshipRevenue > data[0].relationshipRevenue ? '#27AE60' : '#E74C3C',
            fontFamily: 'var(--font-mono)'
          }}>
            +{(((data[data.length - 1].relationshipRevenue / data[0].relationshipRevenue) - 1) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Total Market {timeHorizon}yr
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: 'var(--hinge-burgundy)',
            fontFamily: 'var(--font-mono)'
          }}>
            ${data[data.length - 1].totalRevenue}M
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketProjections
