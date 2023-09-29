import {
  asTRBL,
  getMid,
  getOrientation,
} from 'diagram-js/lib/layout/LayoutUtil';

const RECONNECT_START = 'reconnectStart';
const RECONNECT_END = 'reconnectEnd';

const HIGH_PRIORITY = 2000;

// helpers //////////

function getConnectionStart(source, orientation) {
  const sourceTrbl = asTRBL(source);

  const connectionStart = getMid(source);

  if (orientation.includes('bottom')) {
    connectionStart.y = sourceTrbl.top;
  } else if (orientation.includes('top')) {
    connectionStart.y = sourceTrbl.bottom;
  } else if (orientation.includes('right')) {
    connectionStart.x = sourceTrbl.left;
  } else {
    connectionStart.x = sourceTrbl.right;
  }

  return connectionStart;
}

function getConnectionEnd(target, orientation) {
  const targetTrbl = asTRBL(target);

  const connectionEnd = getMid(target);

  if (orientation.includes('bottom')) {
    connectionEnd.y = targetTrbl.bottom;
  } else if (orientation.includes('top')) {
    connectionEnd.y = targetTrbl.top;
  } else if (orientation.includes('right')) {
    connectionEnd.x = targetTrbl.right;
  } else {
    connectionEnd.x = targetTrbl.left;
  }

  return connectionEnd;
}

function snapToSource(event, orientation) {
  const { context } = event;
  const { source } = context;

  const connectionStart = getConnectionStart(source, orientation);

  const dx = event.x - connectionStart.x;
  const dy = event.y - connectionStart.y;

  event.x -= dx;
  event.y -= dy;

  event.dx -= dx;
  event.dy -= dy;
}

function snapToTarget(event, orientation) {
  const { context } = event;
  const { target } = context;

  const connectionEnd = getConnectionEnd(target, orientation);

  let dx = 0;
  let dy = 0;

  if (orientation.includes('top') || orientation.includes('bottom')) {
    dy = event.y - connectionEnd.y;
  } else {
    dx = event.x - connectionEnd.x;
  }

  event.x -= dx;
  event.y -= dy;

  event.dx -= dx;
  event.dy -= dy;
}

export default function BendpointSnapping(eventBus) {
  eventBus.on([
    'bendpoint.move.move',
    'bendpoint.move.end',
  ], HIGH_PRIORITY, (event) => {
    const { context } = event;
    const { hover } = context;
    const { source } = context;
    const { target } = context;
    const { type } = context;

    if (!context.hints) {
      context.hints = {};
    }

    delete context.hints.connectionStart;
    delete context.hints.connectionEnd;

    if (source === target) {
      return;
    }

    const reconnect = type === RECONNECT_START || type === RECONNECT_END;

    const orientation = getOrientation(source, target);

    if (reconnect && hover === source) {
      // (1) snap event to source
      snapToSource(event, orientation);

      // (2) set connection end to target
      context.hints.connectionEnd = getConnectionEnd(target, orientation);
    } else if (reconnect && hover === target) {
      // (1) set connection start to source
      context.hints.connectionStart = getConnectionStart(source, orientation);

      // (2) snap event to target
      snapToTarget(event, orientation);
    }
  });
}

BendpointSnapping.$inject = ['eventBus'];
