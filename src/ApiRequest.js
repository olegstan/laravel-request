import Api from "./Api";
import Builder from "./Builder";
import Binding from "./Binding";
import axios from "axios";

/**
 *
 */
export default class ApiRequest {
  /**
   *
   * @type {string}
   */
  url = '';


  /**
   *
   * @type {null}
   */
  static notifyClass = null;

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   */
  constructor(target, focus, data = {}, method = 'GET') {
    let self = this;
    this.domain = Api.domainResolver();
    this.target = target;
    this.focus = focus;
    this.method = method;
    this.data = data;
    this.headers = [];
    this.arguments = [];
    this.builder = new Builder();
    this.notifyCallback = (status) => {return true};
    this.responseBinding = null;
    this.responseBindingErrors = null;

    this.callSuccess = () => {

    };
    this.callError = () => {

    };
    this.callFinal = () => {

    };
    this.source = null;

    Builder.availableMethod.map(function (val) {
      self[val] = function () {
        self.builder.add(val, Array.prototype.slice.call(arguments));
        return self;
      }

      return;
    });
  }

  /**
   *
   * @return {null}
   */
  getNotifyManager()
  {
    return ApiRequest.notifyClass;
  }

  /**
   *
   * @param url
   * @return {ApiRequest}
   */
  setUrl(url)
  {
    this.url = url;

    return this;
  }

  /**
   *
   * @param domain
   * @return {ApiRequest}
   */
  setDomain(domain)
  {
    this.domain = domain;

    return this;
  }

  /**
   *
   * @param arg
   * @returns {ApiRequest}
   */
  addArg(arg) {
    if (Array.isArray(arg)) {
      this.arguments = this.arguments.concat(arg);
    } else {
      this.arguments.push(arg);
    }
    return this;
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @returns {ApiRequest}
   */
  first(
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {}
  ) {
    this.data['paginateType'] = 'first';
    return this.executeRequest(successCallback, errorCallback, finalCallback);
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @returns {ApiRequest}
   */
  all(
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {}
  ) {
    this.data['paginateType'] = 'all';
    return this.executeRequest(successCallback, errorCallback, finalCallback);
  }

  /**
   *
   * @param page
   * @param perPage
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @returns {ApiRequest}
   */
  paginate(
      page = 1,
      perPage = 10,
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {}
  ) {
    this.data['paginateType'] = 'paginate';
    this.data['page'] = page;
    this.data['perPage'] = perPage;
    return this.executeRequest(successCallback, errorCallback, finalCallback);
  }

  /**
   *
   * @param fields
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @returns {ApiRequest}
   */
  pluck(
      fields,
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {}
  ) {
    this.data['paginateType'] = 'pluck';
    this.data['fields'] = fields;
    return this.executeRequest(successCallback, errorCallback, finalCallback);
  }

  /**
   *
   * @return {string}
   */
  getUrl()
  {
    return this.domain + '/api/v1/call/' + this.target + '/' + this.focus;
  }

  /**
   * вернет токен для отмены запроса
   *
   * @returns {null}
   */
  getSource()
  {
    return this.source;
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @param byUrl
   * @param finalCallback
   * @returns {ApiRequest}
   */
  call(
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {},
      params = {},
      dataKey = 'data',
      argumentsKey = 'arguments',
      queryKey = 'query',
      byUrl = false,
  )
  {
    return this.executeRequest(successCallback, errorCallback, finalCallback, params, dataKey, argumentsKey, queryKey, byUrl)
  }

  /**
   * Constructs request data object based on provided keys
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @return {object} data object for request
   */
  constructRequestData(dataKey, argumentsKey, queryKey) {
    let data = {};

    if (argumentsKey)
    {
      data[argumentsKey] = this.arguments;
    }
    if (queryKey)
    {
      data[queryKey] = this.builder.toArray();
    }

    if (dataKey)
    {
      data[dataKey] = this.data;
    }else{
      data = this.data;
    }

    return data;
  }

  /**
   * Generates error notification based on the xhr response
   * @param response
   * @param responseData
   * @param errorText
   * @return {object|null} notification object
   */
  getErrorNotification(response, responseData, errorText) {
    let notify = null;

    if (response.readyState === 4) {
      switch (response.status) {
        case 0:
          notify = this.getNotifyManager().error('Ошибка', errorText);
          break;
        case 404:
          notify = this.getNotifyManager().error('Ошибка', 'Недостаточно прав или урл не найден. Попробуйте повторно авторизоваться.');
          // handle 404 specifically if needed
          break;
        default:
          notify = this.defaultErrorMessage(responseData, errorText);
      }
    } else if (response.readyState === 0) {
      notify = this.getNotifyManager().errorOnce('network_error', 'Ошибка', ' (Network Error) или невозможность получения доступа к сети');
    } else {
      notify = this.getNotifyManager().error('Ошибка', errorText);
    }

    return notify;
  }

  /**
   *
   * @param responseData
   * @param errorText
   * @return {null}
   */
  defaultErrorMessage(responseData, errorText) {
    let notify = null;

    if (responseData?.meta?.text) {
      notify = this.getNotifyManager().error('Ошибка', responseData?.meta.text);
    } else if (responseData?.meta?.message) {
      notify = this.getNotifyManager().error('Ошибка', responseData?.meta.message);
    } else if (typeof errorText === 'string') {
      notify = this.getNotifyManager().error('Ошибка', errorText);
    } else if (errorText?.message) {
      notify = this.getNotifyManager().error('Ошибка', errorText.message);
    }

    return notify;
  }


  /**
   * Provides a fallback notification in case of an exception
   * @param e
   * @return {object|null} notification object
   */
  getErrorNotificationFallback(e) {
    console.error(e);
    if (e?.message) return this.getNotifyManager().error('Ошибка', e.message);
    return this.getNotifyManager().error('Ошибка');
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @param byUrl
   * @returns {ApiRequest}
   */
  executeRequest(
      successCallback,
      errorCallback,
      finalCallback,
      params = {},
      dataKey = 'data',
      argumentsKey = 'arguments',
      queryKey = 'query',
      byUrl = false,
  ) {
    let self = this;
    this.callSuccess = successCallback;
    this.callError = errorCallback;
    this.callFinal = finalCallback;
    this.source = axios.CancelToken.source();

    let url = byUrl ? this.url : this.getUrl();
    let notify = null;
    let data = this.constructRequestData(dataKey, argumentsKey, queryKey);

    Api.makeRequest({
      url: url,
      method: this.method,
      data: data,
      params: params,
      source: this.source,
      success: (response, status, xhr) => {
        if (response && response.result === 'success') {
          notify = this.handleSuccessNotification(response, xhr.status);
          self.toBind(response);
          self.resetBindErrors();
          successCallback(response, status, xhr);
        }
      },
      error: (response, responseData, status, errorText) => {
        this.handleError(notify, errorCallback, response, responseData, errorText);
      },
      final: finalCallback
    });

    return this;
  }

  /**
   * Handles the success notification
   * @param response
   * @param status
   * @return {object|null} notification object
   */
  handleSuccessNotification(response, status) {
    let notify = null;
    let result = this.notifyCallback(status);

    if (result) {
      if (response?.meta?.text) {
        notify = this.getNotifyManager().info('Успешно', response.meta.text);
      } else if (response?.meta?.message) {
        notify = this.getNotifyManager().info('Успешно', response.meta.message);
      }
    }

    return notify;
  }

  /**
   *
   *
   * @param notify
   * @param errorCallback
   * @param response
   * @param responseData
   * @param errorText
   */
  handleError(notify, errorCallback, response, responseData, errorText)
  {
    try {
      let result = this.notifyCallback(response.status);
      if (result) notify = this.getErrorNotification(response, responseData, errorText);
    } catch (e) {
      notify = this.getErrorNotificationFallback(e);
    }

    this.toBindErrors(responseData);
    errorCallback(response, responseData);
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param finalCallback
   * @returns {ApiRequest}
   */
  callSync(
      successCallback = (response) => {},
      errorCallback = () => {},
      finalCallback = () => {}
  ) {
    return this.executeRequest(successCallback, errorCallback, finalCallback, {async: false});
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @param finalCallback
   * @returns {ApiRequest}
   */
  callUrl(
      successCallback = (response) => {},
      errorCallback = () => {},
      params = {},
      dataKey = 'data',
      argumentsKey = 'arguments',
      queryKey = 'query',
      finalCallback = () => {}
    )
  {
    return this.executeRequest(successCallback, errorCallback, finalCallback, params, dataKey, argumentsKey, queryKey, true)
  }

  /**
   *
   * @param obj
   * @param item
   * @param rerender
   * @param cb
   */
  bind(obj, item, rerender = false, cb) {
    let key = 'data';
    let self = this;
    if (typeof item == 'object') {
      this.responseBinding = [];
      item.map(function (data)
      {
        self.responseBinding[self.responseBinding.length] = new Binding(obj, data[0], data[1], rerender, cb);

        return;
      })
    } else {
      this.responseBinding = new Binding(obj, item, key, rerender, cb);
    }

    return this;
  }

  /**
   *
   * @param response
   */
  toBind(response) {
    if (this.responseBinding !== null) {
      if (Array.isArray(this.responseBinding)) {
        this.responseBinding.map(function (data)
        {
          data.fire(response);

          return;
        })
      } else {
        this.responseBinding.fire(response);
      }
    }
  }

  /**
   *
   */
  resetBindErrors() {
    if (this.responseBindingErrors !== null) {
      this.responseBindingErrors.fire({});
    }
  }

  /**
   *
   * @param responseData
   */
  toBindErrors(responseData = {})
  {
    if (this?.responseBindingErrors && responseData && typeof responseData === 'object' && responseData?.meta?.errors)
    {
      this.responseBindingErrors?.fire(responseData.meta.errors);
    }
  }

  /**
   *
   * @param obj
   * @param item
   * @param key
   * @return {ApiRequest}
   */
  withValidateForm(obj, item = 'formErrors', key = 'meta') {
    this.responseBindingErrors = new Binding(obj, item, key);
    return this;
  }

  /**
   *
   * @param callback
   * @return {ApiRequest}
   */
  withoutNotify(callback)
  {
    //callback(status){} будем проверять статус и по условию если true не показывать уведомление

    if(typeof callback === "undefined")
    {
      this.notifyCallback = (status) => {return false};
    }else{
      this.notifyCallback = callback;
    }

    return this;
  }
};