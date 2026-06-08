import { VStack, SimpleGrid } from '@chakra-ui/react';
import { StatusSelect, DropdownField, TextField } from './EditFormHelpers';

const companyOpts = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Amex', 'Dell', 'Citi', 'Bloomberg', 'Uber', 'Adobe', 'Walmart', 'Idemia', 'Channel', 'Tinder', 'Onfido', 'Intuit', 'Cipia', 'UG Labs', 'Bose', 'MicroBlink', 'Truiloo', 'Paradox', 'VisualVest', 'Square', 'Vodafone', 'Fime', 'Turnitin', 'Match', 'AIG', 'LIV', 'Legalfly', 'Quantified AI', 'Northern Trust', 'CSX', 'BBVA', 'Morgan Stanley', "L'Oreal", 'NFL', 'CVS', 'AT&T', 'Hyundai', 'Turo', 'BSL', 'Mixtiles', 'Better Car People', 'Penguin Random House', 'Rocket Lawyer', 'Udemy', 'Socure', 'RideCo', 'Natixis', 'Cognizant', 'Plustek', 'Fortune Brands', 'Realtor.Com', 'Prudential', 'Nationwide', 'Origin Wireless', 'Peloton', 'S-Communications', 'HolidayCheck', 'TiVo', 'Sparkasse', 'AuthID', 'Fiverr', 'IDFC', 'Ziphu', 'Bank Hapoalim', 'Accor', 'Swisscom', 'Deutsche', 'PRH', 'USAA', 'Ralph Lauren', 'Plus500', 'Monster', 'H&R Block', 'Data Force', 'Other (Please specify in comments)'];
const regionOpts = ['United States of America', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Israel', 'India', 'Japan', 'Brazil', 'China', 'South Korea', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Sweden', 'Ireland', 'Singapore', 'Global', 'EU'];
const salesTeamOpts = ['Enterprise', 'Strategic'];
const teamOpts = ['Entertainment', 'Meta', 'Red Teaming/GenAI', 'AI/ML', 'Devices', 'Functional', 'UX', 'A11Y', 'Payments', 'EU TS'];

const EditFormCompanyTab = ({ formData, onChange }) => {
  const set = (key, val) => onChange(key, val);
  return (
    <VStack gap={4} align="stretch" pt={4}>
      <DropdownField label="Company" options={companyOpts} value={formData.company} onChange={v => set('company', v)} helperText="Select from list or type custom values" />
      <DropdownField label="Region" options={regionOpts} value={formData.region} onChange={v => set('region', v)} />
      <SimpleGrid columns={2} gap={4}>
        <DropdownField label="Sales Team" options={salesTeamOpts} value={formData.salesTeam} onChange={v => set('salesTeam', v)} />
        <StatusSelect label="Team" options={teamOpts} value={formData.team} onChange={v => set('team', v)} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={4}>
        <TextField label="POC Email" value={formData.pocEmail} onChange={v => set('pocEmail', v)} type="email" placeholder="email@company.com" />
        <TextField label="POC Label" value={formData.pocLabel} onChange={v => set('pocLabel', v)} placeholder="Contact name" />
      </SimpleGrid>
    </VStack>
  );
};

export default EditFormCompanyTab;
