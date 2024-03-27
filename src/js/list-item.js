export default class PrototypePropsListItem {
  constructor(listContainer, prototype) {
    this.proto = prototype;
    this.createListItem(listContainer);
  }

  set proto(value) {
    Object.defineProperty(this, '_proto', {
      value,
      configurable: false,
      enumerable: true,
      writable: false,
    });
  }

  get proto() {
    return this._proto;
  }

  createListItem(listContainer) {
    const listItem = document.createElement('li');
    const prototypeName = document.createElement('span');
    const prototypeProps = document.createElement('ol');
    listItem.classList.add('prototype-list__item');
    prototypeName.classList.add('prototype-list__item-name')
    prototypeName.textContent = this.proto.constructor ?
                                this.proto.constructor.name :
                                'Без названия';
    prototypeProps.classList.add('prototype-list-inner');

    for (let prop in this.proto) {
      const propElement = document.createElement('li');
      propElement.classList.add('prototype-list-inner__item')
      let currentProp;

      try {
        currentProp = this.proto[prop];
      } catch (error) {
        if (error.name = 'TypeError' && error.message === 'Illegal invocation') {
          currentProp = undefined;
        } else {
          throw error;
        }
      }

      propElement.innerHTML = `
      <div><span class ="prototype-list-inner__prop">${prop}</span><br>
      Type: <span class="prototype-list-inner__type">${typeof currentProp}</span></div>
      `;
      prototypeProps.append(propElement);
    }

    listItem.append(prototypeName);
    if (prototypeProps.innerHTML) listItem.append(prototypeProps);
    listContainer.append(listItem);
  }
}
