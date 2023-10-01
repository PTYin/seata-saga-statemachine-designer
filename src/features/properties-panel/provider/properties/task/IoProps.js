import InputProps from './InputProps';
import OutputProps from './OutputProps';

export default function IoProps(props) {
  const { element } = props;

  return [
    {
      element,
      label: 'I/O Bindings',
      entries: [
        ...InputProps({ element }),
        ...OutputProps({ element }),
      ],
    },
  ];
}
