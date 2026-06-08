import { useState, useMemo, useEffect } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import OpportunityCard from './OpportunityCard';
import PipelineColumn from './PipelineColumn';
import FilterBar from './FilterBar';
import FilterBadges from './FilterBadges';
import BoardSDK from '@api/BoardSDK';

const board = new BoardSDK();

const SalesPipelineBoard = ({ opportunities, onOpportunityMove, ...filterProps }) => {
  const { selectedStages, selectedAiTypes, selectedCompanies, selectedDateRanges } = filterProps;
  const [localOpportunities, setLocalOpportunities] = useState(opportunities);
  const [activeOpportunity, setActiveOpportunity] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { setLocalOpportunities(opportunities); }, [opportunities]);

  const isFiltered = selectedStages.length > 0 || selectedAiTypes.length > 0 ||
    selectedCompanies.length > 0 || selectedDateRanges.length > 0;

  const stages = useMemo(() => {
    const stageMap = new Map();
    localOpportunities.forEach(opp => {
      const groupId = opp.group?.id;
      if (!stageMap.has(groupId)) {
        stageMap.set(groupId, { id: groupId, title: opp.group?.title || 'Unknown', opportunities: [] });
      }
      stageMap.get(groupId).opportunities.push(opp);
    });
    return Array.from(stageMap.values());
  }, [localOpportunities]);

  const handleDragStart = (event) => {
    setActiveOpportunity(localOpportunities.find(o => o.id === event.active.id) || null);
  };

  const handleCardToggle = (cardId) => {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveOpportunity(null);
    if (!over || active.id === over.id) return;
    const oppId = active.id;
    const targetGroupId = over.id.startsWith('new_group') || over.id === 'topics'
      ? over.id : localOpportunities.find(o => o.id === over.id)?.group?.id;
    if (!targetGroupId) return;
    const opportunity = localOpportunities.find(o => o.id === oppId);
    if (!opportunity || opportunity.group?.id === targetGroupId) return;
    const prevOpportunities = localOpportunities;
    setLocalOpportunities(localOpportunities.map(o =>
      o.id === oppId ? { ...o, group: { ...o.group, id: targetGroupId } } : o
    ));
    try {
      await board.item(oppId).update().inGroup(targetGroupId).execute();
      onOpportunityMove?.();
    } catch (err) {
      console.error('Failed to move opportunity:', err);
      setLocalOpportunities(prevOpportunities);
    }
  };

  return (
    <Box bg="gray.100" p={6} overflowX="auto" minH="calc(100vh - 120px)">
      <Box mb={4}><FilterBar opportunities={opportunities} {...filterProps} /></Box>
      <Box mb={4}><FilterBadges {...filterProps} /></Box>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <HStack gap={4} align="start">
          {stages.map(stage => (
            <PipelineColumn key={stage.id} stage={stage}
              opportunities={stage.opportunities}
              expandedCardId={expandedCardId}
              onCardToggle={handleCardToggle}
              isFiltered={isFiltered} />
          ))}
        </HStack>
        <DragOverlay>
          {activeOpportunity ? <OpportunityCard opportunity={activeOpportunity} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
};

export default SalesPipelineBoard;
