import { useState, useEffect } from 'react';
import { Dialog, Portal, Tabs, HStack, Button, CloseButton, Alert, Spinner } from '@chakra-ui/react';
import { Save, X } from 'lucide-react';
import BoardSDK from '@api/BoardSDK';
import EditFormBasicTab from './EditFormBasicTab';
import EditFormCompanyTab from './EditFormCompanyTab';
import EditFormDetailsTab from './EditFormDetailsTab';
import EditFormMoreTab from './EditFormMoreTab';

const board = new BoardSDK();

const initFormData = (opp) => ({
  name: opp.name || '', status: opp.status || '', conversionChance: opp.conversionChance || '',
  dateAdded: opp.dateAdded ? new Date(opp.dateAdded).toISOString().split('T')[0] : '',
  dealAmount: opp.dealAmount || '', engagementDescription: opp.engagementDescription || '',
  taskDescription: opp.taskDescription || '', company: opp.company?.join(', ') || '',
  region: opp.region?.join(', ') || '', salesTeam: opp.salesTeam?.join(', ') || '',
  team: opp.team || '', complexity: opp.complexity || '', type: opp.type || '',
  transactionType: opp.transactionType || '', deliveryComplexity: opp.deliveryComplexity || '',
  recruitmentEffort: opp.recruitmentEffort || '', forecastCategory: opp.forecastCategory || '',
  deviceShipment: opp.deviceShipment || '', engineeringTeamSupport: opp.engineeringTeamSupport || '',
  pocEmail: opp.poc?.email || '', pocLabel: opp.poc?.label || '',
  dealType: opp.dealType?.join(', ') || '', aiType: opp.aiType?.join(', ') || '',
  annotationType: opp.annotationType?.join(', ') || '', target: opp.target?.join(', ') || '',
  multiSelect: opp.multiSelect?.join(', ') || '', opportunityType: opp.opportunityType || '',
  updatedStatus: opp.updatedStatus || '', internalTest: opp.internalTest || '',
  latestUpdate: opp.latestUpdate || '', comments: opp.comments || '',
  demographics: opp.demographics || '', purchaseOrder: opp.purchaseOrder || '',
  pricedMargins: opp.pricedMargins || '', deliveredMargins: opp.deliveredMargins || '',
  count: opp.count || '', pricePerArtifact: opp.pricePerArtifact || '',
  pricePerParticipant: opp.pricePerParticipant || '', timetaskMins: opp.timetaskMins || '',
  payoutFlatRate: opp.payoutFlatRate || '', payoutHigh: opp.payoutHigh || '',
  payoutMedium: opp.payoutMedium || '', payoutLow: opp.payoutLow || '',
  qaRequired: opp.qaRequired || '', projectSetupstartup: opp.projectSetupstartup || '',
  trainingSetup: opp.trainingSetup || '', onboarding: opp.onboarding || '',
  participantSupport: opp.participantSupport || '', automation: opp.automation || '',
  manualQa: opp.manualQa || '', annotation: opp.annotation || '',
  dataProgramManagementReportingInternalComms: opp.dataProgramManagementReportingInternalComms || '',
  deviceShippingmgmt: opp.deviceShippingmgmt || '', totalArtifacts: opp.totalArtifacts || '',
  totalParticipants: opp.totalParticipants || '', lastUpdatedOn: opp.lastUpdatedOn ? new Date(opp.lastUpdatedOn).toISOString().split('T')[0] : '',
  timelineFrom: opp.timeline?.from || '', timelineTo: opp.timeline?.to || '',
  sfUrl: opp.salesForceLink?.url || '', sfLabel: opp.salesForceLink?.label || '',
  pmUrl: opp.pricingModel?.url || '', pmLabel: opp.pricingModel?.label || '',
  gfUrl: opp.linkToGoogleFolder?.url || '', gfLabel: opp.linkToGoogleFolder?.label || '',
  slUrl: opp.submissionLink?.url || '', slLabel: opp.submissionLink?.label || '',
});

const toArr = (v) => v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
const toNum = (v) => v ? parseFloat(v) : null;
const toLink = (url, label) => url ? { url, label: label || url } : null;

const EditOpportunityDialog = ({ open, onOpenChange, opportunity, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (opportunity) setFormData(initFormData(opportunity)); }, [opportunity]);

  const handleChange = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setLoading(true); setError(null);
    const prevData = { ...formData };
    try {
      const d = formData;
      const updateData = {
        name: d.name, status: d.status || null, conversionChance: d.conversionChance || null,
        dateAdded: d.dateAdded ? new Date(d.dateAdded) : null, dealAmount: toNum(d.dealAmount),
        engagementDescription: d.engagementDescription || null, taskDescription: d.taskDescription || null,
        company: toArr(d.company), region: toArr(d.region), salesTeam: toArr(d.salesTeam),
        team: d.team || null, complexity: d.complexity || null, type: d.type || null,
        transactionType: d.transactionType || null, deliveryComplexity: d.deliveryComplexity || null,
        recruitmentEffort: d.recruitmentEffort || null, forecastCategory: d.forecastCategory || null,
        deviceShipment: d.deviceShipment || null, engineeringTeamSupport: d.engineeringTeamSupport || null,
        poc: d.pocEmail ? { email: d.pocEmail, label: d.pocLabel || d.pocEmail } : null,
        dealType: toArr(d.dealType), aiType: toArr(d.aiType), annotationType: toArr(d.annotationType),
        target: toArr(d.target), multiSelect: toArr(d.multiSelect),
        opportunityType: d.opportunityType || null, updatedStatus: d.updatedStatus || null,
        internalTest: d.internalTest || null, latestUpdate: d.latestUpdate || null,
        comments: d.comments || null, demographics: d.demographics || null,
        purchaseOrder: d.purchaseOrder || null, pricedMargins: toNum(d.pricedMargins),
        deliveredMargins: toNum(d.deliveredMargins), count: toNum(d.count),
        pricePerArtifact: toNum(d.pricePerArtifact), pricePerParticipant: toNum(d.pricePerParticipant),
        timetaskMins: toNum(d.timetaskMins), payoutFlatRate: toNum(d.payoutFlatRate),
        payoutHigh: toNum(d.payoutHigh), payoutMedium: toNum(d.payoutMedium),
        payoutLow: toNum(d.payoutLow), qaRequired: toNum(d.qaRequired),
        projectSetupstartup: toNum(d.projectSetupstartup), trainingSetup: toNum(d.trainingSetup),
        onboarding: toNum(d.onboarding), participantSupport: toNum(d.participantSupport),
        automation: toNum(d.automation), manualQa: toNum(d.manualQa), annotation: toNum(d.annotation),
        dataProgramManagementReportingInternalComms: toNum(d.dataProgramManagementReportingInternalComms),
        deviceShippingmgmt: toNum(d.deviceShippingmgmt), totalArtifacts: toNum(d.totalArtifacts),
        totalParticipants: toNum(d.totalParticipants),
        lastUpdatedOn: d.lastUpdatedOn ? new Date(d.lastUpdatedOn) : null,
        timeline: d.timelineFrom && d.timelineTo ? { from: d.timelineFrom, to: d.timelineTo } : null,
        salesForceLink: toLink(d.sfUrl, d.sfLabel), pricingModel: toLink(d.pmUrl, d.pmLabel),
        linkToGoogleFolder: toLink(d.gfUrl, d.gfLabel), submissionLink: toLink(d.slUrl, d.slLabel),
      };
      await board.item(opportunity.id).update(updateData).execute();
      onSave?.(); onOpenChange(false);
    } catch (err) {
      console.error('Failed to update opportunity:', err);
      setFormData(prevData); setError('Failed to save changes. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => onOpenChange(o)} size="xl">
      <Portal><Dialog.Backdrop /><Dialog.Positioner>
        <Dialog.Content maxH="90vh" overflowY="auto">
          <Dialog.Header><Dialog.Title>Edit Opportunity</Dialog.Title>
            <Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            {error && <Alert.Root colorPalette="red" mb={4}><Alert.Title>{error}</Alert.Title></Alert.Root>}
            <Tabs.Root defaultValue="basic">
              <Tabs.List><Tabs.Trigger value="basic">Basic</Tabs.Trigger>
                <Tabs.Trigger value="company">Company & Team</Tabs.Trigger>
                <Tabs.Trigger value="details">Deal Details</Tabs.Trigger>
                <Tabs.Trigger value="more">More</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="basic"><EditFormBasicTab formData={formData} onChange={handleChange} /></Tabs.Content>
              <Tabs.Content value="company"><EditFormCompanyTab formData={formData} onChange={handleChange} /></Tabs.Content>
              <Tabs.Content value="details"><EditFormDetailsTab formData={formData} onChange={handleChange} /></Tabs.Content>
              <Tabs.Content value="more"><EditFormMoreTab formData={formData} onChange={handleChange} /></Tabs.Content>
            </Tabs.Root>
          </Dialog.Body>
          <Dialog.Footer><HStack gap={2}>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}><X size={16} /> Cancel</Button>
            <Button colorPalette="blue" onClick={handleSave} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <Save size={16} />} Save Changes
            </Button>
          </HStack></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner></Portal>
    </Dialog.Root>
  );
};

export default EditOpportunityDialog;
