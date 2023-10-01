import {
  TextAreaEntry,
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../../utils';

function Comment(props) {
  const {
    element,
    id,
    label,
  } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const options = {
    element,
    id,
    label,
    debounce,
    getValue: (e) => {
      if (e.businessObject) {
        return e.businessObject[label];
      }
      return null;
    },
    setValue: (value) => {
      modeling.updateProperties(element, { [label]: value });
    },
  };

  return TextAreaEntry(options);
}

export default function CommentProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'comment',
      label: 'Comment',
      component: Comment,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
