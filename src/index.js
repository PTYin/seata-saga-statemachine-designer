import Editor from './Editor';

// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const editor = new Editor({
  container: document.querySelector('#canvas'),
  keyboard: { bindTo: document },
  propertiesPanel: { parent: '#properties' },
});
editor.get('eventBus').on('selection.changed', (e) => {
  console.log(e.newSelection[0]);
});
