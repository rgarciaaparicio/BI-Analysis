import { VStack, SimpleGrid, Text } from '@chakra-ui/react';
import { StatusSelect, TextField, LinkField } from './EditFormHelpers';

const internalTestOpts = ['Send Email'];

const EditFormMoreTab = ({ formData, onChange }) => {
  const set = (key, val) => onChange(key, val);
  return (
    <VStack gap={4} align="stretch" pt={4}>
      <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wide">
        Timeline & Dates
      </Text>
      <SimpleGrid columns={2} gap={4}>
        <TextField label="Timeline Start" value={formData.timelineFrom} onChange={v => set('timelineFrom', v)} type="date" />
        <TextField label="Timeline End" value={formData.timelineTo} onChange={v => set('timelineTo', v)} type="date" />
      </SimpleGrid>
      <TextField label="Last Updated On" value={formData.lastUpdatedOn} onChange={v => set('lastUpdatedOn', v)} type="date" />

      <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wide" pt={2}>
        Updates & Notes
      </Text>
      <TextField label="Latest Update" value={formData.latestUpdate} onChange={v => set('latestUpdate', v)} rows={3} />
      <TextField label="Comments" value={formData.comments} onChange={v => set('comments', v)} rows={3} />
      <SimpleGrid columns={2} gap={4}>
        <TextField label="Demographics" value={formData.demographics} onChange={v => set('demographics', v)} />
        <TextField label="Purchase Order" value={formData.purchaseOrder} onChange={v => set('purchaseOrder', v)} />
      </SimpleGrid>

      <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wide" pt={2}>
        Financial
      </Text>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Priced Margins" value={formData.pricedMargins} onChange={v => set('pricedMargins', v)} type="number" />
        <TextField label="Delivered Margins" value={formData.deliveredMargins} onChange={v => set('deliveredMargins', v)} type="number" />
        <TextField label="Count" value={formData.count} onChange={v => set('count', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Price/Artifact" value={formData.pricePerArtifact} onChange={v => set('pricePerArtifact', v)} type="number" />
        <TextField label="Price/Participant" value={formData.pricePerParticipant} onChange={v => set('pricePerParticipant', v)} type="number" />
        <TextField label="Time/Task (mins)" value={formData.timetaskMins} onChange={v => set('timetaskMins', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Payout: Flat Rate" value={formData.payoutFlatRate} onChange={v => set('payoutFlatRate', v)} type="number" />
        <TextField label="Payout: High" value={formData.payoutHigh} onChange={v => set('payoutHigh', v)} type="number" />
        <TextField label="Payout: Medium" value={formData.payoutMedium} onChange={v => set('payoutMedium', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Payout: Low" value={formData.payoutLow} onChange={v => set('payoutLow', v)} type="number" />
        <TextField label="QA Required" value={formData.qaRequired} onChange={v => set('qaRequired', v)} type="number" />
        <TextField label="Project Setup" value={formData.projectSetupstartup} onChange={v => set('projectSetupstartup', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Training Setup" value={formData.trainingSetup} onChange={v => set('trainingSetup', v)} type="number" />
        <TextField label="Onboarding" value={formData.onboarding} onChange={v => set('onboarding', v)} type="number" />
        <TextField label="Participant Support" value={formData.participantSupport} onChange={v => set('participantSupport', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap={4}>
        <TextField label="Automation" value={formData.automation} onChange={v => set('automation', v)} type="number" />
        <TextField label="Manual QA" value={formData.manualQa} onChange={v => set('manualQa', v)} type="number" />
        <TextField label="Annotation" value={formData.annotation} onChange={v => set('annotation', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <TextField label="Data/PM/Reporting" value={formData.dataProgramManagementReportingInternalComms} onChange={v => set('dataProgramManagementReportingInternalComms', v)} type="number" />
        <TextField label="Device Shipping/Mgmt" value={formData.deviceShippingmgmt} onChange={v => set('deviceShippingmgmt', v)} type="number" />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <TextField label="Total Artifacts" value={formData.totalArtifacts} onChange={v => set('totalArtifacts', v)} type="number" />
        <TextField label="Total Participants" value={formData.totalParticipants} onChange={v => set('totalParticipants', v)} type="number" />
      </SimpleGrid>

      <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wide" pt={2}>
        Links & References
      </Text>
      <LinkField label="Salesforce Link" urlValue={formData.sfUrl} labelValue={formData.sfLabel} onUrlChange={v => set('sfUrl', v)} onLabelChange={v => set('sfLabel', v)} />
      <LinkField label="Pricing Model" urlValue={formData.pmUrl} labelValue={formData.pmLabel} onUrlChange={v => set('pmUrl', v)} onLabelChange={v => set('pmLabel', v)} />
      <LinkField label="Google Folder" urlValue={formData.gfUrl} labelValue={formData.gfLabel} onUrlChange={v => set('gfUrl', v)} onLabelChange={v => set('gfLabel', v)} />
      <LinkField label="Submission Link" urlValue={formData.slUrl} labelValue={formData.slLabel} onUrlChange={v => set('slUrl', v)} onLabelChange={v => set('slLabel', v)} />

      <StatusSelect label="Internal Test" options={internalTestOpts} value={formData.internalTest} onChange={v => set('internalTest', v)} />
    </VStack>
  );
};

export default EditFormMoreTab;
