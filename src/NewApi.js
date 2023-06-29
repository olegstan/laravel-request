import NewApiRequest from "./NewApiRequest";
import axios from 'axios';

export default class NewApi
{
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   * @return {NewApiRequest}
   */
  static create(target, focus, data = {}, method = 'GET')
  {
    return new NewApiRequest(target, focus, data, method);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @param method
   * @return {NewApiRequest}
   */
  static createArg(target, focus, arg, data = {}, method = 'GET')
  {
    return new NewApiRequest(target, focus, data, method).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {NewApiRequest}
   */
  static getArg(target, focus, arg, data = {})
  {
    return NewApi.get(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {NewApiRequest}
   */
  static postArg(target, focus, arg, data = {})
  {
    return NewApi.post(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @return {NewApiRequest}
   */
  static putArg(target, focus, arg, data = {})
  {
    return NewApi.put(target, focus, data).addArg(arg);
  }

  /**
   *
   * @param url
   * @param data
   * @return {NewApiRequest}
   */
  static getUrl(url, data = {})
  {
    return (new NewApiRequest('', '', data, 'GET')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {NewApiRequest}
   */
  static postUrl(url, data = {})
  {
    return (new NewApiRequest('', '', data, 'POST')).setUrl(url);
  }

  /**
   *
   * @param url
   * @param data
   * @return {NewApiRequest}
   */
  static putUrl(url, data = {})
  {
    return (new NewApiRequest('', '', data, 'PUT')).setUrl(url);
  }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {NewApiRequest}
   */
  static get(target, focus, data = {})
  {
    return new NewApiRequest(target, focus, data, 'GET');
  }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {NewApiRequest}
   */
  static post(target, focus, data = {})
  {
    return new NewApiRequest(target, focus, data, 'POST');
  }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {NewApiRequest}
   */
  static put(target, focus, data = {})
  {
    return new NewApiRequest(target, focus, data, 'PUT');
  }

  /**
   *
   * @param target
   * @param focus
   * @param id
   * @param data
   * @return {ApiRequest}
   */
  static delete(target, focus, id, data = {})
  {
    return new NewApiRequest(target, focus, data, 'DELETE').addArg(id);
  }

  static makeRequest({url, method, data, params, headers})
  {
    if (typeof headers === 'undefined') {
      headers = {};
    }

    headers['Content-Type'] = 'application/json';

    let api_token = localStorage.getItem('api_token');
    if (api_token) {
      headers["Authorization"] = api_token;
    }

    return axios({
      url: url,
      method: method,
      data: data,
      params: params,
      headers: headers
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw new Error(`API request to ${url} failed: ${error}`);
      });
  }
}