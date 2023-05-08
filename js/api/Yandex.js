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

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: 'POST',
      headers: this.getToken(),
      callback,
      url: `${this.HOST}/resources/upload?url=${url}&path=disk:/${path}`,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    createRequest({
      method: 'DELETE',
      headers: this.getToken(),
      callback,
      url: `${this.HOST}/resources?path=${path}`,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    createRequest({
      method: 'GET',
      headers: this.getToken(),
      callback,
      url: `${this.HOST}/resources/files?media_type=image&fields=items.size,items.created,items.file,items.name,items.path,items.preview`,
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
