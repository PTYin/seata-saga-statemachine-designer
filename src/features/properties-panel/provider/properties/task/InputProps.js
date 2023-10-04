import { ListEntry } from '@bpmn-io/properties-panel';

import { useService } from '../../../../../utils';
import { CollapsibleParameters, IoList, Parameter } from './IoBaseEntry';

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
      parameterKey: 'input',
      label: 'Expression',
      component: Parameter,
    },
  ];
}

export default function InputProps(props) {
  const { element } = props;
  return [
    {
      element,
      type: 'input',
      parameterKey: 'input',
      label: 'Input Mapping',
      entryProps: InputArgumentProps,
      component: IoList,
    },
  ];
}
