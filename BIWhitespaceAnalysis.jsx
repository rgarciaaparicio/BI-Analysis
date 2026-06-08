import { useMemo } from 'react';
import { Box, SimpleGrid, VStack, HStack, Text, Badge, Table, Card } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { Search, TrendingUp, Lightbulb, Target } from 'lucide-react';

const ALL_OFFERINGS = ['Prompt/Response Review', 'Evaluation', 'Image', 'Biometric', 'Annotation', 'Video', 'Voice', 'Red Team', 'Document', 'Staffing', 'A11Y', 'Functional', 'Payments', 'UX', 'Data Collection', 'Labeling', 'Ground Truth'];

const BIWhitespaceAnalysis = ({ opportunities, onSelectCompany }) => {
  const analysis = useMemo(() => {
    const companyOfferings = {};
    const offeringRevenue = {};
    const offeringCompanies = {};

    opportunities.forEach(o => {
      const isWon = ['new_group75648', 'new_group24249'].includes(o.group?.id);
      o.company?.forEach(c => {
        if (!companyOfferings[c]) companyOfferings[c] = { won: new Set(), all: new Set(), revenue: 0 };
        o.dealType?.forEach(dt => { companyOfferings[c].all.add(dt); if (isWon) companyOfferings[c].won.add(dt); });
        if (isWon) companyOfferings[c].revenue += o.dealAmount || 0;
      });
      if (isWon) o.dealType?.forEach(dt => {
        offeringRevenue[dt] = (offeringRevenue[dt] || 0) + (o.dealAmount || 0);
        if (!offeringCompanies[dt]) offeringCompanies[dt] = new Set();
        o.company?.forEach(c => offeringCompanies[dt].add(c));
      });
    });

    // Popular offerings (won by 2+ companies with revenue)
    const popularOfferings = ALL_OFFERINGS.filter(off => (offeringCompanies[off]?.size || 0) >= 2)
      .sort((a, b) => (offeringRevenue[b] || 0) - (offeringRevenue[a] || 0));

    // Per-company whitespace: popular offerings they don't have
    const companyWhitespace = Object.entries(companyOfferings)
      .filter(([, d]) => d.revenue > 0)
      .map(([name, d]) => {
        const gaps = popularOfferings.filter(off => !d.won.has(off));
        return { name, revenue: d.revenue, offeringCount: d.won.size, gaps, gapCount: gaps.length };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 12);

    // Under-penetrated offerings
    const underPenetrated = ALL_OFFERINGS.filter(off => (offeringCompanies[off]?.size || 0) <= 1 && (offeringRevenue[off] || 0) > 0);

    // Land-and-expand patterns
    const comboCounts = {};
    Object.values(companyOfferings).forEach(d => {
      const offs = [...d.won];
      for (let i = 0; i < offs.length; i++) {
        for (let j = i + 1; j < offs.length; j++) {
          const key = [offs[i], offs[j]].sort().join(' + ');
          comboCounts[key] = (comboCounts[key] || 0) + 1;
        }
      }
    });
    const topCombos = Object.entries(comboCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { companyWhitespace, popularOfferings, underPenetrated, topCombos, totalGaps: companyWhitespace.reduce((s, c) => s + c.gapCount, 0) };
  }, [opportunities]);

  const fmt = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

  return (
    <VStack align="stretch" gap={5}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <KPICard value={analysis.companyWhitespace.length} label="Companies with Gaps" icon={<Search size={28} />} />
        <KPICard value={analysis.totalGaps} label="Total Whitespace Gaps" icon={<Target size={28} />} />
        <KPICard value={analysis.popularOfferings.length} label="Popular Offerings" icon={<TrendingUp size={28} />} />
        <KPICard value={analysis.topCombos.length} label="Bundle Patterns" icon={<Lightbulb size={28} />} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="green.200">
          <Text fontWeight="700" mb={3} color="green.700">🎯 Top Whitespace Targets</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Company</Table.ColumnHeader><Table.ColumnHeader>Revenue</Table.ColumnHeader><Table.ColumnHeader>Has</Table.ColumnHeader><Table.ColumnHeader>Gaps</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.companyWhitespace.slice(0, 8).map(c => (
              <Table.Row key={c.name} cursor="pointer" _hover={{ bg: 'green.50' }} onClick={() => onSelectCompany(c.name)}>
                <Table.Cell fontWeight="600" color="blue.700">{c.name}</Table.Cell>
                <Table.Cell>{fmt(c.revenue)}</Table.Cell>
                <Table.Cell><Badge colorPalette="green">{c.offeringCount}</Badge></Table.Cell>
                <Table.Cell><Badge colorPalette="orange">{c.gapCount}</Badge></Table.Cell>
              </Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
        <VStack align="stretch" gap={4}>
          <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Text fontWeight="700" mb={2} color="purple.700">🔗 Common Offering Bundles</Text>
            <VStack align="stretch" gap={1}>{analysis.topCombos.map(([combo, count], i) => (
              <HStack key={i} justify="space-between"><Text fontSize="sm">{combo}</Text><Badge colorPalette="purple">{count} clients</Badge></HStack>
            ))}</VStack>
          </Box>
          <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200">
            <Text fontWeight="700" mb={2} color="orange.700">⚠️ Under-Penetrated Offerings</Text>
            <HStack gap={2} flexWrap="wrap">{analysis.underPenetrated.map((off, i) => <Badge key={i} colorPalette="orange" fontSize="xs">{off}</Badge>)}</HStack>
            {analysis.underPenetrated.length === 0 && <Text fontSize="sm" color="gray.500">All offerings have 2+ clients</Text>}
          </Box>
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};

export default BIWhitespaceAnalysis;
