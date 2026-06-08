import { useState } from 'react';
import { Box, Container, Stack, HStack, Text, Button, Tabs, Spinner, Center, Alert } from '@chakra-ui/react';
import { BarChart2, Grid3x3, Search, Building2, Sparkles, ArrowLeft } from 'lucide-react';
import { useAI } from '@api/use-ai';
import PageHeader from '@components/PageHeader';
import FilterBadges from './FilterBadges';
import BICompanyOverview from './BICompanyOverview';
import BIOfferMatrix from './BIOfferMatrix';
import BIWhitespaceAnalysis from './BIWhitespaceAnalysis';
import BICompanyDetail from './BICompanyDetail';
import BIDeepDive from './BIDeepDive';

const BusinessIntelligenceView = ({ opportunities, ...filterProps }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { callAI, loading: aiLoading, data: aiData, error: aiError, errorMessage, reset } = useAI();

  const runDeepDive = async () => {
    reset();
    const won = opportunities.filter(o => ['new_group75648', 'new_group24249'].includes(o.group?.id));
    const pipeline = opportunities.filter(o => ['new_group65011', 'topics'].includes(o.group?.id));
    const companies = [...new Set(opportunities.flatMap(o => o.company || []))];
    const offerings = [...new Set(opportunities.flatMap(o => o.dealType || []))];
    const wonValue = won.reduce((s, o) => s + (o.dealAmount || 0), 0);
    const pipelineValue = pipeline.reduce((s, o) => s + (o.dealAmount || 0), 0);

    const compSummary = companies.slice(0, 20).map(c => {
      const deals = opportunities.filter(o => o.company?.includes(c));
      const cWon = deals.filter(o => ['new_group75648', 'new_group24249'].includes(o.group?.id));
      const types = [...new Set(deals.flatMap(d => d.dealType || []))];
      return `${c}: ${cWon.length} won ($${cWon.reduce((s,o)=>s+(o.dealAmount||0),0).toLocaleString()}), offerings: [${types.join(', ')}]`;
    }).join('\n');

    const prompt = `You are an elite B2B whitespace analyst. Analyze this sales data and produce an executive-ready deep dive.

SCOPE: ${opportunities.length} total deals, ${companies.length} companies, ${offerings.length} offering types.
Won revenue: $${wonValue.toLocaleString()}, Pipeline: $${pipelineValue.toLocaleString()}.
Available offerings: ${offerings.join(', ')}.
AI Types: ${[...new Set(opportunities.flatMap(o => o.aiType || []))].join(', ')}.

TOP COMPANY DATA:
${compSummary}

TASKS:
1. Summarize overall account penetration and top offerings.
2. Identify biggest whitespace pockets by company and by offering.
3. Identify land-and-expand patterns (clients buying A+B often buy C).
4. Recommend prioritized list of accounts and offerings for expansion.
5. Identify under-penetrated offerings and segments for new bundles.
Keep language concise, executive-ready, with clear headings and bullets.`;

    await callAI(prompt, { schema: {
      type: 'object', required: ['scope', 'penetration', 'whitespace', 'patterns', 'priorities', 'themes'],
      properties: {
        scope: { type: 'string', description: 'One paragraph stating scope of analysis' },
        penetration: { type: 'string', description: 'Overall penetration summary, 3-4 sentences' },
        whitespace: { type: 'array', items: { type: 'object', properties: { company: { type: 'string' }, gaps: { type: 'string' }, potential: { type: 'string' } }, required: ['company', 'gaps', 'potential'] }, description: 'Top 5 whitespace opportunities by company', maxItems: 6 },
        patterns: { type: 'array', items: { type: 'string' }, description: 'Land-and-expand patterns observed', maxItems: 5 },
        priorities: { type: 'array', items: { type: 'object', properties: { account: { type: 'string' }, offering: { type: 'string' }, rationale: { type: 'string' } }, required: ['account', 'offering', 'rationale'] }, description: 'Prioritized expansion targets', maxItems: 6 },
        themes: { type: 'array', items: { type: 'string' }, description: 'Global strategic themes and recommendations', maxItems: 5 }
      }
    }});
  };

  if (selectedCompany) {
    return (
      <Box bg="gray.50" minH="100vh" w="100%">
        <Container py={8} maxW="1400px">
          <Stack gap={4}>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)} alignSelf="flex-start"><ArrowLeft size={16} />Back to Overview</Button>
            <BICompanyDetail opportunities={opportunities} company={selectedCompany} />
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" w="100%">
      <Container py={8} maxW="1400px">
        <Stack direction="column" gap={6}>
          <HStack justify="space-between" align="start" flexWrap="wrap">
            <PageHeader title="Business Intelligence & Whitespace" subtitle={`Analyzing ${opportunities.length} opportunities across ${[...new Set(opportunities.flatMap(o => o.company || []))].length} companies`} />
            <Button colorPalette="purple" size="sm" onClick={runDeepDive} disabled={aiLoading}><Sparkles size={16} />{aiLoading ? 'Running Deep Dive...' : 'Run BI Deep Dive'}</Button>
          </HStack>
          <FilterBadges {...filterProps} />
          {aiLoading && <Center py={4}><Spinner size="md" colorPalette="purple" /></Center>}
          {aiError && <Alert.Root status="error"><Alert.Indicator /><Alert.Title>{errorMessage}</Alert.Title></Alert.Root>}
          {aiData && <BIDeepDive data={aiData.data} />}
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Tabs.List>
              <Tabs.Trigger value="overview"><Building2 size={14} /><Text ml={1}>Company Overview</Text></Tabs.Trigger>
              <Tabs.Trigger value="matrix"><Grid3x3 size={14} /><Text ml={1}>Offer Matrix</Text></Tabs.Trigger>
              <Tabs.Trigger value="whitespace"><Search size={14} /><Text ml={1}>Whitespace</Text></Tabs.Trigger>
            </Tabs.List>
            <Box mt={4}>
              {activeTab === 'overview' && <BICompanyOverview opportunities={opportunities} onSelectCompany={setSelectedCompany} />}
              {activeTab === 'matrix' && <BIOfferMatrix opportunities={opportunities} onSelectCompany={setSelectedCompany} />}
              {activeTab === 'whitespace' && <BIWhitespaceAnalysis opportunities={opportunities} onSelectCompany={setSelectedCompany} />}
            </Box>
          </Tabs.Root>
        </Stack>
      </Container>
    </Box>
  );
};

export default BusinessIntelligenceView;
