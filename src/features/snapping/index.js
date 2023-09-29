import SnappingModule from 'diagram-js/lib/features/snapping';
import BendpointSnapping from './BendpointSnapping';
import ConnectSnapping from './ConnectSnapping';

export default {
  __depends__: [SnappingModule],
  __init__: [
    'bendpointSnapping',
    'connectSnapping',
  ],
  bendpointSnapping: ['type', BendpointSnapping],
  connectSnapping: ['type', ConnectSnapping],
};
