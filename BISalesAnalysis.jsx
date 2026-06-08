import { useMemo } from 'react';
import { Box, SimpleGrid, VStack, HStack, Text, Badge, Table } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { DollarSign, Users, TrendingUp, BarChart2 } from 'lucide-react';

const BISalesAnalysis = ({ opportunities }) => {
  const analysis = useMemo(() => {
    const totalValue = opportunities.reduce((s, o) => s + (o.dealAmount || 0), 0);
    const wonOpps = opportunities.filter(o => o.group?.id === 'new_group75648');
    const wonValue = wonOpps.reduce((s, o) => s + (o.dealAmount || 0), 0);

    // By Sales Team
    const byTeam = {};
    opportunities.forEach(o => {
      const team = o.salesTeam?.[0] || 'Unassigned';
      if (!byTeam[team]) byTeam[team] = { count: 0, value: 0, won: 0 };
      byTeam[team].count += 1;
      byTeam[team].value += o.dealAmount || 0;
      if (o.group?.id === 'new_group75648') byTeam[team].won += 1;
    });

    // By Type
    const byType = {};
    opportunities.forEach(o => {
      const type = o.type || 'N/A';
      if (!byType[type]) byType[type] = { count: 0, value: 0 };
      byType[type].count += 1;
      byType[type].value += o.dealAmount || 0;
    });

    // Top companies by value
    const byCompany = {};
    opportunities.forEach(o => {
      o.company?.forEach(c => {
        if (!byCompany[c]) byCompany[c] = { count: 0, value: 0 };
        byCompany[c].count += 1;
        byCompany[c].value += o.dealAmount || 0;
      });
    });
    const topCompanies = Object.entries(byCompany).sort((a, b) => b[1].value - a[1].value).slice(0, 8);

    const teamData = Object.entries(byTeam).map(([name, d]) => ({ name, ...d, winRate: d.count > 0 ? ((d.won / d.count) * 100).toFixed(0) : '0' }));
    const typeData = Object.entries(byType).sort((a, b) => b[1].value - a[1].value).slice(0, 6);

    return { totalValue, wonValue, wonCount: wonOpps.length, teamData, typeData, topCompanies };
  }, [opportunities]);

  const fmt = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

  return (
    <VStack align="stretch" gap={5}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <KPICard value={fmt(analysis.totalValue)} label="Total Pipeline" icon={<DollarSign size={28} />} />
        <KPICard value={fmt(analysis.wonValue)} label="Won Revenue" icon={<TrendingUp size={28} />} />
        <KPICard value={analysis.wonCount} label="Deals Won" icon={<BarChart2 size={28} />} />
        <KPICard value={analysis.teamData.length} label="Active Teams" icon={<Users size={28} />} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="700" mb={3}>Sales Team Performance</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Team</Table.ColumnHeader><Table.ColumnHeader>Deals</Table.ColumnHeader><Table.ColumnHeader>Value</Table.ColumnHeader><Table.ColumnHeader>Win%</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.teamData.map((t, i) => (
              <Table.Row key={i}><Table.Cell fontWeight="600">{t.name}</Table.Cell><Table.Cell>{t.count}</Table.Cell><Table.Cell>{fmt(t.value)}</Table.Cell><Table.Cell><Badge colorPalette={parseInt(t.winRate) > 30 ? 'green' : 'orange'}>{t.winRate}%</Badge></Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="700" mb={3}>Top Companies by Value</Text>
          <Table.Root size="sm">
            <Table.Header><Table.Row><Table.ColumnHeader>Company</Table.ColumnHeader><Table.ColumnHeader>Deals</Table.ColumnHeader><Table.ColumnHeader>Value</Table.ColumnHeader></Table.Row></Table.Header>
            <Table.Body>{analysis.topCompanies.map(([name, d], i) => (
              <Table.Row key={i}><Table.Cell fontWeight="600">{name}</Table.Cell><Table.Cell>{d.count}</Table.Cell><Table.Cell>{fmt(d.value)}</Table.Cell></Table.Row>
            ))}</Table.Body>
          </Table.Root>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BISalesAnalysis;
