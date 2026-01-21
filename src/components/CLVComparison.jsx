function CLVComparison({ clvData, values }) {
  return (
    <div className="clv-section">
      {/* Tinder CLV Card */}
      <div className="clv-card clv-card--tinder">
        <div className="clv-card__platform">🔥 Tinder</div>
        <div className="clv-card__value">${clvData.tinderContributionCLV.toFixed(2)}</div>
        <div className="clv-card__label">Contribution CLV per Customer</div>
        
        <div className="clv-card__breakdown">
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">Monthly RPP</span>
            <span className="clv-card__breakdown-value">${values.tinderRPP.toFixed(2)}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">× Tenure (months)</span>
            <span className="clv-card__breakdown-value">{values.tinderTenure}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">= Gross CLV</span>
            <span className="clv-card__breakdown-value">${clvData.tinderGrossCLV.toFixed(2)}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">× Operating Margin</span>
            <span className="clv-card__breakdown-value">{values.tinderMargin}%</span>
          </div>
          <div className="clv-card__breakdown-row" style={{ fontWeight: 600 }}>
            <span className="clv-card__breakdown-label">= Contribution CLV</span>
            <span className="clv-card__breakdown-value">${clvData.tinderContributionCLV.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Hinge CLV Card */}
      <div className="clv-card clv-card--hinge">
        <div className="clv-card__platform">💜 Hinge</div>
        <div className="clv-card__value">${clvData.hingeContributionCLV.toFixed(2)}</div>
        <div className="clv-card__label">Contribution CLV per Customer</div>
        
        <div className="clv-card__breakdown">
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">Monthly RPP</span>
            <span className="clv-card__breakdown-value">${values.hingeRPP.toFixed(2)}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">× Tenure (months)</span>
            <span className="clv-card__breakdown-value">{values.hingeTenure}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">= Gross CLV</span>
            <span className="clv-card__breakdown-value">${clvData.hingeGrossCLV.toFixed(2)}</span>
          </div>
          <div className="clv-card__breakdown-row">
            <span className="clv-card__breakdown-label">× Operating Margin</span>
            <span className="clv-card__breakdown-value">{values.hingeMargin}%</span>
          </div>
          <div className="clv-card__breakdown-row" style={{ fontWeight: 600 }}>
            <span className="clv-card__breakdown-label">= Contribution CLV</span>
            <span className="clv-card__breakdown-value">${clvData.hingeContributionCLV.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Extended CLV with Resurrection */}
      <div className="clv-card clv-card--tinder" style={{ opacity: 0.85 }}>
        <div className="clv-card__platform">🔥 Tinder — 10yr Extended</div>
        <div className="clv-card__value">${clvData.tinderExtendedCLV.toFixed(2)}</div>
        <div className="clv-card__label">With Resurrection Factor ({values.tinderSessions} sessions)</div>
      </div>

      <div className="clv-card clv-card--hinge" style={{ opacity: 0.85 }}>
        <div className="clv-card__platform">💜 Hinge — 10yr Extended</div>
        <div className="clv-card__value">${clvData.hingeExtendedCLV.toFixed(2)}</div>
        <div className="clv-card__label">With Resurrection Factor ({values.hingeSessions} sessions)</div>
      </div>

      {/* Breakeven Analysis */}
      <div className="clv-card" style={{ gridColumn: '1 / -1', background: 'var(--warm-gray-100)' }}>
        <div className="clv-card__platform" style={{ color: 'var(--warm-gray-600)' }}>📊 Breakeven Analysis</div>
        <div className="clv-card__value" style={{ color: 'var(--warm-gray-700)', fontSize: '2rem' }}>
          {clvData.breakEvenTenure.toFixed(1)} months
        </div>
        <div className="clv-card__label">
          Hinge tenure needed to match Tinder's CLV (at current Tinder tenure of {values.tinderTenure} mo)
        </div>
        <p style={{ 
          marginTop: 'var(--space-md)', 
          fontSize: '0.9rem', 
          color: 'var(--warm-gray-500)',
          textAlign: 'center'
        }}>
          {values.hingeTenure >= clvData.breakEvenTenure 
            ? `✓ Current Hinge tenure (${values.hingeTenure} mo) exceeds breakeven — Hinge wins on unit economics`
            : `✗ Current Hinge tenure (${values.hingeTenure} mo) is below breakeven — Tinder has CLV advantage`
          }
        </p>
      </div>
    </div>
  )
}

export default CLVComparison
