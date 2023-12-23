import ApiRequest from "./ApiRequest";
import axios from "axios";

export default class Api {

  /**
   *
   * @type {ApiRequest}
   */
  static requestClass = ApiRequest;

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   * @return {ApiRequest}
   */
  static create(target, focus, data = {}, method = 'GET') {
    return new this.requestClass(target, focus, data, method);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @param method
   * @return {ApiRequest}
   */
  static createArg(target, focus, arg, data = {}, method = 'GET') {
    return new this.requestClass(target, focus, data, method).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {ApiRequest}
   */
  static getArg(target, focus, arg, data = {}) {
    return this.get(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {ApiRequest}
   */
  static postArg(target, focus, arg, data = {}) {
    return this.post(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {ApiRequest}
   */
  static putArg(target, focus, arg, data = {}) {
    return this.put(target, focus, data).addArg(arg);
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
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static get(target, focus, data = {}) {
    return new this.requestClass(target, focus, data, 'GET');
  }
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static post(target, focus, data = {}) {
    return new this.requestClass(target, focus, data, 'POST');
  }
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static put(target, focus, data = {}) {
    return new this.requestClass(target, focus, data, 'PUT');
  }

  /**
   *
   * @param target
   * @param focus
   * @param id
   * @param data
   * @return {ApiRequest}
   */
  static delete(target, focus, id, data = {}) {
    return new this.requestClass(target, focus, data, 'DELETE').addArg(id);
  }

  /**
   *
   * @param obj
   * @return {*}
   */
  static async makeRequest({url, method, data = {}, params = {}, headers = {}, success = () => {}, error = () => {}})
  {
    try {
      headers['Content-Type'] = 'application/json';

      let api_token = localStorage.getItem('api_token');
      if (api_token)
      {
        headers["Authorization"] = api_token;
      }

      let response;
      switch (method)
      {
        case 'GET':
          data.timestamp = new Date().getTime();

          response = await axios.request({
            url: url,
            method: method,
            params: data,
            headers: headers
          });
          break;
        default:
          params.timestamp = new Date().getTime();

          response = await axios.request({
            url: url,
            method: method,
            data: data,
            params: params,
            headers: headers
          });
          break;
      }


      // get status code
      const statusCode = response.status;

      // get full response object
      const xhr = response.request;

      const responseData = response.data;

      try {
        success(responseData, statusCode, xhr);
      }catch (error){
        console.error(error);
      }

      return responseData;
    } catch(e) {
      console.error(`API request to ${url} failed: ${e}`);

      const xhr = e.request;

      //написано для обратной совместимости после перехода с jquery
      try{
        xhr.responseJSON = e.response.data;
      }catch (errorJson){
        console.log(errorJson)
      }

      // status code
      let statusCode = e.request?.status;

      // status text
      let statusText = e.request?.statusText || e.message;

      try {
        error(xhr, statusCode, statusText);
      }catch (error){
        console.error(error);
      }
    }
  }
}