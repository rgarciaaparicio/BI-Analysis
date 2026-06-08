import { Box, VStack, HStack, Text, Card, Badge, SimpleGrid, Separator } from '@chakra-ui/react';
import { Sparkles, Target, TrendingUp, Lightbulb } from 'lucide-react';

const BIDeepDive = ({ data }) => {
  if (!data) return null;

  return (
    <Card.Root bg="purple.50" border="1px solid" borderColor="purple.200">
      <Card.Body p={5}>
        <VStack align="stretch" gap={4}>
          <HStack><Sparkles size={20} color="var(--chakra-colors-purple-600)" /><Text fontWeight="800" fontSize="lg" color="purple.800">BI Deep Dive Analysis</Text></HStack>
          
          <Box bg="white" p={3} borderRadius="md"><Text fontSize="sm" color="gray.700" fontStyle="italic">{data.scope}</Text></Box>
          
          <Box><Text fontWeight="700" mb={1} color="gray.800">📊 Account Penetration</Text><Text fontSize="sm" color="gray.700">{data.penetration}</Text></Box>
          
          <Separator />
          
          <Box>
            <Text fontWeight="700" mb={2} color="gray.800">🎯 Top Whitespace Opportunities</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              {data.whitespace?.map((w, i) => (
                <Box key={i} bg="white" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                  <Text fontWeight="700" fontSize="sm" color="blue.700">{w.company}</Text>
                  <Text fontSize="xs" color="gray.600" mt={1}><b>Gaps:</b> {w.gaps}</Text>
                  <Text fontSize="xs" color="green.700" mt={1}><b>Potential:</b> {w.potential}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
          
          <Separator />
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <HStack mb={2}><TrendingUp size={16} color="var(--chakra-colors-blue-600)" /><Text fontWeight="700" color="gray.800">Land & Expand Patterns</Text></HStack>
              <VStack align="stretch" gap={1}>{data.patterns?.map((p, i) => <Text key={i} fontSize="xs" color="gray.700">• {p}</Text>)}</VStack>
            </Box>
            <Box>
              <HStack mb={2}><Lightbulb size={16} color="var(--chakra-colors-orange-600)" /><Text fontWeight="700" color="gray.800">Strategic Themes</Text></HStack>
              <VStack align="stretch" gap={1}>{data.themes?.map((t, i) => <Text key={i} fontSize="xs" color="gray.700">• {t}</Text>)}</VStack>
            </Box>
          </SimpleGrid>
          
          <Separator />
          
          <Box>
            <HStack mb={2}><Target size={16} color="var(--chakra-colors-green-600)" /><Text fontWeight="700" color="gray.800">Prioritized Expansion Targets</Text></HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={2}>
              {data.priorities?.map((p, i) => (
                <Box key={i} bg="white" p={3} borderRadius="md" border="1px solid" borderColor="green.200">
                  <Text fontWeight="700" fontSize="sm" color="green.700">{p.account}</Text>
                  <Badge colorPalette="blue" mt={1} fontSize="xs">{p.offering}</Badge>
                  <Text fontSize="xs" color="gray.600" mt={1}>{p.rationale}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default BIDeepDive;
