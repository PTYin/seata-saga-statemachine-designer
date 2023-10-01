export default {

  getElementLabel: (element) => {
    return element.name;
  },

  getElementIcon: () => {
    // TODO
  },

  getTypeLabel: (element) => {
    return element?.type?.replace(/(\B[A-Z])/g, ' $1').replace(/(\bNon Interrupting)/g, '($1)');
  },
};
