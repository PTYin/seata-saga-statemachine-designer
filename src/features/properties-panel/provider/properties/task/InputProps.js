import { ListEntry } from '@bpmn-io/properties-panel';

import { useService } from '../../../../../utils';
import { CollapsibleParameters, Parameter } from './IoBaseEntry';

function InputArgumentProps(props) {
  const {
    element,
    index,
  } = props;
  return [
    {
      element,
      index,
      type: 'input',
      parameterKey: 'Input',
      label: 'Expression',
      component: Parameter,
    },
  ];
}

function InputList(props) {
  const { element } = props;

  const id = `${element.id}-input-mapping`;

  const modeling = useService('modeling');
  let inputList = element?.businessObject?.Input;
  if (inputList === undefined || inputList === null) {
    inputList = [];
    modeling.updateProperties(element, { Input: inputList });
  }

  return ListEntry({
    element,
    autoFocusEntry: `[data-entry-id="${element.id}-collapsible-input-${inputList.length - 1}"] input`,
    id,
    label: 'Input Mapping',
    items: inputList,
    type: 'input',
    parameterKey: 'Input',
    entryProps: InputArgumentProps,
    component: CollapsibleParameters,
    onAdd: () => {
      modeling.updateProperties(element, { Input: [...inputList, { value: '' }] });
    },
    onRemove(item) {
      modeling.updateProperties(element, { Input: inputList.filter((input) => input !== item) });
    },
  });
}

export default function InputProps(props) {
  const { element } = props;
  return [
    {
      element,
      component: InputList,
    },
  ];
}
