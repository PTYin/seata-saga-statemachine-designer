import { assign } from 'min-dash';
import TaskState from './TaskState';

export default class ServiceTask extends TaskState {
  /**
   * @type {string}
   */
  serviceName;

  /**
   * @type {string}
   */
  serviceMethod;

  /**
   * @type {string}
   */
  serviceType;

  importJson(json) {
    super.importJson(json);
    this.serviceName = json.ServiceName;
    this.serviceMethod = json.ServiceMethod;
    this.serviceType = json.ServiceType;
  }

  exportJson() {
    const json = super.exportJson();
    return assign(json, {
      ServiceName: this.serviceName,
      ServiceMethod: this.serviceMethod,
      ServiceType: this.serviceType,
    });
  }
}

ServiceTask.prototype.type = 'ServiceTask';

ServiceTask.prototype.DEFAULT_SIZE = {
  width: 100,
  height: 80,
};
