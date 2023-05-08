/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends(BaseModal) {
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.elementDom.querySelector('.x').addEventListener('click', () => {
      this.close();
    });

    this.elementDom.querySelector('.close').addEventListener('click', () => {
      this.close();
    });

    this.elementDom.querySelector('.send-all').addEventListener('click', () => {
      this.sendAllImages();
    });

    this.elementDom.querySelector('.content').addEventListener('click', (element) => {
      const target = element.target || window.EventTarget;
      if (target.nodeName === 'INPUT') {
        target.closest('.input').classList.remove('error');
      };
      if (target.nodeName === 'BUTTON') {
        this.sendImage(target.closest('.image-preview-container')) ;
      };
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    this.elementDom.querySelector('.content').innerHTML = images.reduce((result, currentImage) => result + this.getImageHTML(currentImage), '');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `<div class="image-preview-container">
      <img src='${item.src}' />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    Array.from(this.elementDom.querySelectorAll('.image-preview-container')).forEach((container) => {
      this.sendImage(container);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const containerInput = imageContainer.querySelector('input');
    if (containerInput.value === '') {
      this.elementSemantic.find('.action').addClass('error');
      return false;
    };
    this.elementSemantic.find('.action').addClass('disabled');
    Yandex.uploadFile(containerInput.value, imageContainer.querySelector('img').src, this.callback);
  }

  callback(status, response) {  
    if (status === 202) {
      const modalWindowContentBlock = document.querySelector('.file-uploader-modal').querySelector('.content');
      const container = modalWindowContentBlock.querySelector('.disabled').closest('.image-preview-container');
      modalWindowContentBlock.removeChild(container);
      if (!modalWindowContentBlock.hasChildNodes()) {
        App.modals.fileUploader.close();
      };
    };
  }
}