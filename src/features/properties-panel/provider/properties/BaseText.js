import {
  TextFieldEntry,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../../utils';

export default function BaseText(props) {
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

  return TextFieldEntry(options);
}
