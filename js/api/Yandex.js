/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    if (localStorage.getItem('YDToken') === null) {
      let typedToken = null;
      while (typedToken === null) {
        typedToken = prompt('Введите токен ЯДиск');
      };
      localStorage.setItem('YDToken', typedToken);
    };
    return localStorage.getItem('YDToken');
  }

  static getURL(mainURL, path = '', url = '') {
    let result = new URL(`${this.HOST}${mainURL}`);
    if (path !== '') {
      result.searchParams.set('path', path);
    }
    if (url !== '') {
      result.searchParams.set('url', url);
    }
    return result;
  }

  static getHeaders() {
    return {
      'Authorization': `OAuth ${this.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: 'POST',
      headers: this.getHeaders(),
      callback,
      url: this.getURL('/resources/upload', path, url),
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    createRequest({
      method: 'DELETE',
      headers: this.getHeaders(),
      callback,
      url: this.getURL('/resources', path),
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    createRequest({
      method: 'GET',
      headers: this.getHeaders(),
      callback,
      url: this.getURL('/resources/files'),
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    const href = document.createElement('a');
    href.href = url;
    href.click();
  }
}
