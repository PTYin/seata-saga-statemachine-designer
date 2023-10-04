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

export function IoList(props) {
  const {
    element,
    type,
    label,
    parameterKey,
    entryProps,
  } = props;

  const id = `${element.id}-${type}-mapping`;

  const modeling = useService('modeling');
  let ioList = element.businessObject[parameterKey];
  if (ioList === undefined || ioList === null) {
    ioList = [];
    modeling.updateProperties(element, { [parameterKey]: ioList });
  }

  return ListEntry({
    element,
    autoFocusEntry: `[data-entry-id="${element.id}-collapsible-${type}-${ioList.length - 1}"] input`,
    id,
    label,
    parameterKey,
    entryProps,
    items: ioList,
    component: CollapsibleParameters,
    onAdd: () => {
      modeling.updateProperties(element, { [parameterKey]: [...ioList, { value: '' }] });
    },
    onRemove(item) {
      modeling.updateProperties(element, { [parameterKey]: ioList.filter((io) => io !== item) });
    },
  });
}
