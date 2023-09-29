import ExampleContextPadProvider from './ContextPadProvider';
import PaletteProvider from './PaletteProvider';

export default {
  __init__: [
    'contextPadProvider',
    'paletteProvider',
  ],
  contextPadProvider: ['type', ExampleContextPadProvider],
  paletteProvider: ['type', PaletteProvider],
};
