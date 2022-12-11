const myForm = document.querySelector('#form');  

const myFormValidators = {
  username: validateUsername,
  email: validateEmail,
  password: validatePassword,
  passwordRepeat: validatePasswordRepeat,
  phone: validatePhone
}
enableValidation(myForm, myFormValidators);

function enableValidation(form, validators) {
  const inputsContainer = form.querySelector('.form__inputs');

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

  // у формы инпут появляется из за всплытия событий 
  form.addEventListener('input', (e) => {

    console.dir(e.target);
    

    const key = e.target.name;
    const value = e.target.value;

    const formData = new FormData(e.currentTarget);

    const values = Object.fromEntries(formData);


    const errorMessage = validate(key, value, values);

    // if (!errorMessage) {
    //   clearError(key);
    //   return;
    // }

    // setError(key, errorMessage);

    if (!errorMessage) {
      e.target.onblur = () => {
        e.target.dataset.dirty = 'true';
      };
      clearError(key);
      return;
    }

    // есть ошибка
    if (e.target.dataset.dirty === 'true') {
      setError(key, errorMessage);
      return;
    }

    // есть ошибка, но мы еще не ушли с поля
    e.target.onblur = () => {
      e.target.dataset.dirty = 'true';
      setError(key, errorMessage);
    };

  });

  
  form.addEventListener('submit', (e) => {
    
    const formData = new FormData(e.currentTarget);

    const values = Object.fromEntries(formData);

    let isFormValid = true;

    formData.forEach((value, key) => {
      const errorMessage = validate(key, value, values);

      if (!errorMessage) {
        return;
      }

      setError(key, errorMessage);
      const inputEl = inputsContainer.querySelector(`.form__input[name=${key}]`);
      inputEl.dataset.dirty = 'true';

      isFormValid = false;
    });

    if (!isFormValid) {
      e.preventDefault();
      return;
    }

    // отправить запрос
  });


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

function validatePhone(value) {
  if (!value) {
    return 'Введите номер телефона';
  }

  if (!/^\+?\d{11}$/.test(value)) {
    return 'Введите коректный номер телефона';
  }

  return null;

}