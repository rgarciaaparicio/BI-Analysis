import { Box, VStack, Text, Center } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import OpportunityCard from './OpportunityCard';

const stageConfig = {
  'new_group65011': { title: 'Leads', color: 'orange' },
  'topics': { title: 'Opportunity', color: 'blue' },
  'new_group75648': { title: 'Closed/Won', color: 'green' },
  'new_group': { title: 'Closed/Lost', color: 'red' },
  'new_group24249': { title: 'Delivered', color: 'teal' },
};

const PipelineColumn = ({ stage, opportunities, expandedCardId, onCardToggle, isFiltered }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const config = stageConfig[stage.id] || { title: stage.title, color: 'gray' };
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.dealAmount || 0), 0);
  const columnWidth = isFiltered ? "1000px" : "320px";

  return (
    <Box ref={setNodeRef} minW={columnWidth} maxW={columnWidth}
      bg={isOver ? `${config.color}.50` : 'gray.50'}
      border="1px solid" borderColor={isOver ? `${config.color}.300` : 'gray.200'}
      borderRadius="xl" h="fit-content" maxH="calc(100vh - 200px)"
      display="flex" flexDirection="column" transition="all 0.2s">
      <Box p={4} borderBottom="1px solid" borderColor="gray.200">
        <VStack align="start" gap={1}>
          <Text fontWeight="700" fontSize="sm" color="gray.900">{config.title}</Text>
          <Text fontSize="xs" color="gray.500">
            {opportunities.length} deals • ${totalValue.toLocaleString()}
          </Text>
        </VStack>
      </Box>
      <Box p={3} flex="1" overflowY="auto">
        <SortableContext items={opportunities.map(o => o.id)} strategy={verticalListSortingStrategy}>
          <VStack gap={3} align="stretch">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp}
                isExpanded={expandedCardId === opp.id}
                onToggle={onCardToggle} isWide={isFiltered} />
            ))}
            {opportunities.length === 0 && (
              <Center py={8} color="gray.400">
                <Text fontSize="sm">No opportunities</Text>
              </Center>
            )}
          </VStack>
        </SortableContext>
      </Box>
    </Box>
  );
};

export default PipelineColumn;
