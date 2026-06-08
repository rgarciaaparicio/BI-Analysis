import { VStack, SimpleGrid } from '@chakra-ui/react';
import { StatusSelect, TextField } from './EditFormHelpers';

const statusOpts = ['Sold', 'Cancelled', 'Pending', 'On Hold', 'In Progress', 'Completed', 'Active'];
const conversionOpts = ['90%', '75%', '50%', '25%', '10%', '5%', '0%'];
const opportunityTypeOpts = ['LEAD', 'OPPORTUNITY'];

const EditFormBasicTab = ({ formData, onChange }) => {
  const set = (key, val) => onChange(key, val);
  return (
    <VStack gap={4} align="stretch" pt={4}>
      <TextField label="Deal Name" value={formData.name} onChange={v => set('name', v)} />
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Status" options={statusOpts} value={formData.status} onChange={v => set('status', v)} />
        <StatusSelect label="Conversion Chance" options={conversionOpts} value={formData.conversionChance} onChange={v => set('conversionChance', v)} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Opportunity Type" options={opportunityTypeOpts} value={formData.opportunityType} onChange={v => set('opportunityType', v)} />
        <TextField label="Date Added" value={formData.dateAdded} onChange={v => set('dateAdded', v)} type="date" />
      </SimpleGrid>
      <TextField label="Deal Amount" value={formData.dealAmount} onChange={v => set('dealAmount', v)} type="number" />
      <TextField label="Engagement Description" value={formData.engagementDescription} onChange={v => set('engagementDescription', v)} rows={4} />
      <TextField label="Task Description" value={formData.taskDescription} onChange={v => set('taskDescription', v)} rows={3} />
    </VStack>
  );
};

export default EditFormBasicTab;
