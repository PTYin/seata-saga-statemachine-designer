import {
  TextFieldEntry,
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../../utils';

function Name(props) {
  const {
    element,
    id,
  } = props;

  const debounce = useService('debounceInput');

  // (1) default: name
  const options = {
    element,
    id,
    label: 'Name',
    debounce,
    getValue: (e) => {
      console.log(e)
      return e?.businessObject?.Name;
    },
    setValue: (value) => {
      element.businessObject.Name = value;
    },
  };

  return TextFieldEntry(options);
}

/**
 * @typedef { import('@bpmn-io/properties-panel').EntryDefinition } Entry
 */

/**
 * @returns {Array<Entry>} entries
 */
export default function NameProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'name',
      component: Name,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
