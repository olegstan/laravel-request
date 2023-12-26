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
          let query = Api.encodeQueryString(data);

          if(query.length > 5000)
          {
            //replace to POST if GET url is too long
            data._method = 'GET';

            response = await axios.request({
              url: url,
              method: 'PUT',//post не будет работать
              data: data,
              headers: headers
            });

          }else{
            data.timestamp = new Date().getTime();

            response = await axios.request({
              url: url,
              method: method,
              params: data,
              headers: headers
            });
          }


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