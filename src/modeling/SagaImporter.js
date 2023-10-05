import {
  assign, forEach,
  map,
} from 'min-dash';

// helper /////
function elementData(semantic, attrs) {
  return assign({
    type: semantic.type,
    businessObject: semantic,
  }, attrs);
}

function collectWaypoints(edge) {
  const { waypoints } = edge;

  if (waypoints) {
    return map(waypoints, (waypoint) => {
      const position = { x: waypoint.x, y: waypoint.y };

      return assign({ original: position }, position);
    });
  }
  return null;
}

export default function SagaImporter(
  sagaFactory,
  eventBus,
  canvas,
  elementFactory,
  elementRegistry,
) {
  this.sagaFactory = sagaFactory;
  this.eventBus = eventBus;
  this.canvas = canvas;
  this.elementRegistry = elementRegistry;
  this.elementFactory = elementFactory;
}

SagaImporter.$inject = [
  'sagaFactory',
  'eventBus',
  'canvas',
  'elementFactory',
  'elementRegistry',
];

SagaImporter.prototype.import = function (definitions) {
  let error = [];
  const warnings = [];

  this.eventBus.fire('import.start', { definitions });

  try {
    const root = this.sagaFactory.create('StateMachine');
    root.importJson(definitions);
    this.root(root);

    // Add start state
    const start = this.sagaFactory.create('StartState');
    start.importJson(definitions);
    this.add(start);

    const edges = [];
    forEach(definitions.States, (semantic) => {
      const state = this.sagaFactory.create(semantic.Type);
      state.importJson(semantic);
      this.add(state);
      if (semantic.edge) {
        edges.push(...Object.values(semantic.edge));
      }
    });

    // Add start edge
    if (definitions.edge) {
      const startEdge = this.sagaFactory.create('Transition');
      startEdge.importJson(definitions.edge);
      this.add(startEdge, { source: start });
    }

    forEach(edges, (semantic) => {
      const transition = this.sagaFactory.create(semantic.type);
      transition.importJson(semantic);
      this.add(transition);
    });
  } catch (e) {
    error = e;
    console.error(error);
  }

  this.eventBus.fire('import.done', { error, warnings });
};

SagaImporter.prototype.root = function (semantic) {
  const element = this.elementFactory.createRoot(elementData(semantic));

  this.canvas.setRootElement(element);

  return element;
};

/**
 * Add drd element (semantic) to the canvas.
 */
SagaImporter.prototype.add = function (semantic, attrs = {}) {
  const { elementFactory } = this;
  const { canvas } = this;
  const { style } = semantic;

  let element; let waypoints; let source; let target; let elementDefinition; let
    bounds;

  if (style.type === 'Node') {
    bounds = style.bounds;

    elementDefinition = elementData(semantic, {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    });
    element = elementFactory.createShape(elementDefinition);

    canvas.addShape(element);
  } else if (style.type === 'Edge') {
    waypoints = collectWaypoints(style);

    source = this.getSource(semantic) || attrs.source;
    target = this.getTarget(semantic);
    semantic.style.source = source;
    semantic.style.target = target;

    if (source && target) {
      elementDefinition = elementData(semantic, {
        source,
        target,
        waypoints,
      });
      // console.log(elementDefinition);

      element = elementFactory.createConnection(elementDefinition);

      canvas.addConnection(element);
    }
  } else {
    throw new Error(`unknown di for element ${semantic.id}`);
  }

  return element;
};

SagaImporter.prototype.getSource = function (semantic) {
  return this.getShape(semantic.style.source);
};

SagaImporter.prototype.getTarget = function (semantic) {
  return this.getShape(semantic.style.target);
};

SagaImporter.prototype.getShape = function (name) {
  return this.elementRegistry.find((element) => element.businessObject.name === name);
};
