import { assign } from 'min-dash';

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

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type }, options));
      create.start(event, shape);
    }

    return {
      group,
      className,
      title,
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }

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
    'create-start': createAction('StartState', 'start', 'bpmn-icon-start-event-none', 'Create Start'),
    'create-service-task': createAction('ServiceTask', 'task', 'bpmn-icon-service-task', 'Create ServiceTask'),
    'create-success': createAction('Succeed', 'end', 'bpmn-icon-end-event-none', 'Create Succeed'),
    'create-fail': createAction('Fail', 'end', 'bpmn-icon-end-event-error', 'Create Fail'),
  };
};
