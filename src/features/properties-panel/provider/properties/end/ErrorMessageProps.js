import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from '../BaseText';

export default function ErrorMessageProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'errorMessage',
      label: 'Error Message',
      parameterKey: 'message',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
