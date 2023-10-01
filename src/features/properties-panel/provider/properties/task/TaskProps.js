import InputProps from './InputProps';

export default function TaskProps(props) {
  const { element } = props;

  return [
    {
      label: 'Input',
      entries: [...InputProps({ element })],
      element,
    },
  ];
}
