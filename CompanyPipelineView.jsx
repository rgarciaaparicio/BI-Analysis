import { useMemo, useState } from 'react';
import { Box, Container, Stack, Table, Text, HStack, Badge, VStack } from '@chakra-ui/react';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';
import ChartCard from '@components/ChartCard';
import PageHeader from '@components/PageHeader';
import { Bar } from '@charts';
import FilterBar from './FilterBar';
import FilterBadges from './FilterBadges';

const CompanyPipelineView = ({ opportunities, ...filterProps }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'totalValue', direction: 'desc' });

  const companyMetrics = useMemo(() => {
    const grouped = {};
    opportunities.forEach(opp => {
      (opp.company || []).forEach(companyName => {
        if (!companyName) return;
        if (!grouped[companyName]) grouped[companyName] = { name: companyName, count: 0, totalValue: 0, conversions: {} };
        grouped[companyName].count += 1;
        grouped[companyName].totalValue += opp.dealAmount || 0;
        const conv = opp.conversionChance || '0%';
        grouped[companyName].conversions[conv] = (grouped[companyName].conversions[conv] || 0) + 1;
      });
    });
    return Object.values(grouped).map(c => ({
      ...c, avgDeal: c.count > 0 ? c.totalValue / c.count : 0,
      topConversion: Object.keys(c.conversions).sort((a, b) => parseInt(b) - parseInt(a))[0] || '0%',
    }));
  }, [opportunities]);

  const sortedCompanies = useMemo(() => {
    return [...companyMetrics].sort((a, b) => {
      const aV = a[sortConfig.key], bV = b[sortConfig.key];
      return sortConfig.direction === 'asc' ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });
  }, [companyMetrics, sortConfig]);

  const handleSort = (key) => setSortConfig(p => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));

  const topCompaniesByValue = useMemo(() =>
    [...companyMetrics].sort((a, b) => b.totalValue - a.totalValue).slice(0, 10).map(c => ({ company: c.name, value: c.totalValue })),
    [companyMetrics]
  );

  const conversionColors = { '90%': 'green', '75%': 'blue', '50%': 'orange', '25%': 'orange', '10%': 'red', '0%': 'gray' };

  if (companyMetrics.length === 0) {
    return (
      <Box bg="gray.50" minH="100vh" w="100%"><Container py={8} maxW="1400px">
        <PageHeader title="Pipeline by Company" subtitle="No opportunities found" />
        <Box bg="white" p={12} borderRadius="xl" textAlign="center"><VStack gap={3} color="gray.500"><Building2 size={48} /><Text>No company data available</Text></VStack></Box>
      </Container></Box>
    );
  }

  const SortHeader = ({ col, children, align }) => (
    <Table.ColumnHeader cursor="pointer" onClick={() => handleSort(col)} textAlign={align}>
      <HStack gap={1} justify={align === 'right' ? 'flex-end' : 'flex-start'}>
        <Text>{children}</Text>
        {sortConfig.key === col && (sortConfig.direction === 'asc' ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
      </HStack>
    </Table.ColumnHeader>
  );

  return (
    <Box bg="gray.50" minH="100vh" w="100%">
      <Container py={8} maxW="1400px">
        <Stack direction="column" gap={6}>
          <PageHeader title="Pipeline by Company" subtitle={`${companyMetrics.length} companies with active opportunities`} />
          <FilterBar opportunities={opportunities} {...filterProps} />
          <FilterBadges {...filterProps} />
          <ChartCard title="Top 10 Companies by Pipeline Value" subtitle="Total deal amount">
            <Bar data={topCompaniesByValue} xField="company" yField="value" layout="horizontal" />
          </ChartCard>
          <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
            <Table.Root size="sm">
              <Table.Header><Table.Row bg="gray.50">
                <SortHeader col="name"><Building2 size={14} /> Company</SortHeader>
                <SortHeader col="totalValue" align="right">Pipeline Value</SortHeader>
                <SortHeader col="count" align="right">Opportunities</SortHeader>
                <SortHeader col="avgDeal" align="right">Avg Deal Size</SortHeader>
                <Table.ColumnHeader>Top Conversion</Table.ColumnHeader>
              </Table.Row></Table.Header>
              <Table.Body>
                {sortedCompanies.map(company => (
                  <Table.Row key={company.name} _hover={{ bg: 'gray.50' }} transition="all 0.15s">
                    <Table.Cell fontWeight="600" color="gray.900">{company.name}</Table.Cell>
                    <Table.Cell textAlign="right" fontWeight="600" color="green.700">${company.totalValue.toLocaleString()}</Table.Cell>
                    <Table.Cell textAlign="right" color="gray.700">{company.count}</Table.Cell>
                    <Table.Cell textAlign="right" color="gray.700">${Math.round(company.avgDeal).toLocaleString()}</Table.Cell>
                    <Table.Cell><Badge colorPalette={conversionColors[company.topConversion] || 'gray'} variant="subtle">{company.topConversion}</Badge></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default CompanyPipelineView;
