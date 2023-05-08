/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;
    const script = document.createElement('script');
    script.classList.add('vk-get-photos');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&photo_sizes=1&access_token=${this.ACCESS_TOKEN2}&v=5.81&callback=VK.processData`;
    document.querySelector('head').appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    const response = result;
    if (response.response) {
      const images = response.response.items;
      const resultList = [];
      for (const item of images) {
        const biggestImage = {size: 0, url: '',};
        for (let size of item.sizes) {
          if (size.height * size.width > biggestImage.size) {
            biggestImage.size =size.height * size.width;
            biggestImage.url = size.url;
          }
        }
        resultList.push(biggestImage.url);
      }
      this.lastCallback(resultList);
    }
    if (response.error) {
      alert(response.error.error_msg);
    }
    document.querySelector('.vk-get-photos').remove();
    
    this.lastCallback = () => {};
  }
}
