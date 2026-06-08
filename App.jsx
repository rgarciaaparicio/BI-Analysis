import { useState, useMemo } from 'react';
import { Box, Container, HStack, Button, Alert, Spinner, Center, VStack, Text } from '@chakra-ui/react';
import { LayoutDashboard, Kanban, Building2, Sparkles, Plus, BarChart2 } from 'lucide-react';
import AddOpportunityDialog from './components/AddOpportunityDialog';
import PipelineDashboard from './components/PipelineDashboard';
import SalesPipelineBoard from './components/SalesPipelineBoard';
import CompanyPipelineView from './components/CompanyPipelineView';
import AIInsightsView from './components/AIInsightsView';
import BusinessIntelligenceView from './components/BusinessIntelligenceView';
import { useSalesData, calculateMetrics } from './hooks/useSalesData';

const App = () => {
  const [activeView, setActiveView] = useState('pipeline');
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedAiTypes, setSelectedAiTypes] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDateRanges, setSelectedDateRanges] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { opportunities, metrics, loading, error, refetch } = useSalesData();

  const handleStageToggle = (stageTitle, stageId) => {
    setSelectedStages(prev => {
      const exists = prev.find(s => s.id === stageId);
      return exists ? prev.filter(s => s.id !== stageId) : [...prev, { title: stageTitle, id: stageId }];
    });
  };

  const handleAiTypeToggle = (aiType) => {
    setSelectedAiTypes(prev => prev.includes(aiType) ? prev.filter(t => t !== aiType) : [...prev, aiType]);
  };

  const handleCompanyToggle = (company) => {
    setSelectedCompanies(prev => prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]);
  };

  const handleDateRangeToggle = (range) => {
    if (!range) return;
    setSelectedDateRanges(prev => {
      const exists = prev.find(r => r.preset === range.preset);
      return exists ? prev.filter(r => r.preset !== range.preset) : [...prev, range];
    });
  };

  const removeStage = (stageId) => setSelectedStages(prev => prev.filter(s => s.id !== stageId));
  const removeAiType = (aiType) => setSelectedAiTypes(prev => prev.filter(t => t !== aiType));
  const removeCompany = (company) => setSelectedCompanies(prev => prev.filter(c => c !== company));
  const removeDateRange = (preset) => setSelectedDateRanges(prev => prev.filter(r => r.preset !== preset));

  const clearAllFilters = () => {
    setSelectedStages([]);
    setSelectedAiTypes([]);
    setSelectedCompanies([]);
    setSelectedDateRanges([]);
  };

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;
    if (selectedStages.length > 0) {
      const stageIds = selectedStages.map(s => s.id);
      filtered = filtered.filter(opp => stageIds.includes(opp.group?.id));
    }
    if (selectedAiTypes.length > 0) {
      filtered = filtered.filter(opp => opp.aiType && opp.aiType.some(type => selectedAiTypes.includes(type)));
    }
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(opp => opp.company && opp.company.some(comp => selectedCompanies.includes(comp)));
    }
    if (selectedDateRanges.length > 0) {
      filtered = filtered.filter(opp => {
        if (!opp.dateAdded) return false;
        const oppDate = new Date(opp.dateAdded);
        return selectedDateRanges.some(range => oppDate >= range.from && oppDate <= range.to);
      });
    }
    return filtered;
  }, [opportunities, selectedStages, selectedAiTypes, selectedCompanies, selectedDateRanges]);

  const filteredMetrics = useMemo(() => calculateMetrics(filteredOpportunities), [filteredOpportunities]);

  if (loading) {
    return (<Center minH="100vh" bg="gray.50"><VStack gap={4}><Spinner size="xl" color="blue.500" /><Text color="gray.600">Loading sales pipeline...</Text></VStack></Center>);
  }

  if (error) {
    return (<Container py={8} maxW="800px"><Alert.Root status="error"><Alert.Indicator /><Alert.Title>Error Loading Data</Alert.Title><Alert.Description>{error}</Alert.Description></Alert.Root><Button onClick={refetch} mt={4} colorPalette="blue">Retry</Button></Container>);
  }

  const hasFilters = selectedStages.length > 0 || selectedAiTypes.length > 0 || selectedCompanies.length > 0 || selectedDateRanges.length > 0;
  const filterProps = {
    allOpportunities: opportunities,
    selectedStages, selectedAiTypes, selectedCompanies, selectedDateRanges,
    onClearFilter: clearAllFilters, onStageToggle: handleStageToggle, onAiTypeToggle: handleAiTypeToggle,
    onCompanyToggle: handleCompanyToggle, onDateRangeToggle: handleDateRangeToggle,
    onRemoveStage: removeStage, onRemoveAiType: removeAiType, onRemoveCompany: removeCompany, onRemoveDateRange: removeDateRange,
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4} px={6}>
        <HStack justify="space-between">
          <HStack gap={2}>
            {[{ view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', cp: 'blue' },
              { view: 'pipeline', icon: Kanban, label: 'Pipeline', cp: 'blue' },
              { view: 'company', icon: Building2, label: 'By Company', cp: 'blue' },
              { view: 'bi', icon: BarChart2, label: 'Business Intelligence', cp: 'teal' },
              { view: 'insights', icon: Sparkles, label: 'AI Insights', cp: 'purple' }
            ].map(({ view, icon: Icon, label, cp }) => (
              <Button key={view} variant={activeView === view ? 'solid' : 'ghost'} onClick={() => setActiveView(view)} colorPalette={cp} size="sm"><Icon size={16} />{label}</Button>
            ))}
            <Button colorPalette="green" size="sm" onClick={() => setAddDialogOpen(true)} _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }} transition="all 0.2s"><Plus size={16} />Add Opportunity</Button>
          </HStack>
          <Text fontSize="sm" color="gray.600">{opportunities.length} opportunities</Text>
        </HStack>
      </Box>

      {activeView === 'dashboard' && <PipelineDashboard opportunities={filteredOpportunities} metrics={filteredMetrics} onStageClick={handleStageToggle} {...filterProps} />}
      {activeView === 'pipeline' && <SalesPipelineBoard opportunities={filteredOpportunities} onOpportunityMove={refetch} {...filterProps} />}
      {activeView === 'company' && <CompanyPipelineView opportunities={filteredOpportunities} {...filterProps} />}
      {activeView === 'bi' && <BusinessIntelligenceView opportunities={filteredOpportunities} {...filterProps} />}
      {activeView === 'insights' && <AIInsightsView opportunities={filteredOpportunities} {...filterProps} />}
      <AddOpportunityDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSave={refetch} />
    </Box>
  );
};

export default App;
v
