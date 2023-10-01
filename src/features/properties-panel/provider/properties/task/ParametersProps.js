import InputList from './InputProps';
import InputProps from './InputProps';

export default function ParametersProps({ element, injector }) {
  const inputList = element.businessObject.Input;

  const items = inputList.map((parameter, index) => {
    const id = `${element.id}-parameter-${index}`;

    return {
      id,
      label: 'Input',
      entries: InputProps({ element }),
      autoFocusEntry: `${id}-name`,
    };
  });

  return {
    items,
  };
}
