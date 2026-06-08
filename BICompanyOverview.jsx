import { useMemo, useState } from 'react';
import { Box, VStack, Table, Badge, HStack, Text, Button } from '@chakra-ui/react';
import { ArrowUpDown } from 'lucide-react';

const ALL_OFFERINGS = ['Prompt/Response Review', 'Evaluation', 'Image', 'Biometric', 'Annotation', 'Video', 'Voice', 'Red Team', 'Document', 'Staffing', 'A11Y', 'Functional', 'Payments', 'UX', 'Data Collection', 'Labeling', 'Ground Truth'];

const BICompanyOverview = ({ opportunities, onSelectCompany }) => {
  const [sortKey, setSortKey] = useState('wonRevenue');
  const [sortDir, setSortDir] = useState('desc');

  const companyData = useMemo(() => {
    const map = {};
    opportunities.forEach(o => {
      o.company?.forEach(c => {
        if (!map[c]) map[c] = { name: c, wonRevenue: 0, pipelineValue: 0, wonCount: 0, activeCount: 0, offerings: new Set(), pipelineOfferings: new Set(), margin: [], deliveredMargin: [] };
        const isWon = ['new_group75648', 'new_group24249'].includes(o.group?.id);
        const isActive = ['new_group65011', 'topics'].includes(o.group?.id);
        if (isWon) { map[c].wonRevenue += o.dealAmount || 0; map[c].wonCount += 1; }
        if (isActive) { map[c].pipelineValue += o.dealAmount || 0; map[c].activeCount += 1; }
        o.dealType?.forEach(dt => { if (isWon) map[c].offerings.add(dt); else if (isActive) map[c].pipelineOfferings.add(dt); });
        if (o.pricedMargins) map[c].margin.push(o.pricedMargins);
        if (o.deliveredMargins) map[c].deliveredMargin.push(o.deliveredMargins);
      });
    });
    return Object.values(map).map(c => ({
      ...c, offeringCount: c.offerings.size, pipelineOfferingCount: c.pipelineOfferings.size,
      whitespaceCount: ALL_OFFERINGS.length - c.offerings.size - [...c.pipelineOfferings].filter(p => !c.offerings.has(p)).length,
      avgMargin: c.margin.length > 0 ? (c.margin.reduce((a, b) => a + b, 0) / c.margin.length).toFixed(1) : null
    }));
  }, [opportunities]);

  const sorted = useMemo(() => {
    return [...companyData].sort((a, b) => {
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [companyData, sortKey, sortDir]);

  const toggleSort = (key) => { if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortKey(key); setSortDir('desc'); } };
  const fmt = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toLocaleString()}`;

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between">
        <Text fontWeight="700" fontSize="lg">Company Overview ({companyData.length} companies)</Text>
        <Text fontSize="xs" color="gray.500">Click a company for detailed view</Text>
      </HStack>
      <Box overflowX="auto" bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Company</Table.ColumnHeader>
              <Table.ColumnHeader cursor="pointer" onClick={() => toggleSort('wonRevenue')}><HStack gap={1}><Text>Won Revenue</Text><ArrowUpDown size={12} /></HStack></Table.ColumnHeader>
              <Table.ColumnHeader cursor="pointer" onClick={() => toggleSort('pipelineValue')}><HStack gap={1}><Text>Pipeline</Text><ArrowUpDown size={12} /></HStack></Table.ColumnHeader>
              <Table.ColumnHeader cursor="pointer" onClick={() => toggleSort('offeringCount')}><HStack gap={1}><Text>Offerings</Text><ArrowUpDown size={12} /></HStack></Table.ColumnHeader>
              <Table.ColumnHeader cursor="pointer" onClick={() => toggleSort('whitespaceCount')}><HStack gap={1}><Text>Whitespace</Text><ArrowUpDown size={12} /></HStack></Table.ColumnHeader>
              <Table.ColumnHeader>Avg Margin</Table.ColumnHeader>
              <Table.ColumnHeader>Deals</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.slice(0, 30).map(c => (
              <Table.Row key={c.name} cursor="pointer" _hover={{ bg: 'blue.50' }} onClick={() => onSelectCompany(c.name)}>
                <Table.Cell fontWeight="600" color="blue.700">{c.name}</Table.Cell>
                <Table.Cell>{c.wonRevenue > 0 ? fmt(c.wonRevenue) : '—'}</Table.Cell>
                <Table.Cell>{c.pipelineValue > 0 ? fmt(c.pipelineValue) : '—'}</Table.Cell>
                <Table.Cell><Badge colorPalette="green">{c.offeringCount}</Badge>{c.pipelineOfferingCount > 0 && <Badge colorPalette="blue" ml={1}>+{c.pipelineOfferingCount}</Badge>}</Table.Cell>
                <Table.Cell><Badge colorPalette={c.whitespaceCount > 10 ? 'red' : c.whitespaceCount > 5 ? 'orange' : 'gray'}>{c.whitespaceCount} gaps</Badge></Table.Cell>
                <Table.Cell>{c.avgMargin ? `${c.avgMargin}%` : '—'}</Table.Cell>
                <Table.Cell>{c.wonCount + c.activeCount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  );
};

export default BICompanyOverview;
