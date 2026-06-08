import { useMemo } from 'react';
import { Box, Container, Stack, SimpleGrid, HStack, Text } from '@chakra-ui/react';
import { DollarSign, Target, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import KPICard from '@components/KPICard';
import ChartCard from '@components/ChartCard';
import PageHeader from '@components/PageHeader';
import { Bar } from '@charts';
import FilterBar from './FilterBar';
import FilterBadges from './FilterBadges';

const formatValue = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
};

const PipelineDashboard = ({ opportunities, metrics, onStageClick, ...filterProps }) => {
  const stageData = useMemo(() => {
    const grouped = {};
    opportunities.forEach(opp => {
      const stage = opp.group?.title || 'Unknown';
      grouped[stage] = (grouped[stage] || 0) + 1;
    });
    return Object.entries(grouped).filter(([, v]) => v > 0).map(([id, value]) => ({ id, label: id, value }));
  }, [opportunities]);

  const conversionData = useMemo(() => {
    const grouped = {};
    opportunities.forEach(opp => {
      const conv = opp.conversionChance || '0%';
      grouped[conv] = (grouped[conv] || 0) + 1;
    });
    return Object.entries(grouped).filter(([, v]) => v > 0)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([label, count]) => ({ probability: label, count }));
  }, [opportunities]);

  const dealsWithValue = opportunities.filter(o => o.dealAmount && o.dealAmount > 0).length;

  const handlePieClick = (datum) => {
    const stage = opportunities.find(o => o.group?.title === datum.id);
    if (stage && onStageClick) onStageClick(datum.id, stage.group?.id);
  };

  return (
    <Box bg="gray.50" minH="100vh" w="100%">
      <Container py={8} maxW="1400px">
        <Stack direction="column" gap={6}>
          <PageHeader title="Sales Pipeline Dashboard" subtitle={`Showing ${opportunities.length} opportunities`} />
          <FilterBar opportunities={opportunities} {...filterProps} />
          <FilterBadges {...filterProps} />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            <KPICard value={formatValue(metrics.totalPipelineValue || 0)} label="Total Pipeline Value" icon={<DollarSign size={32} />} />
            <KPICard value={metrics.totalOpportunities || 0} label="Total Opportunities" icon={<Target size={32} />} />
            <KPICard value={formatValue(metrics.averageDealSize || 0)} label="Average Deal Size" icon={<TrendingUp size={32} />} />
            <KPICard value={dealsWithValue} label="Deals with Value" icon={<BarChart2 size={32} />} />
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <ChartCard title="Opportunities by Stage" subtitle="Click a slice to filter">
              <Box h="300px">
                <ResponsivePie data={stageData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                  innerRadius={0.5} padAngle={0.7} cornerRadius={3} activeOuterRadiusOffset={8}
                  colors={{ scheme: 'set2' }} arcLinkLabelsSkipAngle={10} arcLabelsSkipAngle={10}
                  onClick={handlePieClick} />
              </Box>
            </ChartCard>
            <ChartCard title="Conversion Probability" subtitle="Distribution of conversion chances">
              <Bar data={conversionData} xField="probability" yField="count" />
            </ChartCard>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default PipelineDashboard;
