import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from '../BaseText';

export default function ErrorCodeProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'errorCode',
      label: 'Error Code',
      parameterKey: 'errorCode',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
