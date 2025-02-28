import ApiRequest from "./ApiRequest";
import axios from "axios";
import { decode } from '@msgpack/msgpack';

export default class Api {

  /**
   *
   * @type {ApiRequest}
   */
  static debug = false;
  /**
   *
   * @type {ApiRequest}
   */
  static requestClass = ApiRequest;

  /**
   *
   * @return {Promise<string>}
   */
  static tokenResolver = async () =>
  {
    return localStorage.getItem('api_token');
  }

  /**
   *
   * @return {string}
   */
  static domainResolver = () =>
  {
    return process.env.REACT_APP_API_URL;
  }

  /**
   *
   * @param controller
   * @param action
   * @param arg
   * @param data
   * @return {ApiRequest|Builder}
   */
  static getArg(controller, action, arg, data = {}) {
    return this.get(controller, action, data).addArg(arg);
  }

  /**
   *
   * @param controller
   * @param action
   * @param arg
   * @param data
   * @return {ApiRequest|Builder}
   */
  static postArg(controller, action, arg, data = {}) {
    return this.post(controller, action, data).addArg(arg);
  }

  /**
   *
   * @param controller
   * @param action
   * @param arg
   * @param data
   * @return {ApiRequest|Builder}
   */
  static putArg(controller, action, arg, data = {}) {
    return this.put(controller, action, data).addArg(arg);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest|Builder}
   */
  static getUrl(url, data = {})
  {
    return (new this.requestClass('', '', data, 'GET')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest|Builder}
   */
  static postUrl(url, data = {})
  {
    return (new this.requestClass('', '', data, 'POST')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest|Builder}
   */
  static putUrl(url, data = {})
  {
    return (new this.requestClass('', '', data, 'PUT')).setUrl(url);
  }

  /**
   *
   * @param controller
   * @param action
   * @param data
   * @returns {ApiRequest|Builder}
   */
  static get(controller, action, data = {}) {
    return new this.requestClass(controller, action, data, 'GET');
  }
  /**
   *
   * @param controller
   * @param action
   * @param data
   * @returns {ApiRequest|Builder}
   */
  static post(controller, action, data = {}) {
    return new this.requestClass(controller, action, data, 'POST');
  }
  /**
   *
   * @param controller
   * @param action
   * @param data
   * @returns {ApiRequest|Builder}
   */
  static put(controller, action, data = {}) {
    return new this.requestClass(controller, action, data, 'PUT');
  }

  /**
   *
   * @param controller
   * @param action
   * @param id
   * @param data
   * @return {ApiRequest|Builder}
   */
  static delete(controller, action, id, data = {}) {
    return new this.requestClass(controller, action, data, 'DELETE').addArg(id);
  }

  /**
   *
   * @param params
   * @return {*}
   */
  static encodeQueryString(params) {
    const flattenObject = (obj, parentKey = '') => {
      return Object.entries(obj).map(([key, value]) => {
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof value === 'object' && value !== null) {
          return flattenObject(value, newKey);
        } else {
          return `${encodeURIComponent(newKey)}=${encodeURIComponent(value)}`;
        }
      });
    };

    const flatParams = flattenObject(params);

    return flatParams.join('&');
  }

  /**
   *
   * @param request
   */
  static logRequest(request)
  {
    if(Api.debug)
    {
      console.log('Url: ' + request.url)
      console.log('Method: ' + request.method)
      console.log('Data: ' + JSON.stringify(request.data ?? '').replace(/\"([^(\")"]+)\":/g,"$1:"))
      console.log('Params: ' + JSON.stringify(request.params ?? '').replace(/\"([^(\")"]+)\":/g,"$1:"))
      console.log('Headers: ' + JSON.stringify(request.headers ?? '').replace(/\"([^(\")"]+)\":/g,"$1:"))
    }
  }

  /**
   *
   * @param obj
   * @return {*}
   */
  static async makeRequest({ url, method, data = {}, params = {}, headers = {}, success = () => {}, error = () => {} }) {
    try {
      // Устанавливаем Content-Type по умолчанию
      headers['Content-Type'] = 'application/json';

      let api_token = await Api.tokenResolver();
      if (api_token) {
        headers["Authorization"] = api_token;
      }

      let response;
      switch (method) {
        case 'GET':
          response = await Api.handleGetRequest({ url, data, headers });
          break;
        default:
          response = await Api.handleDefaultRequest({ url, method, data, params, headers });
          break;
      }

      // Получаем статус код
      const statusCode = response.status;

      // Получаем полный объект ответа
      const xhr = response.request;

      // Определяем тип контента из заголовков
      const contentType = response.headers['content-type'];

      let responseData;
      if (contentType && contentType.includes('application/msgpack')) {
        // Если контент типа msgpack, декодируем его
        responseData = decode(response.data);
      } else {
        // Иначе предполагаем JSON и парсим его
        responseData = response.data;
      }

      try {
        success(responseData, statusCode, xhr);
      } catch (error) {
        console.error(error);
      }

      return responseData;
    } catch (e) {
      console.error(`API request to ${url} failed: ${e}`);

      const xhr = e.request;

      // Написано для обратной совместимости после перехода с jQuery
      try {
        xhr.responseJSON = e.response.data;
      } catch (errorJson) {
        console.log(errorJson);
      }

      // Статус код
      let statusCode = e.request?.status;

      // Текст статуса
      let statusText = e.request?.statusText || e.message;

      try {
        error(xhr, statusCode, statusText);
      } catch (error) {
        console.error(error);
      }
    }
  }

  static generateHash(length = 50) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  /**
   *
   * @param url
   * @param data
   * @param headers
   * @return {Promise<AxiosResponse<any>>}
   */
  static async handleGetRequest({ url, data, headers }) {
    let query = Api.encodeQueryString(data);
    let response;

    data.unique_hash = Api.generateHash();

    if (query.length > 5000) {
      data._method = 'GET';
      let request = {
        url: url,
        method: 'POST',
        data: data,
        headers: headers,
        timeout: 0
      };
      Api.logRequest(request);
      response = await axios.request(request);
    } else {
      data.timestamp = new Date().getTime();
      let request = {
        url: url,
        method: 'GET',
        params: data,
        headers: headers,
        timeout: 0
      };
      Api.logRequest(request);
      response = await axios.request(request);
    }

    return response;
  }

  /**
   *
   * @param url
   * @param method
   * @param data
   * @param params
   * @param headers
   * @return {Promise<AxiosResponse<any>>}
   */
  static async handleDefaultRequest({ url, method, data, params, headers }) {
    params.timestamp = new Date().getTime();

    params.unique_hash = Api.generateHash();

    let request = {
      url: url,
      method: method,
      data: data,
      params: params,
      headers: headers,
      timeout: 0,
    };
    Api.logRequest(request);
    return await axios.request(request);
  }
}