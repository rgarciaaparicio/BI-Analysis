import { useMemo } from 'react';
import { Box, VStack, HStack, Text, Badge, Table, Tooltip } from '@chakra-ui/react';
import { CheckCircle, Clock, Minus } from 'lucide-react';

const ALL_OFFERINGS = ['Prompt/Response Review', 'Evaluation', 'Image', 'Biometric', 'Annotation', 'Video', 'Voice', 'Red Team', 'Document', 'Staffing', 'A11Y', 'Functional', 'Payments', 'UX', 'Data Collection', 'Labeling', 'Ground Truth'];

const BIOfferMatrix = ({ opportunities, onSelectCompany }) => {
  const { matrix, topCompanies, offeringPopularity } = useMemo(() => {
    const companyMap = {};
    opportunities.forEach(o => {
      o.company?.forEach(c => {
        if (!companyMap[c]) companyMap[c] = { won: new Set(), pipeline: new Set(), lost: new Set(), totalValue: 0 };
        const isWon = ['new_group75648', 'new_group24249'].includes(o.group?.id);
        const isActive = ['new_group65011', 'topics'].includes(o.group?.id);
        const isLost = o.group?.id === 'new_group';
        o.dealType?.forEach(dt => {
          if (isWon) companyMap[c].won.add(dt);
          else if (isActive) companyMap[c].pipeline.add(dt);
          else if (isLost) companyMap[c].lost.add(dt);
        });
        if (isWon) companyMap[c].totalValue += o.dealAmount || 0;
      });
    });

    const topCompanies = Object.entries(companyMap)
      .sort((a, b) => b[1].totalValue - a[1].totalValue)
      .slice(0, 15).map(([name]) => name);

    const offeringPop = {};
    ALL_OFFERINGS.forEach(off => {
      offeringPop[off] = Object.values(companyMap).filter(c => c.won.has(off)).length;
    });
    const sortedOfferings = [...ALL_OFFERINGS].sort((a, b) => offeringPop[b] - offeringPop[a]);

    return { matrix: companyMap, topCompanies, offeringPopularity: offeringPop, sortedOfferings };
  }, [opportunities]);

  const sortedOfferings = useMemo(() =>
    [...ALL_OFFERINGS].sort((a, b) => (offeringPopularity[b] || 0) - (offeringPopularity[a] || 0))
  , [offeringPopularity]);

  const getCell = (company, offering) => {
    const data = matrix[company];
    if (!data) return 'none';
    if (data.won.has(offering)) return 'won';
    if (data.pipeline.has(offering)) return 'pipeline';
    if (data.lost.has(offering)) return 'lost';
    return 'none';
  };

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between" flexWrap="wrap">
        <Text fontWeight="700" fontSize="lg">Company × Offering Penetration Matrix</Text>
        <HStack gap={3} fontSize="xs">
          <HStack gap={1}><CheckCircle size={12} color="green" /><Text>Won</Text></HStack>
          <HStack gap={1}><Clock size={12} color="blue" /><Text>Pipeline</Text></HStack>
          <HStack gap={1}><Minus size={12} color="gray" /><Text>Gap</Text></HStack>
        </HStack>
      </HStack>
      <Box overflowX="auto" bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader position="sticky" left={0} bg="gray.50" zIndex={1} minW="120px" h="140px" verticalAlign="bottom" pb={2}>Company</Table.ColumnHeader>
              {sortedOfferings.map(off => (
                <Table.ColumnHeader key={off} textAlign="center" px={1} minW="44px" h="140px" verticalAlign="bottom" pb={2} overflow="visible">
                  <Box position="relative" h="full" w="full" display="flex" alignItems="flex-end" justifyContent="center">
                    <Text fontSize="2xs" position="absolute" bottom="0" left="50%" transform="rotate(-45deg)" transformOrigin="bottom left" whiteSpace="nowrap" ml="4px">{off}</Text>
                  </Box>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topCompanies.map(company => (
              <Table.Row key={company} _hover={{ bg: 'blue.50' }} cursor="pointer" onClick={() => onSelectCompany(company)}>
                <Table.Cell position="sticky" left={0} bg="white" zIndex={1} fontWeight="600" fontSize="xs" color="blue.700">{company}</Table.Cell>
                {sortedOfferings.map(off => {
                  const status = getCell(company, off);
                  return (
                    <Table.Cell key={off} textAlign="center" px={1}>
                      {status === 'won' && <Box w={4} h={4} borderRadius="sm" bg="green.500" mx="auto" />}
                      {status === 'pipeline' && <Box w={4} h={4} borderRadius="sm" bg="blue.400" mx="auto" />}
                      {status === 'lost' && <Box w={4} h={4} borderRadius="sm" bg="red.200" mx="auto" />}
                      {status === 'none' && <Box w={4} h={4} borderRadius="sm" bg="gray.100" mx="auto" />}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Text fontWeight="600" mb={2} fontSize="sm">Offering Adoption (Won Clients)</Text>
        <HStack gap={2} flexWrap="wrap">
          {sortedOfferings.map(off => (
            <Badge key={off} colorPalette={offeringPopularity[off] > 3 ? 'green' : offeringPopularity[off] > 1 ? 'blue' : 'gray'} fontSize="xs">
              {off}: {offeringPopularity[off]}
            </Badge>
          ))}
        </HStack>
      </Box>
    </VStack>
  );
};

export default BIOfferMatrix;
