import { domify } from 'min-dom';
import ImportControl from './ImportControl';
import ExportControl from './ExportControl';

export default function IoControl(canvas, sagaExporter) {
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
    exportJsonButton.addEventListener('click', () => sagaExporter.export());
  }
}

IoControl.$inject = ['canvas', 'sagaExporter'];
