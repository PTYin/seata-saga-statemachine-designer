import {
  assign, forEach,
  map,
} from 'min-dash';

// helper /////
function elementData(semantic, attrs) {
  return assign({
    type: semantic.Type,
    businessObject: semantic,
  }, attrs);
}

function collectWaypoints(edge) {
  const waypoints = edge.waypoint;

  if (waypoints) {
    return map(waypoints, (waypoint) => {
      const position = { x: waypoint.x, y: waypoint.y };

      return assign({ original: position }, position);
    });
  }
  return null;
}

export default function SagaImporter(
  eventBus,
  canvas,
  elementFactory,
  elementRegistry,
) {
  this.eventBus = eventBus;
  this.canvas = canvas;
  this.elementRegistry = elementRegistry;
  this.elementFactory = elementFactory;
}

SagaImporter.$inject = [
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
    this.root(definitions);
    forEach(definitions.States, (state) => {
      console.log(state);
    });
  } catch (e) {
    error = e;
    console.error(e);
  }

  this.eventBus.fire('import.done', { error, warnings });
};

SagaImporter.prototype.root = function (semantic) {
  const root = assign({}, semantic);
  delete root.States;
  const element = this.elementFactory.createRoot(elementData(root));

  this.canvas.setRootElement(element);

  return element;
};

/**
 * Add drd element (semantic) to the canvas.
 */
SagaImporter.prototype.add = function (semantic) {
  const { elementFactory } = this;
  const { canvas } = this;
  const { Style } = semantic;

  let element; let waypoints; let source; let target; let elementDefinition; let
    bounds;

  if (Style.type === 'Node') {
    bounds = Style.bounds;

    elementDefinition = elementData(semantic, {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    });
    element = elementFactory.createShape(elementDefinition);

    canvas.addShape(element);
  } else if (Style.type === 'Edge') {
    waypoints = collectWaypoints(Style);

    source = this.getSource(semantic);
    target = this.getTarget(semantic);

    if (source && target) {
      elementDefinition = elementData(semantic, {
        source,
        target,
        waypoints,
      });

      element = elementFactory.createConnection(elementDefinition);

      canvas.addConnection(element);
    }
  } else {
    throw new Error(`unknown di for element ${semantic.id}`);
  }

  return element;
};

SagaImporter.prototype.getSource = function (semantic) {
  return this.getShape(semantic.sourceRef);
};

SagaImporter.prototype.getTarget = function (semantic) {
  return this.getShape(semantic.targetRef);
};

SagaImporter.prototype.getShape = function (id) {
  return this.elementRegistry.get(id);
};
