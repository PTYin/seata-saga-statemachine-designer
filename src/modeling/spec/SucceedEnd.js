import State from './State';

export default class SucceedEnd extends State {
}

SucceedEnd.prototype.type = 'Succeed';

SucceedEnd.prototype.DEFAULT_SIZE = {
  width: 36,
  height: 36,
};
