import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from '../../BaseText';

export default function ServiceTypeProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'serviceType',
      label: 'Service Type',
      parameterKey: 'serviceType',
      description: 'Default: SpringBean',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
