// Class hub activity reports: what the student's analysis looked like (assumptions + results),
// as readable snapshots (formatted money/percent, tables), and links that reopen it.
import { logEvent, logWhenIdle } from './lib/hub'

const money = (n) => `$${n.toFixed(2)}`
const pct = (n) => `${n}%`
const num = (n) => String(Number(n.toFixed(2)))
const platform = (key) => (key === 'hinge' ? 'Hinge' : 'Tinder')

// A link that reopens the calculator with these assumptions (and tab), on this app's host.
export function scenarioLink(values, tab) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  for (const [k, v] of Object.entries(values)) params.set(k, String(v))
  return `${window.location.origin}/?${params}`
}

// Assumptions from a scenario link, or null when the URL has none.
export function valuesFromUrl(defaults) {
  const params = new URLSearchParams(window.location.search)
  let found = false
  const values = { ...defaults }
  for (const k of Object.keys(defaults)) {
    const v = Number(params.get(k) ?? NaN)
    if (params.has(k) && Number.isFinite(v)) {
      values[k] = v
      found = true
    }
  }
  return found ? values : null
}

export function tabFromUrl(tabIds) {
  const tab = new URLSearchParams(window.location.search).get('tab')
  return tabIds.includes(tab) ? tab : null
}

function scenarioLabel(activePreset, lastPreset, presets) {
  if (activePreset) return presets[activePreset].name
  return lastPreset ? `Custom (adjusted from ${presets[lastPreset].name})` : 'Custom'
}

function snapshot({ values, clvData, marketData, activePreset, lastPreset, presets }) {
  const first = marketData[0]
  const last = marketData[marketData.length - 1]
  const change = (a, b) => `${b >= a ? '+' : ''}${(((b / a) - 1) * 100).toFixed(0)}%`
  const segment = (name, key) => ({
    Segment: name,
    [`${first.year} revenue`]: `$${first[key].toLocaleString()}M`,
    [`${last.year} revenue`]: `$${last[key].toLocaleString()}M`,
    Change: change(first[key], last[key]),
  })

  return {
    Scenario: scenarioLabel(activePreset, lastPreset, presets),
    Recommendation: `Prioritize ${platform(clvData.winner)}`,
    'CLV advantage': `${clvData.percentDifference.toFixed(1)}% higher contribution CLV (${money(clvData.difference)} per customer)`,
    'Customer lifetime value': [
      { Measure: 'Gross CLV (RPP × tenure)', Tinder: money(clvData.tinderGrossCLV), Hinge: money(clvData.hingeGrossCLV) },
      { Measure: 'Contribution CLV (× margin)', Tinder: money(clvData.tinderContributionCLV), Hinge: money(clvData.hingeContributionCLV) },
      { Measure: 'Extended CLV (× sessions per 10 yr)', Tinder: money(clvData.tinderExtendedCLV), Hinge: money(clvData.hingeExtendedCLV) },
    ],
    'Extended CLV winner': platform(clvData.extendedWinner),
    'Hinge tenure to break even': `${clvData.breakEvenTenure.toFixed(1)} mo`,
    'Churn economics': [
      { Assumption: 'Paid tenure', Tinder: `${num(values.tinderTenure)} mo`, Hinge: `${num(values.hingeTenure)} mo` },
      { Assumption: 'Operating margin', Tinder: pct(values.tinderMargin), Hinge: pct(values.hingeMargin) },
      { Assumption: 'RPP ($/month)', Tinder: money(values.tinderRPP), Hinge: money(values.hingeRPP) },
      { Assumption: 'Sessions per 10 yr', Tinder: num(values.tinderSessions), Hinge: num(values.hingeSessions) },
    ],
    'Market trajectory': [
      { Assumption: 'Casual market CAGR', Value: pct(values.casualGrowth) },
      { Assumption: 'Relationship market CAGR', Value: pct(values.relationshipGrowth) },
      { Assumption: 'Marriage market CAGR', Value: pct(values.marriageGrowth) },
      { Assumption: 'Gen Z willingness to pay', Value: pct(values.genZWillingnessToPay) },
      { Assumption: 'Projection horizon', Value: `${values.timeHorizon} yr` },
    ],
    'Market revenue': [
      segment('Casual', 'casualRevenue'),
      segment('Relationship', 'relationshipRevenue'),
      segment('Marriage', 'marriageRevenue'),
      segment('Total', 'totalRevenue'),
    ],
    'Network effects': [
      { Assumption: 'Hinge funnel efficiency', Value: `${num(values.hingeFunnelMultiplier)}x` },
      { Assumption: 'Tinder % male users', Value: pct(values.tinderGenderRatio) },
    ],
  }
}

function headline({ clvData }) {
  return `prioritize ${platform(clvData.winner)} (contribution CLV ${money(clvData.tinderContributionCLV)} Tinder vs. ${money(clvData.hingeContributionCLV)} Hinge)`
}

// The latest assumptions and results, reported once the student stops adjusting (one entry per
// visit, showing its latest state).
export function reportAssumptionsWhenIdle(state) {
  logWhenIdle(() => {
    const snap = snapshot(state)
    return {
      type: 'run.completed',
      title: `${snap.Scenario}: ${headline(state)}`,
      snapshot: snap,
      link: scenarioLink(state.values),
    }
  })
}

// The student exported the current view as a PNG.
export function reportPngExport(state, { tab, tabLabel, fileName }) {
  logEvent({
    type: 'export.png',
    title: `Exported the ${tabLabel} view as an image: ${headline(state)}`,
    snapshot: { 'View exported': tabLabel, File: fileName, ...snapshot(state) },
    link: scenarioLink(state.values, tab),
  })
}
