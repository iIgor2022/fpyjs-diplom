/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.imagesWrapper = element;
    this.allImagesBlock = this.imagesWrapper.querySelector('.images-list').querySelector('.grid').firstElementChild;
    this.previewBlock = this.imagesWrapper.querySelector('.six');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    this.allImagesBlock.addEventListener('dblclick', (element) => {
      const target = element.target || window.EventTarget;
      if (target.nodeName === 'IMG') {
        this.previewBlock.removeChild(this.previewBlock.firstElementChild);
        this.previewBlock.appendChild(target.cloneNode(false));
      }
    });

    this.allImagesBlock.addEventListener('click', (element) => {
      const target = element.target || window.EventTarget;
      if (target.nodeName === 'IMG') {
        if (target.classList.contains('selected')) {
          target.classList.remove('selected');
        } else {
          target.classList.add('selected');
        };
        this.checkButtonText();
      };
    });

    this.imagesWrapper.querySelector('.select-all').addEventListener('click', () => {
      const allImages = Array.from(this.allImagesBlock.querySelectorAll('img'));
      const selectedImages = allImages.filter((element) => {
        return element.classList.contains('selected');
      });
      if (selectedImages.length > 0) {
        selectedImages.forEach((element) => {
          element.classList.remove('selected');
        });
      } else {
        allImages.forEach((element) => {
          element.classList.add('selected');
        })
      }
      this.checkButtonText();
    });

    this.imagesWrapper.querySelector('.show-uploaded-files').addEventListener('click', () => {
      const modalWindow = App.getModal('filePreviewer');
      modalWindow.open();
      Yandex.getUploadedFiles(this.callback);
    });

    this.imagesWrapper.querySelector('.send').addEventListener('click', ()=> {
      const modalWindow = App.getModal('fileUploader');
      const selectedImages = Array.from(this.allImagesBlock.querySelectorAll('img')).filter((element) => {
        return element.classList.contains('selected');
      });
      modalWindow.open();
      modalWindow.showImages(selectedImages);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    while (this.allImagesBlock.firstChild) {
      this.allImagesBlock.removeChild(this.allImagesBlock.firstChild);
    }
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const selectAllButton = this.imagesWrapper.querySelector('.select-all');
    if (images.length > 0) {
      selectAllButton.classList.remove('disabled');
    } else {
      selectAllButton.classList.add('disabled');
    }
    for (let image of images) {
      const div = document.createElement('div');
      div.className ='four wide column ui medium image-wrapper';
      div.innerHTML = `<img src="${image}"/>`;
      this.allImagesBlock.appendChild(div);
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const allImages = Array.from(this.allImagesBlock.querySelectorAll('img'));
    const selectedImages = Array.from(this.allImagesBlock.querySelectorAll('img')).filter((element) => {
      return element.classList.contains('selected');
    });
    const selectAllButton = this.imagesWrapper.querySelector('.select-all');
    const sendButton = this.imagesWrapper.querySelector('.send');
    if (allImages.length === selectedImages.length) {
      selectAllButton.textContent = 'Снять выделение';
    } else {
      selectAllButton.textContent = 'Выбрать все';
    };
    if (selectedImages.length > 0) {
      sendButton.classList.remove('disabled');
    } else {
      sendButton.classList.add('disabled');
    };
  }

  callback(status, response) {
    if (status === 200) {
      App.modals.filePreviewer.showImages(response.items);
    };
  }

}