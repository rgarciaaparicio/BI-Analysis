import { HStack, Text, Badge, Button } from '@chakra-ui/react';
import { X } from 'lucide-react';

const FilterBadges = ({ selectedStages, selectedAiTypes, selectedCompanies, selectedDateRanges, onRemoveStage, onRemoveAiType, onRemoveCompany, onRemoveDateRange, onClearFilter }) => {
  const hasFilters = selectedStages?.length > 0 || selectedAiTypes?.length > 0 || selectedCompanies?.length > 0 || selectedDateRanges?.length > 0;
  if (!hasFilters) return null;

  return (
    <HStack p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200" align="center" flexWrap="wrap" gap={2}>
      <Text fontSize="xs" fontWeight="700" color="blue.700" textTransform="uppercase" letterSpacing="0.05em">Active:</Text>
      
      {selectedStages?.map((stage) => (
        <Badge key={stage.id} colorPalette="blue" fontSize="xs" px={2.5} py={1} cursor="pointer" _hover={{ bg: 'blue.200' }} onClick={() => onRemoveStage?.(stage.id)}>
          <HStack gap={1}><Text>{stage.title}</Text><X size={10} /></HStack>
        </Badge>
      ))}
      
      {selectedAiTypes?.map((type) => (
        <Badge key={type} colorPalette="purple" fontSize="xs" px={2.5} py={1} cursor="pointer" _hover={{ bg: 'purple.200' }} onClick={() => onRemoveAiType?.(type)}>
          <HStack gap={1}><Text>{type}</Text><X size={10} /></HStack>
        </Badge>
      ))}
      
      {selectedCompanies?.map((company) => (
        <Badge key={company} colorPalette="teal" fontSize="xs" px={2.5} py={1} cursor="pointer" _hover={{ bg: 'teal.200' }} onClick={() => onRemoveCompany?.(company)}>
          <HStack gap={1}><Text>{company}</Text><X size={10} /></HStack>
        </Badge>
      ))}
      
      {selectedDateRanges?.map((range) => (
        <Badge key={range.preset} colorPalette="orange" fontSize="xs" px={2.5} py={1} cursor="pointer" _hover={{ bg: 'orange.200' }} onClick={() => onRemoveDateRange?.(range.preset)}>
          <HStack gap={1}><Text>{range.label}</Text><X size={10} /></HStack>
        </Badge>
      ))}

      <Button variant="ghost" size="xs" onClick={onClearFilter} colorPalette="gray" ml={1}>
        <X size={12} /> Clear All
      </Button>
    </HStack>
  );
};

export default FilterBadges;
