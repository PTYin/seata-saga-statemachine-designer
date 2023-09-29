import LayoutConnectionBehavior from './LayoutConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';

export default {
  __init__: [
    'layoutConnectionBehavior',
    'replaceConnectionBehavior',
  ],
  layoutConnectionBehavior: ['type', LayoutConnectionBehavior],
  replaceConnectionBehavior: ['type', ReplaceConnectionBehavior],
};
