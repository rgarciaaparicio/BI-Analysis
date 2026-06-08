import { useState } from 'react';
import { Box, HStack, VStack, Text, Badge, Collapsible, Separator, SimpleGrid, IconButton } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, DollarSign, TrendingUp, Calendar, Heart, AlertTriangle, CheckCircle, ChevronDown, FileText, Clock, MapPin, Layers, Tag, Mail, Edit } from 'lucide-react';
import EditOpportunityDialog from './EditOpportunityDialog';

const conversionColors = {
  '90%': { bg: 'green.100', color: 'green.700', gradient: 'to-r', from: 'green.400', to: 'green.600' },
  '75%': { bg: 'blue.100', color: 'blue.700', gradient: 'to-r', from: 'blue.400', to: 'blue.600' },
  '50%': { bg: 'orange.100', color: 'orange.700', gradient: 'to-r', from: 'orange.400', to: 'orange.600' },
  '25%': { bg: 'red.100', color: 'red.700', gradient: 'to-r', from: 'red.400', to: 'red.600' },
  '10%': { bg: 'red.100', color: 'red.800', gradient: 'to-r', from: 'red.500', to: 'red.700' },
  '0%': { bg: 'gray.100', color: 'gray.700', gradient: 'to-r', from: 'gray.400', to: 'gray.600' },
};

const OpportunityCard = ({ opportunity, isDragOverlay = false, isExpanded = false, onToggle, isWide = false }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const conversionStyle = conversionColors[opportunity.conversionChance] || conversionColors['0%'];
  const dealValue = opportunity.dealAmount ? `$${opportunity.dealAmount.toLocaleString()}` : 'N/A';
  const companyName = opportunity.company?.join(', ') || 'Unknown Company';
  const salesTeamName = opportunity.salesTeam?.join(', ') || 'Unassigned';
  
  // Health status display for Closed/Won opportunities
  const isClosedWon = opportunity.group?.id === 'new_group75648';
  const healthStatus = opportunity.healthStatus?.displayValue;
  
  const getHealthConfig = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('healthy') || statusLower.includes('on track')) {
      return { color: 'green', icon: CheckCircle, label: 'Healthy' };
    }
    if (statusLower.includes('at risk') || statusLower.includes('warning')) {
      return { color: 'orange', icon: AlertTriangle, label: 'At Risk' };
    }
    if (statusLower.includes('critical') || statusLower.includes('urgent')) {
      return { color: 'red', icon: AlertTriangle, label: 'Critical' };
    }
    return { color: 'gray', icon: Heart, label: status };
  };
  
  const healthConfig = isClosedWon && healthStatus ? getHealthConfig(healthStatus) : null;

  const handleCardClick = (e) => {
    // Only trigger toggle if not dragging and not clicking on drag handle
    if (!isDragging && onToggle) {
      e.stopPropagation();
      onToggle(opportunity.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    // Trigger refetch or update in parent
    window.location.reload(); // Simple approach - refresh to show changes
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg="white"
      border="1px solid"
      borderColor={isDragging ? 'blue.300' : isExpanded ? 'blue.400' : 'gray.200'}
      borderRadius="lg"
      boxShadow={isDragOverlay ? 'xl' : isDragging ? 'lg' : isExpanded ? 'md' : 'sm'}
      opacity={isDragging && !isDragOverlay ? 0.5 : 1}
      transition="all 0.2s"
      {...attributes}
    >
      <VStack align="stretch" gap={0}>
        {/* Header: Company & Conversion - Clickable area */}
        <HStack 
          justify="space-between" 
          align="start"
          cursor="pointer"
          onClick={handleCardClick}
          p={4}
          borderTopRadius="lg"
          _hover={{ bg: 'gray.50' }}
          transition="background 0.15s"
          {...listeners}
        >
          <HStack gap={2} flex={1}>
            <Building2 size={16} color="var(--chakra-colors-gray-500)" />
            <Text fontSize="sm" fontWeight="600" color="gray.900" lineHeight="1.2" noOfLines={1}>
              {companyName}
            </Text>
          </HStack>
          <HStack gap={1}>
            <IconButton
              variant="ghost"
              size="xs"
              onClick={handleEditClick}
              aria-label="Edit opportunity"
              color="gray.500"
              _hover={{ color: 'blue.600', bg: 'blue.50' }}
            >
              <Edit size={14} />
            </IconButton>
            <Badge
              bgGradient={conversionStyle.gradient}
              gradientFrom={conversionStyle.from}
              gradientTo={conversionStyle.to}
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="700"
            >
              {opportunity.conversionChance || '0%'}
            </Badge>
            <Box
              transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.2s"
              color="gray.400"
            >
              <ChevronDown size={16} />
            </Box>
          </HStack>
        </HStack>

        {/* Main Card Content */}
        <VStack align="stretch" gap={3} px={4} pb={4}>
          {/* Deal Name */}
          <Text fontSize="md" fontWeight="700" color="gray.900" lineHeight="1.3" noOfLines={2}>
            {opportunity.name}
          </Text>

          {/* Deal Amount */}
          <HStack gap={2}>
            <DollarSign size={16} color="var(--chakra-colors-green-600)" />
            <Text fontSize="lg" fontWeight="700" color="gray.900">
              {dealValue}
            </Text>
          </HStack>

          {/* Status & Type */}
          <HStack gap={2} flexWrap="wrap">
            {opportunity.status && (
              <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                {opportunity.status}
              </Badge>
            )}
            {opportunity.type && (
              <Badge colorPalette="purple" variant="subtle" fontSize="xs">
                {opportunity.type}
              </Badge>
            )}
            {healthConfig && (
              <Badge colorPalette={healthConfig.color} variant="solid" fontSize="xs">
                <HStack gap={1}>
                  <healthConfig.icon size={12} />
                  <Text>{healthConfig.label}</Text>
                </HStack>
              </Badge>
            )}
          </HStack>

          {/* Additional Information (Wide Mode Only) */}
          {isWide && (
            <VStack align="stretch" gap={3} pt={2} borderTop="1px solid" borderColor="gray.100">
              <SimpleGrid columns={2} gap={2}>
                {opportunity.region && opportunity.region.length > 0 && (
                  <HStack gap={1.5}>
                    <MapPin size={12} color="var(--chakra-colors-gray-400)" />
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {opportunity.region.join(', ')}
                    </Text>
                  </HStack>
                )}
                {opportunity.complexity && (
                  <HStack gap={1.5}>
                    <Layers size={12} color="var(--chakra-colors-gray-400)" />
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {opportunity.complexity}
                    </Text>
                  </HStack>
                )}
                {opportunity.dealType && opportunity.dealType.length > 0 && (
                  <HStack gap={1.5}>
                    <Tag size={12} color="var(--chakra-colors-gray-400)" />
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {opportunity.dealType[0]}
                    </Text>
                  </HStack>
                )}
              </SimpleGrid>
              {opportunity.poc?.email && (
                <HStack gap={1.5}>
                  <Mail size={12} color="var(--chakra-colors-gray-400)" />
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {opportunity.poc.label || opportunity.poc.email}
                  </Text>
                </HStack>
              )}
              {opportunity.timeline && (
                <HStack gap={1.5}>
                  <Calendar size={12} color="var(--chakra-colors-gray-400)" />
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {opportunity.timeline.from} - {opportunity.timeline.to}
                  </Text>
                </HStack>
              )}
              
              {/* Engagement Description */}
              {opportunity.engagementDescription && (
                <VStack align="stretch" gap={1.5}>
                  <HStack gap={1.5}>
                    <FileText size={12} color="var(--chakra-colors-gray-400)" />
                    <Text fontSize="xs" fontWeight="600" color="gray.700">
                      Engagement Description
                    </Text>
                  </HStack>
                  <Text 
                    fontSize="xs" 
                    color="gray.600" 
                    lineHeight="1.5"
                    bg="gray.50"
                    p={2.5}
                    borderRadius="md"
                  >
                    {opportunity.engagementDescription}
                  </Text>
                </VStack>
              )}
            </VStack>
          )}

          {/* Footer: Sales Team & Date */}
          <HStack justify="space-between" pt={2} borderTop="1px solid" borderColor="gray.100">
            <Text fontSize="xs" color="gray.600" noOfLines={1}>
              {salesTeamName}
            </Text>
            {opportunity.dateAdded && (
              <HStack gap={1}>
                <Calendar size={12} color="var(--chakra-colors-gray-400)" />
                <Text fontSize="xs" color="gray.500">
                  {new Date(opportunity.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>

        {/* Expandable Details Section */}
        <Collapsible.Root open={isExpanded}>
          <Collapsible.Content>
            <VStack align="stretch" gap={3} px={4} pb={4}>
              <Separator />
              
              {/* Engagement Description */}
              {opportunity.engagementDescription && (
                <VStack align="stretch" gap={2}>
                  <HStack gap={2}>
                    <FileText size={14} color="var(--chakra-colors-gray-500)" />
                    <Text fontSize="xs" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                      Engagement Description
                    </Text>
                  </HStack>
                  <Text 
                    fontSize="sm" 
                    color="gray.600" 
                    lineHeight="1.6"
                    bg="gray.50"
                    p={3}
                    borderRadius="md"
                  >
                    {opportunity.engagementDescription}
                  </Text>
                </VStack>
              )}

              {/* Last Updated */}
              {opportunity.lastUpdated && (
                <HStack gap={2} p={2} bg="blue.50" borderRadius="md">
                  <Clock size={14} color="var(--chakra-colors-blue-500)" />
                  <Text fontSize="xs" color="gray.700">
                    <Text as="span" fontWeight="600">Last Updated:</Text>{' '}
                    {new Date(opportunity.lastUpdated).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </Text>
                </HStack>
              )}

              {!opportunity.engagementDescription && !opportunity.lastUpdated && (
                <Text fontSize="sm" color="gray.400" textAlign="center" py={2}>
                  No additional details available
                </Text>
              )}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      </VStack>
      
      {/* Edit Dialog */}
      <EditOpportunityDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        opportunity={opportunity}
        onSave={handleEditSave}
      />
    </Box>
  );
};

export default OpportunityCard;
