import { useMemo } from 'react';
import { Box, SimpleGrid, VStack, HStack, Text, Badge, Table, Card } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { DollarSign, Target, TrendingUp, Users } from 'lucide-react';

const ALL_OFFERINGS = ['Prompt/Response Review', 'Evaluation', 'Image', 'Biometric', 'Annotation', 'Video', 'Voice', 'Red Team', 'Document', 'Staffing', 'A11Y', 'Functional', 'Payments', 'UX', 'Data Collection', 'Labeling', 'Ground Truth'];

const BICompanyDetail = ({ opportunities, company }) => {
  const detail = useMemo(() => {
    const companyDeals = opportunities.filter(o => o.company?.includes(company));
    const won = companyDeals.filter(o => ['new_group75648', 'new_group24249'].includes(o.group?.id));
    const active = companyDeals.filter(o => ['new_group65011', 'topics'].includes(o.group?.id));
    const lost = companyDeals.filter(o => o.group?.id === 'new_group');
    const wonRevenue = won.reduce((s, o) => s + (o.dealAmount || 0), 0);
    const pipelineValue = active.reduce((s, o) => s + (o.dealAmount || 0), 0);
    const avgMargin = won.filter(o => o.pricedMargins).length > 0 ? (won.reduce((s, o) => s + (o.pricedMargins || 0), 0) / won.filter(o => o.pricedMargins).length).toFixed(1) : null;

    const wonOfferings = [...new Set(won.flatMap(o => o.dealType || []))];
    const pipelineOfferings = [...new Set(active.flatMap(o => o.dealType || []))];
    const whitespaceOfferings = ALL_OFFERINGS.filter(off => !wonOfferings.includes(off) && !pipelineOfferings.includes(off));

    // Similar companies (share 2+ offerings)
    const companyOfferingSets = {};
    opportunities.forEach(o => {
      if (['new_group75648', 'new_group24249'].includes(o.group?.id)) {
        o.company?.forEach(c => {
          if (c !== company) {
            if (!companyOfferingSets[c]) companyOfferingSets[c] = new Set();
            o.dealType?.forEach(dt => companyOfferingSets[c].add(dt));
          }
        });
      }
    });
    const similarCompanies = Object.entries(companyOfferingSets)
      .map(([name, offs]) => ({ name, shared: wonOfferings.filter(o => offs.has(o)).length, offerings: [...offs] }))
      .filter(c => c.shared >= 1).sort((a, b) => b.shared - a.shared).slice(0, 6);

    // Whitespace from similar companies
    const suggestedOfferings = {};
    similarCompanies.forEach(sc => {
      sc.offerings.forEach(off => {
        if (!wonOfferings.includes(off) && !pipelineOfferings.includes(off)) {
          suggestedOfferings[off] = (suggestedOfferings[off] || 0) + 1;
        }
      });
    });
    const suggestions = Object.entries(suggestedOfferings).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { won, active, lost, wonRevenue, pipelineValue, avgMargin, wonOfferings, pipelineOfferings, whitespaceOfferings, similarCompanies, suggestions, companyDeals };
  }, [opportunities, company]);

  const fmt = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

  return (
    <VStack align="stretch" gap={5}>
      <Text fontWeight="800" fontSize="2xl" color="gray.800">{company}</Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <KPICard value={fmt(detail.wonRevenue)} label="Won Revenue" icon={<DollarSign size={28} />} />
        <KPICard value={fmt(detail.pipelineValue)} label="Pipeline Value" icon={<TrendingUp size={28} />} />
        <KPICard value={detail.wonOfferings.length} label="Offerings Purchased" icon={<Target size={28} />} />
        <KPICard value={detail.whitespaceOfferings.length} label="Whitespace Gaps" icon={<Users size={28} />} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="green.200">
          <Text fontWeight="700" mb={3} color="green.700">✅ Offerings Purchased</Text>
          <HStack gap={2} flexWrap="wrap">{detail.wonOfferings.map(off => <Badge key={off} colorPalette="green" px={2} py={1}>{off}</Badge>)}</HStack>
          {detail.wonOfferings.length === 0 && <Text fontSize="sm" color="gray.500">No closed-won offerings yet</Text>}
          {detail.pipelineOfferings.length > 0 && (<><Text fontWeight="600" mt={3} mb={1} fontSize="sm" color="blue.600">In Pipeline:</Text><HStack gap={2} flexWrap="wrap">{detail.pipelineOfferings.map(off => <Badge key={off} colorPalette="blue" px={2} py={1}>{off}</Badge>)}</HStack></>)}
        </Box>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200">
          <Text fontWeight="700" mb={3} color="orange.700">💡 Suggested Next Offerings</Text>
          {detail.suggestions.length > 0 ? (
            <VStack align="stretch" gap={2}>{detail.suggestions.map(([off, count]) => (
              <HStack key={off} justify="space-between"><Text fontSize="sm">{off}</Text><Badge colorPalette="purple">{count} similar clients have this</Badge></HStack>
            ))}</VStack>
          ) : <Text fontSize="sm" color="gray.500">No suggestions based on similar companies</Text>}
        </Box>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="blue.200">
          <Text fontWeight="700" mb={3} color="blue.700">🏢 Similar Companies</Text>
          {detail.similarCompanies.length > 0 ? (
            <Table.Root size="sm">
              <Table.Header><Table.Row><Table.ColumnHeader>Company</Table.ColumnHeader><Table.ColumnHeader>Shared</Table.ColumnHeader><Table.ColumnHeader>Their Offerings</Table.ColumnHeader></Table.Row></Table.Header>
              <Table.Body>{detail.similarCompanies.map(sc => (
                <Table.Row key={sc.name}><Table.Cell fontWeight="600">{sc.name}</Table.Cell><Table.Cell><Badge>{sc.shared}</Badge></Table.Cell><Table.Cell><Text fontSize="xs" noOfLines={1}>{sc.offerings.join(', ')}</Text></Table.Cell></Table.Row>
              ))}</Table.Body>
            </Table.Root>
          ) : <Text fontSize="sm" color="gray.500">No similar companies identified</Text>}
        </Box>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="700" mb={3}>📋 Deal History ({detail.companyDeals.length} deals)</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Deal</Table.ColumnHeader><Table.ColumnHeader>Stage</Table.ColumnHeader><Table.ColumnHeader>Amount</Table.ColumnHeader><Table.ColumnHeader>Type</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{detail.companyDeals.slice(0, 8).map(d => (
              <Table.Row key={d.id}><Table.Cell fontSize="xs">{d.name}</Table.Cell><Table.Cell><Badge colorPalette={d.group?.id === 'new_group75648' ? 'green' : d.group?.id === 'new_group' ? 'red' : 'blue'} fontSize="xs">{d.group?.title}</Badge></Table.Cell><Table.Cell fontSize="xs">{d.dealAmount ? `$${d.dealAmount.toLocaleString()}` : '—'}</Table.Cell><Table.Cell fontSize="xs">{d.transactionType || '—'}</Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BICompanyDetail;
