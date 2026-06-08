import { useMemo } from 'react';
import { HStack, Text, Button, Select, Portal, createListCollection } from '@chakra-ui/react';
import { Filter, X, ChevronDown } from 'lucide-react';

const getDateRangePresets = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastWeekStart = new Date(today); lastWeekStart.setDate(today.getDate() - 7);
  const thisWeekStart = new Date(today); thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisWeekEnd = new Date(thisWeekStart); thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const quarter = Math.floor(now.getMonth() / 3);
  const thisQuarterStart = new Date(now.getFullYear(), quarter * 3, 1);
  const thisQuarterEnd = new Date(now.getFullYear(), quarter * 3 + 3, 0);
  return [
    { label: 'Last Week', value: 'last_week', from: lastWeekStart, to: today },
    { label: 'This Week', value: 'this_week', from: thisWeekStart, to: thisWeekEnd },
    { label: 'Last Month', value: 'last_month', from: lastMonthStart, to: lastMonthEnd },
    { label: 'This Month', value: 'this_month', from: thisMonthStart, to: thisMonthEnd },
    { label: 'This Quarter', value: 'this_quarter', from: thisQuarterStart, to: thisQuarterEnd },
  ];
};

const MultiSelect = ({ label, collection, value, onValueChange }) => (
  <HStack gap={2}>
    <Text fontSize="sm" fontWeight="600" color="gray.700" whiteSpace="nowrap">{label}:</Text>
    <Select.Root collection={collection} size="sm" multiple value={value} onValueChange={onValueChange}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger bg="white" border="1px solid" borderColor="gray.300" rounded="lg" h="9" minW="160px" _hover={{ borderColor: 'gray.400' }}>
          <Select.ValueText placeholder={`All ${label.toLowerCase()}`} />
          <Select.IndicatorGroup><ChevronDown size={14} /></Select.IndicatorGroup>
        </Select.Trigger>
      </Select.Control>
      <Portal><Select.Positioner><Select.Content bg="white" border="1px solid" borderColor="gray.200" rounded="lg" boxShadow="lg" maxH="300px" overflowY="auto">
        {collection.items.map((item) => (
          <Select.Item item={item} key={item.value} _highlighted={{ bg: 'blue.50' }}>{item.label}<Select.ItemIndicator /></Select.Item>
        ))}
      </Select.Content></Select.Positioner></Portal>
    </Select.Root>
  </HStack>
);

const FilterBar = ({ opportunities, allOpportunities, selectedStages, selectedAiTypes, selectedCompanies, selectedDateRanges, onClearFilter, onStageToggle, onAiTypeToggle, onCompanyToggle, onDateRangeToggle, onRemoveDateRange }) => {
  const sourceData = allOpportunities || opportunities;

  const availableStages = useMemo(() => {
    const m = new Map();
    sourceData.forEach(o => { if (o.group?.id && o.group?.title) m.set(o.group.id, { label: o.group.title, value: o.group.id }); });
    return Array.from(m.values());
  }, [sourceData]);

  const availableAiTypes = useMemo(() => {
    const s = new Set();
    sourceData.forEach(o => { if (Array.isArray(o.aiType)) o.aiType.forEach(t => s.add(t)); });
    return Array.from(s).sort().map(t => ({ label: t, value: t }));
  }, [sourceData]);

  const availableCompanies = useMemo(() => {
    const s = new Set();
    sourceData.forEach(o => { if (Array.isArray(o.company)) o.company.forEach(c => s.add(c)); });
    return Array.from(s).sort().map(c => ({ label: c, value: c }));
  }, [sourceData]);

  const datePresets = useMemo(() => getDateRangePresets(), []);
  const stageCol = createListCollection({ items: availableStages });
  const aiTypeCol = createListCollection({ items: availableAiTypes });
  const companyCol = createListCollection({ items: availableCompanies });
  const dateCol = createListCollection({ items: datePresets });

  const hasFilters = selectedStages.length > 0 || selectedAiTypes.length > 0 || selectedCompanies.length > 0 || selectedDateRanges.length > 0;

  return (
    <HStack p={3} bg="white" borderRadius="lg" border="1px solid" borderColor={hasFilters ? "blue.200" : "gray.200"} justify="space-between" align="center" flexWrap="wrap" gap={3}>
      <HStack gap={3} flexWrap="wrap" flex="1">
        <Filter size={16} color={hasFilters ? "var(--chakra-colors-blue-500)" : "var(--chakra-colors-gray-500)"} />
        <MultiSelect label="Stage" collection={stageCol} value={selectedStages.map(s => s.id)} onValueChange={(e) => {
          const cur = selectedStages.map(s => s.id);
          const added = e.value.find(id => !cur.includes(id));
          const removed = cur.find(id => !e.value.includes(id));
          if (added) { const st = availableStages.find(s => s.value === added); if (st) onStageToggle(st.label, added); }
          else if (removed) { const st = selectedStages.find(s => s.id === removed); if (st) onStageToggle(st.title, removed); }
        }} />
        <MultiSelect label="AI Type" collection={aiTypeCol} value={selectedAiTypes} onValueChange={(e) => {
          const added = e.value.find(t => !selectedAiTypes.includes(t));
          const removed = selectedAiTypes.find(t => !e.value.includes(t));
          if (added) onAiTypeToggle(added); else if (removed) onAiTypeToggle(removed);
        }} />
        <MultiSelect label="Date Added" collection={dateCol} value={selectedDateRanges.map(r => r.preset)} onValueChange={(e) => {
          const curPresets = selectedDateRanges.map(r => r.preset);
          const added = e.value.find(p => !curPresets.includes(p));
          const removed = curPresets.find(p => !e.value.includes(p));
          if (added) { const pr = datePresets.find(p => p.value === added); if (pr) onDateRangeToggle({ preset: pr.value, label: pr.label, from: pr.from, to: pr.to }); }
          else if (removed) onRemoveDateRange(removed);
        }} />
        <MultiSelect label="Company" collection={companyCol} value={selectedCompanies} onValueChange={(e) => {
          const added = e.value.find(c => !selectedCompanies.includes(c));
          const removed = selectedCompanies.find(c => !e.value.includes(c));
          if (added) onCompanyToggle(added); else if (removed) onCompanyToggle(removed);
        }} />
      </HStack>
      {hasFilters && <Button variant="ghost" size="sm" onClick={onClearFilter} colorPalette="gray"><X size={16} />Clear All</Button>}
    </HStack>
  );
};

export default FilterBar;
export { getDateRangePresets };
