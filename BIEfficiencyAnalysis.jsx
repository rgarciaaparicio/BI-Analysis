import { useMemo } from 'react';
import { Box, SimpleGrid, VStack, Text, Badge, Table, HStack } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { Zap, Target, Clock, TrendingUp } from 'lucide-react';

const BIEfficiencyAnalysis = ({ opportunities }) => {
  const analysis = useMemo(() => {
    const won = opportunities.filter(o => o.group?.id === 'new_group75648');
    const lost = opportunities.filter(o => o.group?.id === 'new_group');
    const totalDecided = won.length + lost.length;
    const overallWinRate = totalDecided > 0 ? ((won.length / totalDecided) * 100).toFixed(1) : '0';

    // Win rate by complexity
    const byComplexity = {};
    opportunities.forEach(o => {
      const c = o.complexity || 'Unknown';
      if (!byComplexity[c]) byComplexity[c] = { total: 0, won: 0, value: 0 };
      byComplexity[c].total += 1;
      byComplexity[c].value += o.dealAmount || 0;
      if (o.group?.id === 'new_group75648') byComplexity[c].won += 1;
    });

    // Win rate by transaction type
    const byTransaction = {};
    opportunities.forEach(o => {
      const t = o.transactionType || 'Unknown';
      if (!byTransaction[t]) byTransaction[t] = { total: 0, won: 0, value: 0 };
      byTransaction[t].total += 1;
      byTransaction[t].value += o.dealAmount || 0;
      if (o.group?.id === 'new_group75648') byTransaction[t].won += 1;
    });

    // Average deal value by conversion probability
    const byConversion = {};
    opportunities.forEach(o => {
      const conv = o.conversionChance || '0%';
      if (!byConversion[conv]) byConversion[conv] = { count: 0, totalValue: 0 };
      byConversion[conv].count += 1;
      byConversion[conv].totalValue += o.dealAmount || 0;
    });

    const avgWonDealSize = won.length > 0 ? won.reduce((s, o) => s + (o.dealAmount || 0), 0) / won.length : 0;
    const complexityData = Object.entries(byComplexity).map(([name, d]) => ({ name, ...d, winRate: d.total > 0 ? ((d.won / d.total) * 100).toFixed(0) : '0' }));
    const transactionData = Object.entries(byTransaction).map(([name, d]) => ({ name, ...d, winRate: d.total > 0 ? ((d.won / d.total) * 100).toFixed(0) : '0' }));
    const conversionData = Object.entries(byConversion).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([prob, d]) => ({ prob, avg: d.count > 0 ? d.totalValue / d.count : 0, count: d.count }));

    return { overallWinRate, avgWonDealSize, complexityData, transactionData, conversionData, wonCount: won.length, totalDecided };
  }, [opportunities]);

  const fmt = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;

  return (
    <VStack align="stretch" gap={5}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <KPICard value={`${analysis.overallWinRate}%`} label="Overall Win Rate" icon={<Target size={28} />} />
        <KPICard value={fmt(analysis.avgWonDealSize)} label="Avg Won Deal Size" icon={<TrendingUp size={28} />} />
        <KPICard value={analysis.wonCount} label="Closed Won" icon={<Zap size={28} />} />
        <KPICard value={analysis.totalDecided} label="Total Decided" icon={<Clock size={28} />} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="700" mb={3}>Win Rate by Complexity</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Complexity</Table.ColumnHeader><Table.ColumnHeader>Deals</Table.ColumnHeader><Table.ColumnHeader>Win Rate</Table.ColumnHeader><Table.ColumnHeader>Value</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.complexityData.map((d, i) => (
              <Table.Row key={i}><Table.Cell fontWeight="600">{d.name}</Table.Cell><Table.Cell>{d.total}</Table.Cell><Table.Cell><Badge colorPalette={parseInt(d.winRate) > 40 ? 'green' : parseInt(d.winRate) > 20 ? 'orange' : 'red'}>{d.winRate}%</Badge></Table.Cell><Table.Cell>{fmt(d.value)}</Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="700" mb={3}>Win Rate by Transaction Type</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Type</Table.ColumnHeader><Table.ColumnHeader>Deals</Table.ColumnHeader><Table.ColumnHeader>Win Rate</Table.ColumnHeader><Table.ColumnHeader>Value</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.transactionData.map((d, i) => (
              <Table.Row key={i}><Table.Cell fontWeight="600">{d.name}</Table.Cell><Table.Cell>{d.total}</Table.Cell><Table.Cell><Badge colorPalette={parseInt(d.winRate) > 40 ? 'green' : parseInt(d.winRate) > 20 ? 'orange' : 'red'}>{d.winRate}%</Badge></Table.Cell><Table.Cell>{fmt(d.value)}</Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BIEfficiencyAnalysis;
