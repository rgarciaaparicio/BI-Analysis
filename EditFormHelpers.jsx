import { Field, Input, Select, SimpleGrid, Textarea, Portal, createListCollection } from '@chakra-ui/react';

export const StatusSelect = ({ label, options, value, onChange }) => {
  const collection = createListCollection({
    items: options.map(o => ({ label: o, value: o }))
  });
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="600">{label}</Field.Label>
      <Select.Root collection={collection} value={value ? [value] : []} onValueChange={e => onChange(e.value[0] || '')}>
        <Select.HiddenSelect />
        <Select.Trigger>
          <Select.ValueText placeholder={`Select ${label.toLowerCase()}`} />
        </Select.Trigger>
        <Portal>
          <Select.Positioner>
            <Select.Content zIndex="popover">
              {options.map(o => (
                <Select.Item key={o} item={{ label: o, value: o }}>{o}</Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  );
};

export const DropdownField = ({ label, options, value, onChange, helperText }) => {
  const collection = createListCollection({
    items: options.map(o => ({ label: o, value: o }))
  });
  const currentValues = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="600">{label}</Field.Label>
      <Select.Root collection={collection} multiple value={currentValues}
        onValueChange={e => onChange(e.value.join(', '))}>
        <Select.HiddenSelect />
        <Select.Trigger>
          <Select.ValueText placeholder={`Select ${label.toLowerCase()}`} />
        </Select.Trigger>
        <Portal>
          <Select.Positioner>
            <Select.Content zIndex="popover">
              {options.map(o => (
                <Select.Item key={o} item={{ label: o, value: o }}>
                  {o}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  );
};

export const TextField = ({ label, value, onChange, type = 'text', placeholder, rows }) => (
  <Field.Root>
    <Field.Label fontSize="sm" fontWeight="600">{label}</Field.Label>
    {rows ? (
      <Textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    ) : (
      <Input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </Field.Root>
);

export const LinkField = ({ label, urlValue, labelValue, onUrlChange, onLabelChange }) => (
  <Field.Root>
    <Field.Label fontSize="sm" fontWeight="600">{label}</Field.Label>
    <SimpleGrid columns={2} gap={2}>
      <Input value={urlValue || ''} onChange={e => onUrlChange(e.target.value)} placeholder="URL" />
      <Input value={labelValue || ''} onChange={e => onLabelChange(e.target.value)} placeholder="Label" />
    </SimpleGrid>
  </Field.Root>
);
