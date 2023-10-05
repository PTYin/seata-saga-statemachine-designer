import { assign } from 'min-dash';
import State from './State';

export default class TaskState extends State {
  /**
   * @type {[{value: string}]}
   */
  input;

  /**
   * @type {[{key: string, value: string}]}
   */
  output;

  importJson(json) {
    super.importJson(json);
    if (json.Input) {
      this.input = json.Input.map((x) => ({ value: x }));
    }
    this.output = Object.keys(json.Output).map((key) => ({ key, value: json.Output[key] }));
  }

  exportJson() {
    const json = super.exportJson();
    return assign(json, {
      Input: this.input && this.input.map(({ value }) => value),
      Output: this.output && this.output.reduce(
        (obj, { key, value }) => assign(obj, { [key]: value }),
        {},
      ),
    });
  }
}
