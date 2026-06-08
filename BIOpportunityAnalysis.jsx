import { useMemo } from 'react';
import { Box, SimpleGrid, VStack, HStack, Text, Badge, Table } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { TrendingUp, Clock, AlertTriangle, Target } from 'lucide-react';

const BIOpportunityAnalysis = ({ opportunities }) => {
  const analysis = useMemo(() => {
    const now = new Date();
    const activeOpps = opportunities.filter(o => ['new_group65011', 'topics'].includes(o.group?.id));
    const wonOpps = opportunities.filter(o => o.group?.id === 'new_group75648');
    const lostOpps = opportunities.filter(o => o.group?.id === 'new_group');

    const stalledDays = 30;
    const stalled = activeOpps.filter(o => {
      if (!o.lastUpdatedOn) return true;
      const lastUpdate = new Date(o.lastUpdatedOn);
      return (now - lastUpdate) / (1000 * 60 * 60 * 24) > stalledDays;
    });

    const avgDaysInPipeline = activeOpps.reduce((sum, o) => {
      const added = o.dateAdded ? new Date(o.dateAdded) : now;
      return sum + (now - added) / (1000 * 60 * 60 * 24);
    }, 0) / (activeOpps.length || 1);

    const winRate = opportunities.length > 0 ? ((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100) || 0 : 0;

    const highConv = activeOpps.filter(o => ['75%', '90%'].includes(o.conversionChance));
    const topStalled = stalled.slice(0, 5).map(o => ({
      name: o.name, company: o.company?.[0] || 'N/A',
      amount: o.dealAmount || 0, days: Math.round((now - new Date(o.dateAdded || now)) / (1000 * 60 * 60 * 24))
    }));

    return { activeCount: activeOpps.length, wonCount: wonOpps.length, lostCount: lostOpps.length,
      stalledCount: stalled.length, avgDays: Math.round(avgDaysInPipeline), winRate: winRate.toFixed(1),
      highConvCount: highConv.length, topStalled };
  }, [opportunities]);

  return (
    <VStack align="stretch" gap={5}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <KPICard value={analysis.activeCount} label="Active Opportunities" icon={<Target size={28} />} />
        <KPICard value={`${analysis.winRate}%`} label="Win Rate" icon={<TrendingUp size={28} />} />
        <KPICard value={`${analysis.avgDays}d`} label="Avg Days in Pipeline" icon={<Clock size={28} />} />
        <KPICard value={analysis.stalledCount} label="Stalled (30+ days)" icon={<AlertTriangle size={28} />} />
      </SimpleGrid>
      <HStack gap={2} flexWrap="wrap">
        <Badge colorPalette="green" px={3} py={1}>Won: {analysis.wonCount}</Badge>
        <Badge colorPalette="red" px={3} py={1}>Lost: {analysis.lostCount}</Badge>
        <Badge colorPalette="blue" px={3} py={1}>High Conversion: {analysis.highConvCount}</Badge>
      </HStack>
      {analysis.topStalled.length > 0 && (
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200">
          <Text fontWeight="700" mb={3} color="orange.700">⚠️ Stalled Opportunities (No Update 30+ Days)</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Deal</Table.ColumnHeader><Table.ColumnHeader>Company</Table.ColumnHeader><Table.ColumnHeader>Amount</Table.ColumnHeader><Table.ColumnHeader>Days</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.topStalled.map((s, i) => (
              <Table.Row key={i}><Table.Cell>{s.name}</Table.Cell><Table.Cell>{s.company}</Table.Cell><Table.Cell>${s.amount.toLocaleString()}</Table.Cell><Table.Cell><Badge colorPalette="orange">{s.days}d</Badge></Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
      )}
    </VStack>
  );
};

export default BIOpportunityAnalysis;
