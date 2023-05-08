/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest; 
  xhr.responseType = 'json';
  xhr.addEventListener('readystatechange', function() {
    if (this.readyState === this.DONE) {
      options.callback(this.status, this.response);
    };
  });

  try {
    xhr.open(options.method, options.url);
    xhr.setRequestHeader('Authorization', `OAuth ${options.headers}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  } catch(error) {
    console.log(error);
  };
};
