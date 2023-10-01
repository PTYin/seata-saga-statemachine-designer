import { CollapsibleEntry, ListEntry, TextFieldEntry } from '@bpmn-io/properties-panel';

import { without } from 'min-dash';
import { useService } from '../../../../../utils';

function InputArgument(props) {
  const {
    index,
    element,
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');

  const inputList = element.businessObject.Input;

  function setValue(value) {
    inputList[index] = value;
    modeling.updateProperties(element, { Input: inputList });
  }

  const getValue = () => {
    return inputList[index];
  };

  return TextFieldEntry({
    element,
    id: `${element.id}-input-${index}`,
    label: `Argument ${index}`,
    getValue,
    setValue,
    debounce,
  });
}

function InputArgumentProps(props) {
  const {
    element,
    index,
  } = props;

  return [
    {
      id: `${element.id}-input-${index}`,
      component: InputArgument,
      element,
      index,
    },
  ];
}

function CollapsibleInputArgument(props) {
  const {
    element,
    index,
  } = props;

  return (
    <CollapsibleEntry
      id={`${element.id}-collapsible-input-${index}`}
      element={element}
      entries={InputArgumentProps({ element, index })}
      label={`Argument ${index}`}
    />
  );
}

function InputList(props) {
  const { element } = props;

  const id = `${element.id}-input`;

  const modeling = useService('modeling');
  const inputList = element?.businessObject?.Input || [];
  console.log('hello, world')

  return (
    <ListEntry
      element={element}
      autoFocusEntry={`[data-entry-id="${id}-extension-${inputList.length - 1}"] input`}
      id={id}
      label="Input"
      items={inputList}
      component={CollapsibleInputArgument}
      onAdd={() => {
        inputList.push('');
        modeling.updateProperties(element, { Input: inputList });
      }}
      onRemove={() => {}}
    />
  );
}

export default function InputProps(props) {
  const { element } = props;
  return [
    {
      element,
      label: 'Input',
      component: InputList,
    },
  ];
}
