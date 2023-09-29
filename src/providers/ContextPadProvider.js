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

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  function removeElement(e) {
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

    function appendStart(event, element) {
      const shape = elementFactory.createShape(assign({ type }, options));

      create.start(event, shape, {
        source: element,
        hints: {
          connectionTarget: element,
        },
      });
    }

    const append = autoPlace ? function (event, element) {
      const shape = elementFactory.createShape(assign({ type }, options));

      autoPlace.append(element, shape, {
        connectionTarget: element,
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

  function is() {
    return false;
  }
  function isAny() {
    return false;
  }

  if (is(businessObject, 'dmn:Decision')) {
    assign(actions, {
      'append.decision': appendAction('dmn:Decision', 'dmn-icon-decision'),
    });
  }

  if (
    isAny(businessObject, [
      'dmn:BusinessKnowledgeModel',
      'dmn:Decision',
      'dmn:KnowledgeSource',
    ])
  ) {
    assign(actions, {
      'append.knowledge-source': appendAction(
        'dmn:KnowledgeSource',
        'dmn-icon-knowledge-source',
      ),
    });
  }

  if (isAny(businessObject, [
    'dmn:BusinessKnowledgeModel',
    'dmn:Decision',
  ])) {
    assign(actions, {
      'append.business-knowledge-model': appendAction(
        'dmn:BusinessKnowledgeModel',
        'dmn-icon-business-knowledge',
      ),
    });
  }

  if (isAny(businessObject, ['dmn:Decision', 'dmn:KnowledgeSource'])) {
    assign(actions, {
      'append.input-data': appendAction('dmn:InputData', 'dmn-icon-input-data'),
    });
  }

  if (is(businessObject, 'dmn:DRGElement')) {
    assign(actions, {
      'append.text-annotation': appendAction(
        'dmn:TextAnnotation',
        'dmn-icon-text-annotation',
      ),

      connect: {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: 'Connect using Information/Knowledge'
          + '/Authority Requirement or Association',
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  if (is(businessObject, 'dmn:TextAnnotation')) {
    assign(actions, {
      connect: {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: 'Connect using association',
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
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
      className: 'context-pad-icon-connect',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect,
      },
    },
  });

  return actions;
};

// import {
//   assign,
// } from 'min-dash';
//
// import {
//   hasPrimaryModifier,
// } from 'diagram-js/lib/util/Mouse';
//
// /**
//  * A provider for DMN elements context pad
//  */
// export default function ContextPadProvider(
//   eventBus,
//   contextPad,
//   modeling,
//   elementFactory,
//   connect,
//   create,
//   canvas,
//   config,
//   injector,
// ) {
//   config = config || {};
//
//   contextPad.registerProvider(this);
//
//   this.contextPad = contextPad;
//   this.modeling = modeling;
//   this.elementFactory = elementFactory;
//   this.connect = connect;
//   this.canvas = canvas;
//
//   if (config.autoPlace !== false) {
//     this.autoPlace = injector.get('autoPlace', false);
//   }
//
//   eventBus.on('create.end', 250, (event) => {
//     const { shape } = event.context;
//
//     if (!hasPrimaryModifier(event)) {
//       return;
//     }
//
//     const entries = contextPad.getEntries(shape);
//
//     if (entries.replace) {
//       entries.replace.action.click(event, shape);
//     }
//   });
// }
//
// ContextPadProvider.$inject = [
//   'eventBus',
//   'contextPad',
//   'modeling',
//   'elementFactory',
//   'connect',
//   'create',
//   'canvas',
//   'config.contextPad',
//   'injector',
// ];
//
// ContextPadProvider.prototype.getContextPadEntries = function (element) {
//   const { modeling } = this;
//
//   const { elementFactory } = this;
//   const { connect } = this;
//   const { create } = this;
//   const { canvas } = this;
//   const { contextPad } = this;
//   const { autoPlace } = this;
//
//   const actions = {};
//
//   if (element.type === 'label') {
//     return actions;
//   }
//
//   function startConnect(event, autoActivate) {
//     connect.start(event, element, autoActivate);
//   }
//
//   function removeElement() {
//     modeling.removeElements([element]);
//   }
//
//   function getReplaceMenuPosition() {
//     const Y_OFFSET = 5;
//
//     const diagramContainer = canvas.getContainer();
//     const pad = contextPad.getPad(element).html;
//
//     const diagramRect = diagramContainer.getBoundingClientRect();
//     const padRect = pad.getBoundingClientRect();
//
//     const top = padRect.top - diagramRect.top;
//     const left = padRect.left - diagramRect.left;
//
//     const pos = {
//       x: left,
//       y: top + padRect.height + Y_OFFSET,
//     };
//
//     return pos;
//   }
//
//   /**
//    * Create an append action
//    *
//    * @param {string} type
//    * @param {string} className
//    * @param {string} [title]
//    * @param {Object} [options]
//    *
//    * @return {Object} descriptor
//    */
//   function appendAction(type, className, title, options) {
//     if (typeof title !== 'string') {
//       options = title;
//       title = translate('Append {type}', { type: type.replace(/^dmn:/, '') });
//     }
//
//     function appendStart(event) {
//       const shape = elementFactory.createShape(assign({ type }, options));
//
//       create.start(event, shape, {
//         source: element,
//         hints: {
//           connectionTarget: element,
//         },
//       });
//     }
//
//     const append = autoPlace ? function () {
//       const shape = elementFactory.createShape(assign({ type }, options));
//
//       autoPlace.append(element, shape, {
//         connectionTarget: element,
//       });
//     } : appendStart;
//
//     return {
//       group: 'model',
//       className,
//       title,
//       action: {
//         dragstart: appendStart,
//         click: append,
//       },
//     };
//   }
//
//   return {
//     delete: {
//       group: 'edit',
//       className: 'context-pad-icon-remove',
//       title: 'Remove',
//       action: {
//         click: removeElement,
//         dragstart: removeElement,
//       },
//     },
//     connect: {
//       group: 'edit',
//       className: 'context-pad-icon-connect',
//       title: 'Connect',
//       action: {
//         click: startConnect,
//         dragstart: startConnect,
//       },
//     },
//   };
// };
