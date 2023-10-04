import { domify } from 'min-dom';
import ImportControl from './ImportControl';
import ExportControl from './ExportControl';

export default function IoControl(canvas, sagaImporter, sagaExporter, commandStack) {
  const container = domify(`
  <div style="position: fixed; bottom: 10px; left: 20px">
  ${ImportControl}
  ${ExportControl}
  </div>;
  `);

  // eslint-disable-next-line no-underscore-dangle
  canvas._container.appendChild(container);

  if (sagaImporter) {
    const openFileButton = document.getElementById('open-file');
    const importJsonButton = document.getElementById('import-json');
    openFileButton.addEventListener('change', (e) => {
      const localFile = e.target.files[0];
      if (localFile) {
        const reader = new FileReader();
        let data = '';
        reader.readAsText(localFile);
        reader.onload = (event) => {
          data = event.target.result;
          console.log('import', data);
          // sagaImporter.import(data);
        };
      }
    });
    importJsonButton.addEventListener('click', () => {
      openFileButton.click();
    });
  }

  function download(data) {
    const a = document.createElement('a');

    a.setAttribute(
      'href',
      `data:text/json;charset=UTF-8,${encodeURIComponent(JSON.stringify(data))}`,
    );
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', 'diagram:download-json');
    a.setAttribute('download', 'export.json');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (sagaExporter) {
    const exportJsonButton = document.getElementById('export-json');
    const exportSvgButton = document.getElementById('export-svg');
    exportJsonButton.addEventListener('click', () => download(sagaExporter.export()));
    exportSvgButton.addEventListener('click', () => console.log('commandStack', commandStack._stack && commandStack._stack.slice(0, commandStack._stackIdx)));
  }
}

IoControl.$inject = ['canvas', 'sagaImporter', 'sagaExporter', 'commandStack'];
