import { CollapsibleEntry, ListEntry, TextFieldEntry } from '@bpmn-io/properties-panel';

import { useService } from '../../../../../utils';

export function Parameter(props) {
  const {
    index,
    type,
    parameterKey,
    valueKey = 'value',
    label,
    element,
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');
  const item = element.businessObject[parameterKey][index];

  function setValue(value) {
    modeling.updateCompositeProperties(element, item, { [valueKey]: value });
  }

  function getValue(e) {
    return e[valueKey];
  }

  return TextFieldEntry({
    element: item,
    id: `${element.id}-${type}-${index}`,
    label,
    debounce,
    getValue,
    setValue,
  });
}

export function CollapsibleParameters(props) {
  const {
    element,
    index,
    type,
    labelKey = 'value',
    parameterKey,
    entryProps,
    open,
  } = props;

  const ioList = element.businessObject[parameterKey];

  return CollapsibleEntry({
    id: `${element.id}-collapsible-${type}-${index}`,
    label: ioList[index][labelKey],
    element,
    entries: entryProps({ element, index }),
    open,
  });
}

export function List(props) {
  const { element, type, label } = props;

  const id = `${element.id}-${type}-mapping`;

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
    label,
    items: inputList,
    component: CollapsibleParameters,
    onAdd: () => {
      modeling.updateProperties(element, { Input: [...inputList, { value: '' }] });
    },
    onRemove(item) {
      modeling.updateProperties(element, { Input: inputList.filter((input) => input !== item) });
    },
  });
}
