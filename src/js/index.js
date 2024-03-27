import PrototypePropsListItem from "./list-item.js";

const form = document.forms.prototypeForm;
const formInputElement = form.elements.prototypeValue;
const formErrorElement = document.querySelector('.form__error');
const container = document.getElementById('prototypes');

function init(container, className, classToCheck) {
  container.innerHTML = '';
  const classNameElement = document.createElement('h2');
  const list = document.createElement('ol');
  classNameElement.textContent = className;
  list.classList.add('prototype-list');

  for (
    let currentPrototype = classToCheck.prototype;
    currentPrototype;
    currentPrototype = Object.getPrototypeOf(currentPrototype)
    ) {
    new PrototypePropsListItem(list, currentPrototype);
  }
  container.append(classNameElement, list);
}

function hyndleFormError(error, className) {
  switch(error.message) {
    case `Failed to resolve module specifier '${className}'`:
      formErrorElement.textContent = `Не удалось загрузить модуль ${className}`;
      formInputElement.classList.add('form__input--error');
      formErrorElement.classList.add('form__error--active');
      break;
    case 'Default is not defined in module':
      formErrorElement.textContent = `Значение default в модуле не определено`;
      formInputElement.classList.add('form__input--error');
      formErrorElement.classList.add('form__error--active');
      break;
    case 'modlue.default is not a class':
      formErrorElement.textContent = `Значение default в модуле не является классом`;
      formInputElement.classList.add('form__input--error');
      formErrorElement.classList.add('form__error--active');
      break;
    case `${className} is not defined`:
      formErrorElement.textContent = `${className} не найден в объекте window`;
      formInputElement.classList.add('form__input--error');
      formErrorElement.classList.add('form__error--active');
    default:
      throw error;
  }
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const className = formInputElement.value.trim();

  try {

    if (/.+\.js$/.test(className)) {
      const module = await import(className);

      if (module.default && typeof module.default === 'function') {
        formInputElement.value = '';
        init(container, module.default.name, module.default);
        return;
      }

      if (!module.default) throw new Error('Default is not defined in module');
      if (typeof module.default !== 'function') throw new Error('modlue.default is not a class');
    }

    if (window[className] && typeof window[className] === 'function') {
      formInputElement.value = '';
      init(container, className, window[className]);
      return;
    } else {
      throw new Error(`${className} is not defined`)
    }

  } catch(error) {
    hyndleFormError(error, className);
  }

});

formInputElement.addEventListener('input', function() {
  formInputElement.classList.remove('form__input--error');
  formErrorElement.classList.remove('form__error--active');
  formErrorElement.textContent = '';
});

