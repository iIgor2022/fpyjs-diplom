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
    for (let key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    };
    xhr.send();
  } catch(error) {
    console.log(error);
  };
};
