import { useState } from 'react';
import { Box, Container, Stack, HStack, VStack, Text, Button, Card, SimpleGrid, Center, Spinner, Alert, Badge } from '@chakra-ui/react';
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, Users, RefreshCw } from 'lucide-react';
import { useAI } from '@api/use-ai';
import PageHeader from '@components/PageHeader';
import FilterBadges from './FilterBadges';
import { INSIGHT_CATEGORIES } from './insightCategories';
import InsightDisplay from './InsightDisplay';

const CategoryCard = ({ category, onClick, isActive }) => {
  const Icon = category.icon;
  return (
    <Card.Root cursor="pointer" onClick={onClick} borderWidth="2px"
      borderColor={isActive ? `${category.color}.500` : 'gray.200'}
      bg={isActive ? `${category.color}.50` : 'white'}
      _hover={{ borderColor: `${category.color}.400`, transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s">
      <Card.Body p={4}>
        <VStack align="start" gap={3}>
          <HStack justify="space-between" w="full">
            <Center w="10" h="10" bg={`${category.color}.100`} rounded="lg">
              <Icon size={20} color={`var(--chakra-colors-${category.color}-600)`} />
            </Center>
            {isActive && <Badge colorPalette={category.color}>Active</Badge>}
          </HStack>
          <VStack align="start" gap={1}>
            <Text fontWeight="600" color="gray.900">{category.title}</Text>
            <Text fontSize="sm" color="gray.500">{category.description}</Text>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

const AIInsightsView = ({ opportunities, ...filterProps }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { callAI, loading, error, data, errorMessage, isRetryable, retry, reset } = useAI();

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    reset();
    const prompt = category.prompt(opportunities);
    await callAI(prompt, { schema: category.schema });
  };

  return (
    <Box bg="gray.50" minH="100vh" w="100%">
      <Container py={8} maxW="1400px">
        <Stack direction="column" gap={6}>
          <PageHeader title="AI Insights" subtitle="AI-powered analysis of your sales pipeline" />
          <FilterBadges {...filterProps} />
          <HStack gap={2} align="center" p={3} bg="purple.50" border="1px solid" borderColor="purple.200" borderRadius="lg">
            <Sparkles size={16} color="var(--chakra-colors-purple-600)" />
            <Text fontSize="sm" color="purple.700">Select an insight category below to generate AI-powered recommendations</Text>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {INSIGHT_CATEGORIES.map(cat => (
              <CategoryCard key={cat.id} category={cat} onClick={() => handleCategoryClick(cat)} isActive={selectedCategory?.id === cat.id} />
            ))}
          </SimpleGrid>
          {loading && <Center py={12}><VStack gap={4}><Spinner size="xl" colorPalette="purple" /><Text color="gray.600">Analyzing pipeline data...</Text></VStack></Center>}
          {error && <Alert.Root status="error"><Alert.Indicator /><Alert.Title>Analysis Failed</Alert.Title><Alert.Description>{errorMessage}{isRetryable && <Button size="sm" onClick={retry} mt={2} variant="outline">Retry</Button>}</Alert.Description></Alert.Root>}
          {data && selectedCategory && <InsightDisplay category={selectedCategory} data={data.data} onRegenerate={retry} isLoading={loading} />}
        </Stack>
      </Container>
    </Box>
  );
};

export default AIInsightsView;
