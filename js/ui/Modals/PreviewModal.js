/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends(BaseModal) {
  constructor( element ) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.elementDom.querySelector('.x').addEventListener('click', () => {
      this.close();
    });
    this.elementDom.querySelector('.content').addEventListener('click', (element) => {
      const target = element.target || window.EventTarget;
      if (target.classList.contains('delete')) {
        target.querySelector('i').classList.add(['icon', 'spinner', 'loading']);
        target.classList.add('disabled');
        Yandex.removeFile(target.dataset.path, this.callbackDelete);
      };
      if (target.classList.contains('download')) {
        if (target.nodeName === 'I') {
          Yandex.downloadFileByUrl(target.closest('button').dataset.file);
        } else {
          Yandex.downloadFileByUrl(target.dataset.file);
        }
      }
    })
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    data.reverse();
    this.elementDom.querySelector('.content').innerHTML = 
      data.reduce((result, currentItem) => result + this.getImageInfo(currentItem), '');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const dateTime = new Date(Date.parse(date));
    const dateString = dateTime.toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeString = dateTime.toLocaleString('ru', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateString} в ${timeString}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `<div class="image-preview-container">
    <img src='${item.preview}' />
    <table class="ui celled table">
    <thead>
      <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
    </thead>
    <tbody>
      <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${Math.round(item.size / 1024)}Кб</td></tr>
    </tbody>
    </table>
    <div class="buttons-wrapper">
      <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
        Удалить
        <i class="trash icon"></i>
      </button>
      <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
        Скачать
        <i class="download icon"></i>
      </button>
    </div>
  </div>`
  }

  callbackDelete(status, response) {
    if (status === 204 && response === null) {
      const container = App.modals.filePreviewer.elementDom.querySelector('.disabled').closest('.image-preview-container');
      App.modals.filePreviewer.elementDom.querySelector('.content').removeChild(container);
    };
  }
}
