const form = document.querySelector('#form');
const inputsContainer = form.querySelector('.form__inputs');

// у формы инпут появляется из за всплытия событий 
form.addEventListener('input', (e) => {
  

  const key = e.target.name;
  const value = e.target.value;

  const formData = new FormData(e.currentTarget);

  const values = Object.fromEntries(formData);


  const errorMessage = validate(key, value, values);

  if (!errorMessage) {
    clearError(key);
    return;
  }

  setError(key, errorMessage);

});

const validators = {
  username: validateUsername,
  email: validateEmail,
  password: validatePassword,
  passwordRepeat: validatePasswordRepeat,
}

function validate(key, value, values) {
  // берет по ключу функцию из объекта и записывает в переменную
  const validator = validators[key];
  return validator(value, values);
}

function setError(key, errorMessage) {
  const inputEl = inputsContainer.querySelector(`.form__input[name=${key}]`);
  let errorEl = inputsContainer.querySelector(`.form__error[data-key=${key}]`);

  if (!errorEl) {
    errorEl = document.createElement('p');
    inputEl.after(errorEl);
  }

  inputEl.classList.add('form__input_invalid');
  errorEl.classList.add('form__error');
  errorEl.dataset.key = key;
  errorEl.textContent = errorMessage;
}

function clearError(key) {
  const inputEl = inputsContainer.querySelector(`.form__input[name=${key}]`);
  inputEl.classList.remove('form__input_invalid');

  const errorEl = inputsContainer.querySelector(`.form__error[data-key=${key}]`);

  // if (errorEl) {
  //   errorEl.remove();
  // }

  errorEl?.remove();
}


// Функции валидации

function validateUsername(value) {

  if (!value) {
    return 'Введите имя пользователя';
  }

  if (value?.length < 5) {
    return 'Имя должно быть не меньше 5 символов';
  }

  return null;
}

function validateEmail(value) {
  const input = document.createElement('input');

  input.type = 'email';
  input.required = true;
  input.value = value;

  const isValid =  typeof input.checkValidity === 'function'
    ? input.checkValidity()
    : /\S+@\S+\.\S+/.test(value);

  if (!isValid) {
    return 'Введите корректный email';
  }

  return null;
}

function validatePassword(value) {

  if (!value) {
    return 'Введите пароль';
  }

  if (value?.length < 6) {
    return 'Имя должно быть не меньше 6 символов';
  }

  return null;
}

function validatePasswordRepeat(value, values) {
  if (!value) {
    return 'Введите повтор пароля';
  }

  if (values.password !== value) {
    return 'Пароли не совпадают';
  }

  return null;

}