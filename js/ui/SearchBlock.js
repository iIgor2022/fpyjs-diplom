/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    Array.from(this.element.querySelectorAll('button')).forEach((element) => {
      element.addEventListener('click', function() {
        const siblingInput = this.closest('.search-block').querySelector('input');
        let callback = NaN;
        if (siblingInput.value !== '') {
          if (this.classList.contains('replace')) {
            callback = App.searchBlock.callbackReplace;
          } else {
            callback = App.searchBlock.callbackAdd;
          }
          VK.get(siblingInput.value, callback);
          siblingInput.value = '';
        }
      })
    })
  }

  callbackAdd(response) {
    App.searchBlock.findImageLink(response);
  }

  callbackReplace(response) {   
    App.imageViewer.clear() ;
    App.searchBlock.findImageLink(response);
  }

  findImageLink(response) {
    App.imageViewer.drawImages(response);
  }
}