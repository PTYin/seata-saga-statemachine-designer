import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from '../../BaseText';

export default function ServiceNameProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'serviceName',
      label: 'Service Name',
      parameterKey: 'serviceName',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
