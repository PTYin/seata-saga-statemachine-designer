export default function SagaExporter(elementRegistry) {
  this.elementRegistry = elementRegistry;
}
SagaExporter.$inject = ['elementRegistry'];

SagaExporter.prototype.export = function (event) {
  console.log(this, this.elementRegistry);
};
