import {
  asTRBL,
  getMid,
  getOrientation,
} from 'diagram-js/lib/layout/LayoutUtil';

const LOW_PRIORITY = 250;

export default function ConnectSnapping(eventBus) {
  eventBus.on([
    'connect.hover',
    'connect.move',
    'connect.end',
  ], LOW_PRIORITY, (event) => {
    const { context } = event;
    const { hover } = context;
    const { source } = context;
    const { target } = context;

    const orientation = getOrientation(source, target);

    // snap source
    context.connectionStart = getMid(source);

    // snap target
    if (hover === source) {
      context.connectionEnd = getMid(target);
    } else {
      context.connectionEnd = {
        x: event.x,
        y: event.y,
      };
    }

    if (orientation.includes('bottom')) {
      context.connectionStart.y = asTRBL(source).top;
      context.connectionEnd.y = asTRBL(target).bottom;
    } else if (orientation.includes('top')) {
      context.connectionStart.y = asTRBL(source).bottom;
      context.connectionEnd.y = asTRBL(target).top;
    } else if (orientation.includes('right')) {
      context.connectionStart.x = asTRBL(source).left;
      context.connectionEnd.x = asTRBL(target).right;
    } else {
      context.connectionStart.x = asTRBL(source).right;
      context.connectionEnd.x = asTRBL(target).left;
    }
  });
}

ConnectSnapping.$inject = ['eventBus'];
