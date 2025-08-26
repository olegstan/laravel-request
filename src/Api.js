import ApiRequest from "./ApiRequest";
import axios from "axios";
import { decode } from "@msgpack/msgpack";

export default class Api {

  /**
   *
   * @type {ApiRequest}
   */
  static requestClass = ApiRequest;

  /**
   *
   * @type {string}
   */
  static responseType = 'arraybuffer';

  /**
   *
   * @return {Promise<string>}
   */
  static tokenResolver = async () =>
  {
    if(typeof window !== 'undefined' && typeof window.document !== 'undefined')
    {
      return window.localStorage.getItem('api_token');
    }
  }

  /**
   *
   * @returns {Promise<AxiosStatic | axios.AxiosStatic | axios>}
   */
  static axiosResolver = () =>
  {
    return axios;
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
   * @return {string}
   */
  static isDebug = () =>
  {
    return process.env.REACT_APP_DEBUG === 'true';
  }

  /**
   *
   * @param controller
   * @param action
   * @param arg
   * @param data
   * @return {ApiRequest}
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
   * @return {ApiRequest}
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
   * @return {ApiRequest}
   */
  static putArg(controller, action, arg, data = {}) {
    return this.put(controller, action, data).addArg(arg);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
   */
  static getUrl(url, data = {})
  {
    return (new this.requestClass('', '', data, 'GET')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
   */
  static postUrl(url, data = {})
  {
    return (new this.requestClass('', '', data, 'POST')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
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
   * @returns {ApiRequest}
   */
  static get(controller, action, data = {}) {
    return new this.requestClass(controller, action, data, 'GET');
  }
  /**
   *
   * @param controller
   * @param action
   * @param data
   * @returns {ApiRequest}
   */
  static post(controller, action, data = {}) {
    return new this.requestClass(controller, action, data, 'POST');
  }
  /**
   *
   * @param controller
   * @param action
   * @param data
   * @returns {ApiRequest}
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
   * @return {ApiRequest}
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
    if(this.isDebug())
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
   * @param url
   * @param response
   * @param contentType
   * @returns {Promise<*|string>}
   */
  static async decodeResponse(url, response, contentType) {
    try {
      if (contentType.includes("application/msgpack")) {
        // Декодирование MessagePack
        const arrayBuffer = response.data;

        if (!(arrayBuffer instanceof ArrayBuffer)) {
          throw new TypeError("Expected response.data to be an ArrayBuffer for MessagePack");
        }

        const data = decode(arrayBuffer);

        if(this.isDebug())
        {
          console.log(url)
          console.log(data)
        }

        return data; // Предполагается, что decode — это функция для MessagePack
      } else if (contentType.includes("application/json")) {
        // Декодирование JSON
        let jsonData;
        if (response.data instanceof ArrayBuffer) {
          // Преобразуем ArrayBuffer в строку
          const decoder = new TextDecoder('utf-8');
          jsonData = decoder.decode(response.data);
        } else {
          jsonData = response.data; // Предполагаем, что данные уже в виде строки
        }

        try {
          return JSON.parse(jsonData);
        }catch (error){

          const enhancedError = new Error(`Ошибка при разборе JSON: ${error.message} - ${url}`);

          // Выбрасываем улучшенную ошибку
          throw enhancedError;
        }
      } else if (contentType.includes("text/plain")) {
        // Возврат текстовых данных как строки
        return response.data.toString();
      } else {
        // Неизвестный формат
        console.warn(`Unsupported Content-Type: ${contentType}`);
        console.warn(response.data);
        return response.data; // Возвращаем данные "как есть"
      }
    } catch (error) {
      console.error(`Failed to decode response with Content-Type: ${contentType}`, error);
      throw error;
    }
  }

  /**
   *
   * @param obj
   * @return {*}
   */
  static async makeRequest({
       url,
       method,
       data = {},
       params = {},
       source,
       headers = {},
       success = () => {},
       error = () => {},
       final = () => {}
  })
  {
    try {
      headers['Accept'] = 'application/json, application/msgpack, text/plain, */*';
      headers['Content-Type'] = 'application/json';

      let api_token = await Api.tokenResolver();
      if (api_token)
      {
        headers["Authorization"] = api_token;
      }

      let response;
      switch (method)
      {
        case 'GET':
          response = await Api.handleGetRequest({ url, data, headers, source });
          break;
        default:
          response = await Api.handleDefaultRequest({ url, method, data, params, headers, source });
          break;
      }

      const contentType = response.headers.get("Content-Type");

      if (!contentType) {
        throw new Error("Missing Content-Type header in the response");
      }

      const responseData = await Api.decodeResponse(url, response, contentType);
      const statusCode = response.status;
      const xhr = response.request;


      try {
        success(responseData, statusCode, xhr);
      }catch (error){
        console.error(error);
      }

      final();

      return responseData;
    } catch(e) {
      if (axios.isAxiosError(e))
      {
        if (e.code === 'ERR_CANCELED') {
          console.warn(`Request to ${url} was canceled.`);
          return; // Просто выходим из обработчика, не вызывая error()
        }

        console.error(`API request to ${url} failed: ${e}`);
        console.error(e);

        const response = e.response;

        //если прервали запрос или проблему с соединение то response может не быть
        if(response)
        {
          const xhr = response.request;

          const contentType = response.headers.get("Content-Type");
          const responseData = await Api.decodeResponse(url, response, contentType);

          const statusCode = response.status;
          const statusText = response.statusText;

          try {
            error(xhr, responseData, statusCode, statusText);
          }catch (error){
            console.error(error);
          }
        }else{
          console.error(e)

          try {
            error({}, {}, '', e.message);
          }catch (error){
            console.error(error);
          }
        }
      }else{
        console.error(e)

        try {
          error({}, {}, '', e.message);
        }catch (error){
          console.error(error);
        }
      }

      final();
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
   * @param source
   * @return {Promise<AxiosResponse<any>>}
   */
  static async handleGetRequest({ url, data, headers, source }) {
    let query = Api.encodeQueryString(data);
    let response;

    data.unique_hash = Api.generateHash();
    const axiosInstance = Api.axiosResolver();

    if (query.length > 5000) {
      data._method = 'GET';
      let request = {
        url: url,
        method: 'POST',
        data: data,
        headers: headers,
        timeout: 0,
        responseType: this.responseType,
        cancelToken: source?.token
      };
      Api.logRequest(request);
      response = await axiosInstance.request(request);
    } else {
      data.timestamp = new Date().getTime();
      let request = {
        url: url,
        method: 'GET',
        params: data,
        headers: headers,
        timeout: 0,
        responseType: this.responseType,
        cancelToken: source?.token
      };
      Api.logRequest(request);
      response = await axiosInstance.request(request);
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
   * @param source
   * @return {Promise<AxiosResponse<any>>}
   */
  static async handleDefaultRequest({ url, method, data, params, headers, source }) {
    params.timestamp = new Date().getTime();

    params.unique_hash = Api.generateHash();
    const axiosInstance = Api.axiosResolver();

    let request = {
      url: url,
      method: method,
      data: data,
      params: params,
      headers: headers,
      timeout: 0,
      responseType: this.responseType,
      cancelToken: source?.token
    };
    Api.logRequest(request);
    return await axiosInstance.request(request);
  }
}