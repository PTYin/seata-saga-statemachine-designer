/**
 * A example palette provider.
 */
export default function PaletteProvider(create, elementFactory, lassoTool, palette) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.lassoTool = lassoTool;
  this.palette = palette;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'create',
  'elementFactory',
  'lassoTool',
  'palette',
];

PaletteProvider.prototype.getPaletteEntries = function () {
  const { create } = this;
  const { elementFactory } = this;
  const { lassoTool } = this;

  return {
    'lasso-tool': {
      group: 'tools',
      className: 'palette-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click(event) {
          lassoTool.activateSelection(event);
        },
      },
    },
    'tool-separator': {
      group: 'tools',
      separator: true,
    },
    'create-shape': {
      group: 'create',
      className: 'palette-icon-create-shape',
      title: 'Create ServiceTask',
      action: {
        click(event) {
          const shape = elementFactory.createShape({
            width: 100,
            height: 80,
          });

          create.start(event, shape);
        },
      },
    },
    'create-frame': {
      group: 'create',
      className: 'palette-icon-create-frame',
      title: 'Create Frame',
      action: {
        click(event) {
          const shape = elementFactory.createShape({
            width: 300,
            height: 200,
            isFrame: true,
          });

          create.start(event, shape);
        },
      },
    },
  };
};
