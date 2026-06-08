import { VStack, SimpleGrid } from '@chakra-ui/react';
import { StatusSelect, DropdownField } from './EditFormHelpers';

const complexityOpts = ['Medium', 'High', 'Low'];
const typeOpts = ['Subscription', 'Pilot', 'Single Request', 'At Risk PO', 'Consumption'];
const transactionTypeOpts = ['New Deal', 'Crosssell', 'Renewal', 'Downsell', 'Upsell', 'Churn'];
const deliveryComplexityOpts = ['High', 'Medium', 'Low'];
const recruitmentEffortOpts = ['Medium', 'Easy', 'Hard'];
const forecastCategoryOpts = ['Top Shelf', 'Most Likely', 'Best Case'];
const deviceShipmentOpts = ['MAYBE', 'YES', 'NO'];
const engineeringOpts = ['MAYBE', 'YES', 'NO'];
const dealTypeOpts = ['Prompt/Response Review', 'Evaluation', 'Image', 'Biometric', 'Annotation', 'Video', 'Voice', 'Red Team', 'Document', 'Staffing', 'A11Y', 'Functional', 'Payments', 'UX', 'Data Collection', 'Labeling', 'Ground Truth'];
const aiTypeOpts = ['Data Collection - In home', 'AI Evaluation', 'Data Collection - Moderated', 'Staffing', 'Recruitment Only', 'Data Collection - Hybrid', 'AI Red Teaming'];
const annotationTypeOpts = ['Classification', 'NER', 'Transcription', 'Bounding box', 'Segmentation', 'Ranking', 'RLHF preference', 'SFT response writing', 'Rubric scoring'];
const targetOpts = ['Artifact', 'Participant'];
const multiSelectOpts = ['Generalist', 'Linguistic & cultural diversity', 'Domain expert', 'Security researchers'];

const EditFormDetailsTab = ({ formData, onChange }) => {
  const set = (key, val) => onChange(key, val);
  return (
    <VStack gap={4} align="stretch" pt={4}>
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Complexity" options={complexityOpts} value={formData.complexity} onChange={v => set('complexity', v)} />
        <StatusSelect label="Type" options={typeOpts} value={formData.type} onChange={v => set('type', v)} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Transaction Type" options={transactionTypeOpts} value={formData.transactionType} onChange={v => set('transactionType', v)} />
        <StatusSelect label="Delivery Complexity" options={deliveryComplexityOpts} value={formData.deliveryComplexity} onChange={v => set('deliveryComplexity', v)} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Recruitment Effort" options={recruitmentEffortOpts} value={formData.recruitmentEffort} onChange={v => set('recruitmentEffort', v)} />
        <StatusSelect label="Forecast Category" options={forecastCategoryOpts} value={formData.forecastCategory} onChange={v => set('forecastCategory', v)} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <StatusSelect label="Device Shipment" options={deviceShipmentOpts} value={formData.deviceShipment} onChange={v => set('deviceShipment', v)} />
        <StatusSelect label="Engineering Support" options={engineeringOpts} value={formData.engineeringTeamSupport} onChange={v => set('engineeringTeamSupport', v)} />
      </SimpleGrid>
      <DropdownField label="Deal Type" options={dealTypeOpts} value={formData.dealType} onChange={v => set('dealType', v)} />
      <DropdownField label="AI Type" options={aiTypeOpts} value={formData.aiType} onChange={v => set('aiType', v)} />
      <DropdownField label="Annotation Type" options={annotationTypeOpts} value={formData.annotationType} onChange={v => set('annotationType', v)} />
      <SimpleGrid columns={2} gap={4}>
        <DropdownField label="Target" options={targetOpts} value={formData.target} onChange={v => set('target', v)} />
        <DropdownField label="Multi Select" options={multiSelectOpts} value={formData.multiSelect} onChange={v => set('multiSelect', v)} />
      </SimpleGrid>
    </VStack>
  );
};

export default EditFormDetailsTab;
