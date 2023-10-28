import ApiRequest from "./ApiRequest";
import $ from 'jquery';

export default class Api {
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   * @return {ApiRequest}
   */
  static create(target, focus, data = {}, method = 'GET') {
    return new ApiRequest(target, focus, data, method);
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
    return new ApiRequest(target, focus, data, method).addArg(arg);
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
    return Api.get(target, focus, data).addArg(arg);
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
    return Api.post(target, focus, data).addArg(arg);
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
    return Api.put(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
   */
  static getUrl(url, data = {})
  {
    return (new ApiRequest('', '', data, 'GET')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
   */
  static postUrl(url, data = {})
  {
    return (new ApiRequest('', '', data, 'POST')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {ApiRequest}
   */
  static putUrl(url, data = {})
  {
    return (new ApiRequest('', '', data, 'PUT')).setUrl(url);
  }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static get(target, focus, data = {}) {
    return new ApiRequest(target, focus, data, 'GET');
  }
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static post(target, focus, data = {}) {
    return new ApiRequest(target, focus, data, 'POST');
  }
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
  static put(target, focus, data = {}) {
    return new ApiRequest(target, focus, data, 'PUT');
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
    return new ApiRequest(target, focus, data, 'DELETE').addArg(id);
  }

  static makeRequest(obj) {
    obj.xhrFields = {withCredentials: true};

    if (typeof obj["data"] === 'undefined') {
      obj["data"] = {};
    }
    if (typeof obj["headers"] === 'undefined') {
      obj["headers"] = {};
    }


    let api_token = localStorage.getItem('api_token');

    if (api_token)
    {
      obj["headers"]["Authorization"] = api_token;
    }

    let one_time_token = localStorage.getItem('token');

    if (one_time_token)
    {
      obj["data"]['token'] = one_time_token;
    }

    // obj["data"]['debug'] = true;

    return $.ajax(obj)
  }
}