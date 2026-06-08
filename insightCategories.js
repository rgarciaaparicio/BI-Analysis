import { TrendingUp, AlertTriangle, Target, Lightbulb, Users } from 'lucide-react';

export const INSIGHT_CATEGORIES = [
  {
    id: 'health', title: 'Pipeline Health', description: 'Overall pipeline assessment and trends',
    icon: TrendingUp, color: 'green',
    prompt: (opps) => `Analyze this sales pipeline data and provide a comprehensive health assessment:\n\nTotal Opportunities: ${opps.length}\nTotal Pipeline Value: $${opps.reduce((s, o) => s + (o.dealAmount || 0), 0).toLocaleString()}\nBy Stage: ${JSON.stringify(opps.reduce((a, o) => { a[o.group?.title || 'Unknown'] = (a[o.group?.title || 'Unknown'] || 0) + 1; return a; }, {}))}\n\nProvide: 1) Overall health score (1-10), 2) Key strengths, 3) Areas of concern, 4) Trend analysis`,
    schema: { type: 'object', properties: { healthScore: { type: 'number' }, summary: { type: 'string' }, strengths: { type: 'array', items: { type: 'string' } }, concerns: { type: 'array', items: { type: 'string' } }, recommendations: { type: 'array', items: { type: 'string' } } }, required: ['healthScore', 'summary', 'strengths', 'concerns', 'recommendations'], additionalProperties: false }
  },
  {
    id: 'risks', title: 'Risk Alerts', description: 'Identify at-risk deals and warning signs',
    icon: AlertTriangle, color: 'red',
    prompt: (opps) => { const atRisk = opps.filter(o => (o.conversionChance && parseInt(o.conversionChance) <= 25) || o.complexity === 'High' || o.type === 'At Risk PO'); return `Analyze these ${atRisk.length} at-risk opportunities:\n\n${atRisk.slice(0, 10).map(o => `- ${o.name}: ${o.company?.join(', ')} | ${o.conversionChance} | $${(o.dealAmount || 0).toLocaleString()}`).join('\n')}\n\nIdentify: 1) Common risk patterns, 2) High-value at-risk deals, 3) Mitigation strategies`; },
    schema: { type: 'object', properties: { riskCount: { type: 'number' }, totalAtRiskValue: { type: 'number' }, patterns: { type: 'array', items: { type: 'string' } }, highPriorityDeals: { type: 'array', items: { type: 'string' } }, mitigationSteps: { type: 'array', items: { type: 'string' } } }, required: ['riskCount', 'totalAtRiskValue', 'patterns', 'highPriorityDeals', 'mitigationSteps'], additionalProperties: false }
  },
  {
    id: 'opportunities', title: 'Top Opportunities', description: 'High-potential deals to prioritize',
    icon: Target, color: 'blue',
    prompt: (opps) => { const hv = opps.filter(o => o.dealAmount > 0).sort((a, b) => b.dealAmount - a.dealAmount).slice(0, 10); return `Analyze top opportunities:\n\n${hv.map(o => `- ${o.name}: ${o.company?.join(', ')} | ${o.conversionChance} | $${(o.dealAmount || 0).toLocaleString()} | ${o.group?.title}`).join('\n')}\n\nProvide: 1) Top 3 deals, 2) Why they matter, 3) Next steps`; },
    schema: { type: 'object', properties: { topDeals: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, reason: { type: 'string' }, nextSteps: { type: 'string' } }, required: ['name', 'reason', 'nextSteps'], additionalProperties: false } }, totalPotentialValue: { type: 'number' }, keyInsights: { type: 'array', items: { type: 'string' } } }, required: ['topDeals', 'totalPotentialValue', 'keyInsights'], additionalProperties: false }
  },
  {
    id: 'conversion', title: 'Conversion Tips', description: 'Strategies to improve win rates',
    icon: Lightbulb, color: 'orange',
    prompt: (opps) => { const byConv = opps.reduce((a, o) => { const c = o.conversionChance || '0%'; a[c] = (a[c] || 0) + 1; return a; }, {}); return `Analyze conversion patterns:\n\nBy Conversion: ${JSON.stringify(byConv)}\nTotal: ${opps.length}\n\nProvide: 1) Bottlenecks, 2) Best practices, 3) Actions to improve win rates`; },
    schema: { type: 'object', properties: { currentWinRate: { type: 'string' }, bottlenecks: { type: 'array', items: { type: 'string' } }, bestPractices: { type: 'array', items: { type: 'string' } }, actionableSteps: { type: 'array', items: { type: 'string' } } }, required: ['currentWinRate', 'bottlenecks', 'bestPractices', 'actionableSteps'], additionalProperties: false }
  },
  {
    id: 'accounts', title: 'Account Priority', description: 'Which customers need attention',
    icon: Users, color: 'purple',
    prompt: (opps) => { const byCo = opps.reduce((a, o) => { (o.company || []).forEach(c => { if (!a[c]) a[c] = { count: 0, value: 0 }; a[c].count += 1; a[c].value += o.dealAmount || 0; }); return a; }, {}); const top = Object.entries(byCo).sort((a, b) => b[1].value - a[1].value).slice(0, 10); return `Analyze accounts:\n\n${top.map(([c, d]) => `- ${c}: ${d.count} opps | $${d.value.toLocaleString()}`).join('\n')}\n\nProvide: 1) Top 3 accounts, 2) Strategy for each, 3) Cross-sell opportunities`; },
    schema: { type: 'object', properties: { priorityAccounts: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, reason: { type: 'string' }, strategy: { type: 'string' } }, required: ['name', 'reason', 'strategy'], additionalProperties: false } }, crossSellOpportunities: { type: 'array', items: { type: 'string' } }, engagementTips: { type: 'array', items: { type: 'string' } } }, required: ['priorityAccounts', 'crossSellOpportunities', 'engagementTips'], additionalProperties: false }
  }
];
