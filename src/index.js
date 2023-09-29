import Editor from './Editor';

// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const editor = new Editor({
  container: document.querySelector('#root'),
  keyboard: { bindTo: document },
});
editor.get('eventBus').on('selection.changed', (e) => {
  console.log(e.newSelection[0]);
});
