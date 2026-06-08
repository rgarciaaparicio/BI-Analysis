import { Box, HStack, VStack, Text, Button, Card, Center, Badge } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

const InsightDisplay = ({ category, data, onRegenerate, isLoading }) => {
  if (!data) return null;

  const renderContent = () => {
    if (category.id === 'health') {
      return (
        <VStack align="stretch" gap={4}>
          <HStack><Badge colorPalette={data.healthScore >= 7 ? 'green' : data.healthScore >= 5 ? 'orange' : 'red'} fontSize="lg" px={3} py={1}>Score: {data.healthScore}/10</Badge></HStack>
          <Text color="gray.700">{data.summary}</Text>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Strengths</Text>{data.strengths?.map((s, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {s}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Concerns</Text>{data.concerns?.map((c, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {c}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Recommendations</Text>{data.recommendations?.map((r, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {r}</Text>)}</Box>
        </VStack>
      );
    }
    if (category.id === 'risks') {
      return (
        <VStack align="stretch" gap={4}>
          <HStack gap={4} flexWrap="wrap"><Badge colorPalette="red" fontSize="md" px={3} py={1}>{data.riskCount} At-Risk Deals</Badge><Badge colorPalette="orange" fontSize="md" px={3} py={1}>${(data.totalAtRiskValue || 0).toLocaleString()} at Risk</Badge></HStack>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Risk Patterns</Text>{data.patterns?.map((p, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {p}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>High Priority Deals</Text>{data.highPriorityDeals?.map((d, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {d}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Mitigation Steps</Text>{data.mitigationSteps?.map((m, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {m}</Text>)}</Box>
        </VStack>
      );
    }
    if (category.id === 'opportunities') {
      return (
        <VStack align="stretch" gap={4}>
          <HStack><Badge colorPalette="blue" fontSize="md" px={3} py={1}>${(data.totalPotentialValue || 0).toLocaleString()} Potential Value</Badge></HStack>
          {data.topDeals?.map((deal, i) => (
            <Box key={i} p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
              <Text fontWeight="700" color="gray.900" mb={2}>{deal.name}</Text>
              <Text fontSize="sm" color="gray.700" mb={2}><strong>Why:</strong> {deal.reason}</Text>
              <Text fontSize="sm" color="gray.700"><strong>Next Steps:</strong> {deal.nextSteps}</Text>
            </Box>
          ))}
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Key Insights</Text>{data.keyInsights?.map((ins, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {ins}</Text>)}</Box>
        </VStack>
      );
    }
    if (category.id === 'conversion') {
      return (
        <VStack align="stretch" gap={4}>
          <HStack><Badge colorPalette="orange" fontSize="md" px={3} py={1}>Current Win Rate: {data.currentWinRate}</Badge></HStack>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Conversion Bottlenecks</Text>{data.bottlenecks?.map((b, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {b}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Best Practices</Text>{data.bestPractices?.map((bp, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {bp}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Actionable Steps</Text>{data.actionableSteps?.map((a, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {a}</Text>)}</Box>
        </VStack>
      );
    }
    if (category.id === 'accounts') {
      return (
        <VStack align="stretch" gap={4}>
          {data.priorityAccounts?.map((acct, i) => (
            <Box key={i} p={4} bg="purple.50" borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
              <Text fontWeight="700" color="gray.900" mb={2}>{acct.name}</Text>
              <Text fontSize="sm" color="gray.700" mb={2}><strong>Priority Reason:</strong> {acct.reason}</Text>
              <Text fontSize="sm" color="gray.700"><strong>Strategy:</strong> {acct.strategy}</Text>
            </Box>
          ))}
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Cross-Sell Opportunities</Text>{data.crossSellOpportunities?.map((c, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {c}</Text>)}</Box>
          <Box><Text fontWeight="600" color="gray.900" mb={2}>Engagement Tips</Text>{data.engagementTips?.map((t, i) => <Text key={i} fontSize="sm" color="gray.700" mb={1}>• {t}</Text>)}</Box>
        </VStack>
      );
    }
    return <Text color="gray.500">No insights available</Text>;
  };

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between">
          <HStack gap={3}>
            <Center w="10" h="10" bg={`${category.color}.100`} rounded="lg"><category.icon size={20} color={`var(--chakra-colors-${category.color}-600)`} /></Center>
            <VStack align="start" gap={0}><Text fontWeight="700" color="gray.900">{category.title}</Text><Text fontSize="sm" color="gray.500">AI-generated insights</Text></VStack>
          </HStack>
          <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={isLoading}><RefreshCw size={16} />Regenerate</Button>
        </HStack>
      </Card.Header>
      <Card.Body>{renderContent()}</Card.Body>
    </Card.Root>
  );
};

export default InsightDisplay;
