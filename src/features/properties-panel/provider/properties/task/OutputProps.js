import { ListEntry } from '@bpmn-io/properties-panel';

import { useService } from '../../../../../utils';
import { CollapsibleParameters, IoList, Parameter } from './IoBaseEntry';

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
      parameterKey: 'output',
      valueKey: 'key',
      label: 'Variable',
      component: Parameter,
    },
    {
      element,
      index,
      type: 'output',
      parameterKey: 'output',
      label: 'Expression',
      component: Parameter,
    },
  ];
}

export default function OutputProps(props) {
  const { element } = props;
  return [
    {
      element,
      type: 'output',
      parameterKey: 'output',
      label: 'Output Mapping',
      entryProps: OutputArgumentProps,
      component: IoList,
    },
  ];
}
