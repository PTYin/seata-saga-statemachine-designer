import {
  TextAreaEntry,
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../../utils';

function Comment(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const options = {
    element,
    id: 'comment',
    label: 'Comment',
    debounce,
    getValue: (e) => {
      if (e.businessObject) {
        return e.businessObject.comment;
      }
      return null;
    },
    setValue: (value) => {
      modeling.updateProperties(element, { comment: value });
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
      component: Comment,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
