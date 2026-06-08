import { useState } from 'react';
import { Dialog, Portal, Tabs, HStack, Button, CloseButton, Alert, Spinner } from '@chakra-ui/react';
import { Plus, X } from 'lucide-react';
import BoardSDK from '@api/BoardSDK';
import EditFormBasicTab from './EditFormBasicTab';
import EditFormCompanyTab from './EditFormCompanyTab';
import EditFormDetailsTab from './EditFormDetailsTab';
import EditFormMoreTab from './EditFormMoreTab';

const board = new BoardSDK();

const emptyForm = () => ({
  name: '', status: '', conversionChance: '', dateAdded: '', dealAmount: '',
  engagementDescription: '', taskDescription: '', company: '', region: '',
  salesTeam: '', team: '', complexity: '', type: '', transactionType: '',
  deliveryComplexity: '', recruitmentEffort: '', forecastCategory: '',
  deviceShipment: '', engineeringTeamSupport: '', pocEmail: '', pocLabel: '',
  dealType: '', aiType: '', annotationType: '', target: '', multiSelect: '',
  opportunityType: '', updatedStatus: '', internalTest: '', latestUpdate: '',
  comments: '', demographics: '', purchaseOrder: '', pricedMargins: '',
  deliveredMargins: '', count: '', pricePerArtifact: '', pricePerParticipant: '',
  timetaskMins: '', payoutFlatRate: '', payoutHigh: '', payoutMedium: '',
  payoutLow: '', qaRequired: '', projectSetupstartup: '', trainingSetup: '',
  onboarding: '', participantSupport: '', automation: '', manualQa: '',
  annotation: '', dataProgramManagementReportingInternalComms: '',
  deviceShippingmgmt: '', totalArtifacts: '', totalParticipants: '',
  lastUpdatedOn: '', timelineFrom: '', timelineTo: '',
  sfUrl: '', sfLabel: '', pmUrl: '', pmLabel: '',
  gfUrl: '', gfLabel: '', slUrl: '', slLabel: '',
});

const toArr = (v) => v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
const toNum = (v) => v ? parseFloat(v) : null;
const toLink = (url, label) => url ? { url, label: label || url } : null;

const AddOpportunityDialog = ({ open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleOpen = (isOpen) => {
    if (isOpen) setFormData(emptyForm());
    setError(null);
    onOpenChange(isOpen);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) { setError('Deal name is required.'); return; }
    setLoading(true); setError(null);
    try {
      const d = formData;
      const createData = { name: d.name };
      if (d.status) createData.status = d.status;
      if (d.conversionChance) createData.conversionChance = d.conversionChance;
      if (d.dateAdded) createData.dateAdded = new Date(d.dateAdded);
      if (d.dealAmount) createData.dealAmount = toNum(d.dealAmount);
      if (d.engagementDescription) createData.engagementDescription = d.engagementDescription;
      if (d.taskDescription) createData.taskDescription = d.taskDescription;
      if (d.company) createData.company = toArr(d.company);
      if (d.region) createData.region = toArr(d.region);
      if (d.salesTeam) createData.salesTeam = toArr(d.salesTeam);
      if (d.team) createData.team = d.team;
      if (d.complexity) createData.complexity = d.complexity;
      if (d.type) createData.type = d.type;
      if (d.transactionType) createData.transactionType = d.transactionType;
      if (d.deliveryComplexity) createData.deliveryComplexity = d.deliveryComplexity;
      if (d.recruitmentEffort) createData.recruitmentEffort = d.recruitmentEffort;
      if (d.forecastCategory) createData.forecastCategory = d.forecastCategory;
      if (d.deviceShipment) createData.deviceShipment = d.deviceShipment;
      if (d.engineeringTeamSupport) createData.engineeringTeamSupport = d.engineeringTeamSupport;
      if (d.pocEmail) createData.poc = { email: d.pocEmail, label: d.pocLabel || d.pocEmail };
      if (d.dealType) createData.dealType = toArr(d.dealType);
      if (d.aiType) createData.aiType = toArr(d.aiType);
      if (d.annotationType) createData.annotationType = toArr(d.annotationType);
      if (d.target) createData.target = toArr(d.target);
      if (d.multiSelect) createData.multiSelect = toArr(d.multiSelect);
      if (d.opportunityType) createData.opportunityType = d.opportunityType;
      if (d.updatedStatus) createData.updatedStatus = d.updatedStatus;
      if (d.internalTest) createData.internalTest = d.internalTest;
      if (d.latestUpdate) createData.latestUpdate = d.latestUpdate;
      if (d.comments) createData.comments = d.comments;
      if (d.demographics) createData.demographics = d.demographics;
      if (d.purchaseOrder) createData.purchaseOrder = d.purchaseOrder;
      if (d.pricedMargins) createData.pricedMargins = toNum(d.pricedMargins);
      if (d.deliveredMargins) createData.deliveredMargins = toNum(d.deliveredMargins);
      if (d.count) createData.count = toNum(d.count);
      await board.item().create(createData).inGroup('new_group65011').execute();
      onSave?.(); handleOpen(false);
    } catch (err) {
      console.error('Failed to create opportunity:', err);
      setError('Failed to create opportunity. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => handleOpen(o)} size="xl">
      <Portal><Dialog.Backdrop /><Dialog.Positioner>
        <Dialog.Content maxH="90vh" overflowY="auto">
          <Dialog.Header><Dialog.Title>Add New Opportunity</Dialog.Title>
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
            <Button variant="outline" onClick={() => handleOpen(false)} disabled={loading}><X size={16} /> Cancel</Button>
            <Button colorPalette="green" onClick={handleSave} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <Plus size={16} />} Create Opportunity
            </Button>
          </HStack></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner></Portal>
    </Dialog.Root>
  );
};

export default AddOpportunityDialog;
