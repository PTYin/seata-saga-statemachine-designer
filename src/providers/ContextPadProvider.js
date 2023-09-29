import {
  assign,
} from 'min-dash';

import {
  hasPrimaryModifier,
} from 'diagram-js/lib/util/Mouse';

/**
 * A provider for DMN elements context pad
 */
export default function ContextPadProvider(
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  canvas,
  config,
  injector,
) {
  config = config || {};

  contextPad.registerProvider(this);

  this.contextPad = contextPad;
  this.modeling = modeling;
  this.elementFactory = elementFactory;
  this.connect = connect;
  this.canvas = canvas;

  if (config.autoPlace !== false) {
    this.autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, (event) => {
    const { shape } = event.context;

    if (!hasPrimaryModifier(event)) {
      return;
    }

    const entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'canvas',
  'config.contextPad',
  'injector',
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const { modeling } = this;

  const { elementFactory } = this;
  const { connect } = this;
  const { create } = this;
  // const { canvas } = this;
  // const { contextPad } = this;
  const { autoPlace } = this;

  const actions = {};

  if (element.type === 'label') {
    return actions;
  }

  const { businessObject } = element;

  // eslint-disable-next-line no-shadow
  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  function removeElement() {
    modeling.removeElements([element]);
  }

  // function getReplaceMenuPosition(element) {
  //   const Y_OFFSET = 5;
  //
  //   const diagramContainer = canvas.getContainer();
  //   const pad = contextPad.getPad(element).html;
  //
  //   const diagramRect = diagramContainer.getBoundingClientRect();
  //   const padRect = pad.getBoundingClientRect();
  //
  //   const top = padRect.top - diagramRect.top;
  //   const left = padRect.left - diagramRect.left;
  //
  //   const pos = {
  //     x: left,
  //     y: top + padRect.height + Y_OFFSET,
  //   };
  //
  //   return pos;
  // }

  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    if (typeof title !== 'string') {
      options = title;
      title = `Append ${type}`;
    }

    function appendStart(event, e) {
      const shape = elementFactory.createShape(assign({ type }, options));

      create.start(event, shape, {
        source: e,
        hints: {
          connectionTarget: e,
        },
      });
    }

    const append = autoPlace ? function (event, e) {
      const shape = elementFactory.createShape(assign({ type }, options));

      autoPlace.append(e, shape, {
        connectionTarget: e,
      });
    } : appendStart;

    return {
      group: 'model',
      className,
      title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  //
  // if (!popupMenu.isEmpty(element, 'dmn-replace')) {
  //   // Replace menu entry
  //   assign(actions, {
  //     replace: {
  //       group: 'edit',
  //       className: 'dmn-icon-screw-wrench',
  //       title: translate('Change type'),
  //       action: {
  //         click(event, element) {
  //           const position = assign(getReplaceMenuPosition(element), {
  //             cursor: { x: event.x, y: event.y },
  //           });
  //
  //           popupMenu.open(element, 'dmn-replace', position);
  //         },
  //       },
  //     },
  //   });
  // }

  assign(actions, {
    delete: {
      group: 'edit',
      className: 'context-pad-icon-remove',
      title: 'Remove',
      action: {
        click: removeElement,
      },
    },
  });

  assign(actions, {
    connect: {
      group: 'edit',
      className: 'bpmn-icon-connection-multi',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect,
      },
    },
  });

  return actions;
};
