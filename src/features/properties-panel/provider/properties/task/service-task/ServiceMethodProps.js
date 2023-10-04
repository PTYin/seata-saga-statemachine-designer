import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from '../../BaseText';

export default function ServiceMethodProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'serviceMethod',
      label: 'Service Method',
      parameterKey: 'serviceMethod',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
