import ApiRequest from "./ApiRequest";
import $ from 'jquery';

export default class Api
{
  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   * @returns {ApiRequest}
   */
    static create(target, focus, data = {}, method = 'GET')
    {
        return new ApiRequest(target, focus, data, method);
    }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @param method
   * @returns {ApiRequest}
   */
    static createArg(target, focus, arg, data = {}, method = 'GET')
    {
        return new ApiRequest(target, focus, data, method).addArg(arg);
    }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @returns {ApiRequest}
   */
    static getArg(target, focus, arg, data = {})
    {
        return Api.get(target, focus, data).addArg(arg);
    }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @returns {ApiRequest}
   */
    static postArg(target, focus, arg, data = {})
  {
        return Api.post(target, focus, data).addArg(arg);
    }

  /**
   *
   * @param target
   * @param focus
   * @param arg
   * @param data
   * @returns {ApiRequest}
   */
    static putArg(target, focus, arg, data = {})
  {
        return Api.put(target, focus, data).addArg(arg);
    }

  /**
   *
   * @param url
   * @param data
   * @returns {*}
   */
    static getUrl(url, data = {})
    {
      return (new ApiRequest('', '', data, 'GET')).setUrl(url);
    }

  /**
   *
   * @param url
   * @param data
   * @returns {*}
   */
    static postUrl(url, data = {})
    {
      return (new ApiRequest('', '', data, 'POST')).setUrl(url);
    }

  /**
   *
   * @param url
   * @param data
   * @returns {*}
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
    static get(target, focus, data = {})
    {
        return new ApiRequest(target, focus, data, 'GET');
    }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
    static post(target, focus, data = {})
    {
        return new ApiRequest(target, focus, data, 'POST');
    }

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @returns {ApiRequest}
   */
    static put(target, focus, data = {})
    {
        return new ApiRequest(target, focus, data, 'PUT');
    }

  /**
   *
   * @param target
   * @param focus
   * @param id
   * @param data
   * @returns {ApiRequest}
   */
    static delete(target, focus, id, data = {})
    {
        return new ApiRequest(target, focus, data, 'DELETE').addArg(id);
    }

    /**
     *
     * @param obj
     */
    static makeRequest(obj)
    {
        var token = 'api_token';
        obj.xhrFields = {withCredentials: true};

        if (typeof obj["data"] === 'undefined') {
            obj["data"] = {};
        }
        if (typeof obj["headers"] === 'undefined') {
            obj["headers"] = {};
        }

        if (token === 'csrf_token') {
            //csrf_token
            obj["headers"]["X-CSRF-TOKEN"] = $("meta[name='_token']").attr("content");
        } else if (token === 'api_token') {
            //access_token
            let api_token = localStorage.getItem('api_token');

            // console.info(api_token);
            if (api_token)
            {
                obj["data"]["api_token"] = api_token;
            }
        }

        if (obj.method === 'PUT') {
            obj.method = 'POST';
            obj.data._method = 'PUT';
        }
        if (obj.method === 'DELETE') {
            obj.method = 'POST';
            obj.data._method = 'DELETE';
        }

        $.ajax(obj);
    }
};