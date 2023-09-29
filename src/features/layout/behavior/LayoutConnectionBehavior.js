import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  asTRBL,
  getMid,
  getOrientation,
} from 'diagram-js/lib/layout/LayoutUtil';

import {
  assign,
  forEach,
} from 'min-dash';

const LOW_PRIORITY = 500;

// helpers //////////

function getConnectionHints(source, target, orientation) {
  const connectionStart = getMid(source);
  const connectionEnd = getMid(target);

  if (orientation.includes('bottom')) {
    connectionStart.y = source.y;
    connectionEnd.y = target.y + target.height;
  } else if (orientation.includes('top')) {
    connectionStart.y = source.y + source.height;
    connectionEnd.y = target.y;
  } else if (orientation.includes('right')) {
    connectionStart.x = source.x;
    connectionEnd.x = target.x + target.width;
  } else {
    connectionStart.x = source.x + source.width;
    connectionEnd.x = target.x;
  }

  return {
    connectionStart,
    connectionEnd,
  };
}

/**
 * Get connections start and end based on number of information requirements and
 * orientation.
 *
 * @param {Array<djs.model.Connection>} informationRequirements
 * @param {djs.model.Shape} target
 * @param {string} orientation
 *
 * @returns {Array<Object>}
 */
function getConnectionsStartEnd(informationRequirements, target, orientation) {
  return informationRequirements.map(
    (informationRequirement, index) => {
      const { source } = informationRequirement;
      const sourceMid = getMid(source);
      const sourceTrbl = asTRBL(source);
      const targetTrbl = asTRBL(target);

      const { length } = informationRequirements;

      if (orientation.includes('bottom')) {
        return {
          start: {
            x: sourceMid.x,
            y: sourceTrbl.top,
          },
          end: {
            x: targetTrbl.left + (target.width / (length + 1)) * (index + 1),
            y: targetTrbl.bottom,
          },
        };
      } if (orientation.includes('top')) {
        return {
          start: {
            x: sourceMid.x,
            y: sourceTrbl.bottom,
          },
          end: {
            x: targetTrbl.left + (target.width / (length + 1)) * (index + 1),
            y: targetTrbl.top,
          },
        };
      } if (orientation.includes('right')) {
        return {
          start: {
            x: sourceTrbl.left,
            y: sourceMid.y,
          },
          end: {
            x: targetTrbl.right,
            y: targetTrbl.top + (target.height / (length + 1)) * (index + 1),
          },
        };
      }
      return {
        start: {
          x: sourceTrbl.right,
          y: sourceMid.y,
        },
        end: {
          x: targetTrbl.left,
          y: targetTrbl.top + (target.height / (length + 1)) * (index + 1),
        },
      };
    },
  );
}

/**
 * Get information requirements by orientation.
 *
 * @param {djs.model.shape} target
 * @param {Array<djs.model.Connection>} informationRequirements
 *
 * @returns {Object}
 */
function getConnectionByOrientation(target, informationRequirements) {
  const incomingConnectionsByOrientation = {};

  informationRequirements.forEach((incoming) => {
    const orientation = getOrientation(incoming.source, target).split('-').shift();

    if (!incomingConnectionsByOrientation[orientation]) {
      incomingConnectionsByOrientation[orientation] = [];
    }

    incomingConnectionsByOrientation[orientation].push(incoming);
  });

  return incomingConnectionsByOrientation;
}

function isSameOrientation(orientationA, orientationB) {
  return orientationA
    && orientationB
    && orientationA.split('-').shift() === orientationB.split('-').shift();
}

function sortConnections(informationRequirements, orientation) {
  let axis;

  if (orientation.includes('top') || orientation.includes('bottom')) {
    axis = 'x';
  } else {
    axis = 'y';
  }

  return informationRequirements.sort((a, b) => {
    return getMid(a.source)[axis] - getMid(b.source)[axis];
  });
}

export default function LayoutConnectionBehavior(injector, layouter, modeling) {
  injector.invoke(CommandInterceptor, this);

  // specify connection start and end on connection create
  this.preExecute([
    'connection.create',
    'connection.reconnect',
  ], (context) => {
    const source = context.newSource || context.source;
    const target = context.newTarget || context.target;

    const orientation = getOrientation(source, target);

    if (!context.hints) {
      context.hints = {};
    }

    assign(context.hints, getConnectionHints(source, target, orientation));
  }, true);

  /**
   * Update incoming information requirements.
   *
   * @param {djs.model.Shape} target
   * @param {Array<djs.model.Connection>} [connection]
   * @param {string} [orientation]
   */
  function updateConnections(target, connection, orientation) {
    // (1) get information requirements
    if (!connection) {
      connection = target.incoming;
    }

    let incomingConnectionsByOrientation = {};

    // (2) get information requirements per orientation
    if (orientation) {
      incomingConnectionsByOrientation[orientation] = connection;
    } else {
      incomingConnectionsByOrientation = getConnectionByOrientation(target, connection);
    }

    // (3) update information requirements per orientation
    forEach(
      incomingConnectionsByOrientation,
      (connections, ot) => {
        // (3.1) sort information requirements
        connections = sortConnections(connections, ot);

        // (3.2) get new connection start and end
        const connectionStartEnd = getConnectionsStartEnd(connections, target, ot);

        // (3.3) update information requirements
        connections.forEach((informationRequirement, index) => {
          const connectionStart = connectionStartEnd[index].start;
          const connectionEnd = connectionStartEnd[index].end;

          const waypoints = layouter.layoutConnection(informationRequirement, {
            connectionStart,
            connectionEnd,
          });

          modeling.updateWaypoints(informationRequirement, waypoints);
        });
      },
    );
  }

  // update information requirements on connection create and delete
  // update information requirements of new target on connection reconnect
  this.postExecuted([
    'connection.create',
    'connection.delete',
    'connection.reconnect',
  ], (context) => {
    const { connection } = context;
    const source = connection.source || context.source;
    const target = connection.target || context.target;

    const orientation = getOrientation(source, target);

    // update all information requirements with same orientation
    const connections = target.incoming.filter((incoming) => {
      const incomingOrientation = getOrientation(incoming.source, incoming.target);

      return isSameOrientation(incomingOrientation, orientation);
    });

    if (!connections.length) {
      return;
    }

    updateConnections(target, connections, orientation);
  }, true);

  // update information requirements of old target on connection reconnect
  this.preExecute('connection.reconnect', (context) => {
    const { connection } = context;
    const { source } = connection;
    const { target } = connection;

    const orientation = getOrientation(source, target);

    // update all information requirements with same orientation except reconnected
    const informationRequirements = target.incoming.filter((incoming) => {
      const incomingOrientation = getOrientation(incoming.source, incoming.target);

      return incoming !== connection
        && isSameOrientation(incomingOrientation, orientation);
    });

    if (!informationRequirements.length) {
      return;
    }

    updateConnections(target, informationRequirements, orientation);
  }, true);

  // update information requirements on elements move
  this.postExecuted('elements.move', LOW_PRIORITY, (context) => {
    const { shapes } = context;
    const { closure } = context;
    const { enclosedConnections } = closure;

    shapes.forEach((shape) => {
      // (1) update incoming information requirements
      const incomingConnections = shape.incoming.filter((incoming) => {
        return !enclosedConnections[incoming.id];
      });

      if (incomingConnections.length) {
        updateConnections(shape, incomingConnections);
      }

      // (2) update outgoing information requirements
      shape.outgoing.forEach((outgoing) => {
        if (enclosedConnections[outgoing.id]) {
          return;
        }

        updateConnections(outgoing.target);
      });
    });
  }, true);
}

LayoutConnectionBehavior.$inject = [
  'injector',
  'layouter',
  'modeling',
  'rules',
];

inherits(LayoutConnectionBehavior, CommandInterceptor);
