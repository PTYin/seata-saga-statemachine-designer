import PropertiesPanel from './features/properties-panel';
import PropertiesProvider from './features/properties-panel/provider';
import Editor from './Editor';
import control from './control';

// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const editor = new Editor({
  container: document.querySelector('#canvas'),
  keyboard: { bindTo: document },
  propertiesPanel: { parent: '#properties' },
  additionalModules: [
    PropertiesPanel,
    PropertiesProvider,
  ],
});

control(editor);

editor.get('eventBus').on('selection.changed', (e) => {
  console.log(e.newSelection[0] || editor.get('canvas').getRootElement());
});
