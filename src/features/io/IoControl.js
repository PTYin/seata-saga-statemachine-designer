import { domify } from 'min-dom';
import ImportControl from './ImportControl';
import ExportControl from './ExportControl';

export default function IoControl(canvas, sagaExporter, commandStack) {
  const container = domify(`
  <div style="position: fixed; bottom: 10px; left: 20px">
  ${ImportControl}
  ${ExportControl}
  </div>;
  `);

  // eslint-disable-next-line no-underscore-dangle
  canvas._container.appendChild(container);

  if (sagaExporter) {
    const exportJsonButton = document.getElementById('export-json');
    const exportSvgButton = document.getElementById('export-svg');
    exportJsonButton.addEventListener('click', () => sagaExporter.export());
    exportSvgButton.addEventListener('click', () => console.log('commandStack', commandStack._stack && commandStack._stack.slice(0, commandStack._stackIdx)));
  }
}

IoControl.$inject = ['canvas', 'sagaExporter', 'commandStack'];
