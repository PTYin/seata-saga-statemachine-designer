import { ListEntry } from '@bpmn-io/properties-panel';

import { useService } from '../../../../../utils';
import { CollapsibleParameters, Parameter } from './IoBaseEntry';

function OutputArgumentProps(props) {
  const {
    element,
    index,
  } = props;
  return [
    {
      element,
      index,
      type: 'output',
      parameterKey: 'Output',
      valueKey: 'key',
      label: 'Variable',
      component: Parameter,
    },
    {
      element,
      index,
      type: 'output',
      parameterKey: 'Output',
      label: 'Expression',
      component: Parameter,
    },
  ];
}

function OutputList(props) {
  const { element } = props;

  const id = `${element.id}-output-mapping`;

  const modeling = useService('modeling');
  let outputList = element?.businessObject?.Output;
  if (outputList === undefined || outputList === null) {
    outputList = [];
    modeling.updateProperties(element, { Output: outputList });
  }

  return ListEntry({
    element,
    autoFocusEntry: `[data-entry-id="${element.id}-collapsible-output-${outputList.length - 1}"] input`,
    id,
    label: 'Output Mapping',
    items: outputList,
    type: 'output',
    labelKey: 'key',
    parameterKey: 'Output',
    entryProps: OutputArgumentProps,
    component: CollapsibleParameters,
    onAdd: () => {
      modeling.updateProperties(element, { Output: [...outputList, { key: '', value: '' }] });
    },
    onRemove(item) {
      modeling.updateProperties(element, { Output: outputList.filter((input) => input !== item) });
    },
  });
}

export default function OutputProps(props) {
  const { element } = props;
  return [
    {
      element,
      component: OutputList,
    },
  ];
}
