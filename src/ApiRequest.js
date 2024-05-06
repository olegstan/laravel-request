import Api from "./Api";
import Builder from "./Builder";
import Binding from "./Binding";

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
   * @returns {*}
   */
  first(successCallback = (r) => {
  }, errorCallback = () => {
  }) {
    this.data['paginateType'] = 'first';
    return this.executeRequest(successCallback, errorCallback);
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @returns {*}
   */
  all(successCallback = (r) => {
  }, errorCallback = () => {
  }) {
    this.data['paginateType'] = 'all';
    return this.executeRequest(successCallback, errorCallback);
  }

  /**
   *
   * @param page
   * @param perPage
   * @param successCallback
   * @param errorCallback
   * @returns {*}
   */
  paginate(page = 1, perPage = 10, successCallback = (r) => {
  }, errorCallback = () => {
  }) {
    this.data['paginateType'] = 'paginate';
    this.data['page'] = page;
    this.data['perPage'] = perPage;
    return this.executeRequest(successCallback, errorCallback);
  }

  /**
   *
   * @param fields
   * @param successCallback
   * @param errorCallback
   * @return {ApiRequest}
   */
  pluck(fields, successCallback = (r) => {
  }, errorCallback = () => {
  }) {
    this.data['paginateType'] = 'pluck';
    this.data['fields'] = fields;
    return this.executeRequest(successCallback, errorCallback);
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
   *
   * @param successCallback
   * @param errorCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @param byUrl
   * @return {ApiRequest}
   */
  call(successCallback = (r) => {
  }, errorCallback = () => {
  }, params = {}, dataKey = 'data', argumentsKey = 'arguments', queryKey = 'query', byUrl = false)
  {
    return this.executeRequest(successCallback, errorCallback, params, dataKey, argumentsKey, queryKey, byUrl)
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
   * @param xhr
   * @param errorText
   * @return {object|null} notification object
   */
  getErrorNotification(xhr, errorText) {
    let notify = null;

    if (xhr.readyState === 4) {
      switch (xhr.status) {
        case 0:
          notify = this.getNotifyManager().error('Ошибка', errorText);
          break;
        case 404:
          // handle 404 specifically if needed
          break;
        default:
          notify = this.defaultErrorMessage(xhr, errorText);
      }
    } else if (xhr.readyState === 0) {
      notify = this.getNotifyManager().errorOnce('network_error', 'Ошибка', ' (Network Error) или невозможность получения доступа к сети');
    } else {
      notify = this.getNotifyManager().error('Ошибка', errorText);
    }

    return notify;
  }

  /**
   *
   * @param xhr
   * @param errorText
   * @return {null}
   */
  defaultErrorMessage(xhr, errorText) {
    let notify = null;

    if (xhr?.responseJSON?.meta.text) {
      notify = this.getNotifyManager().error('Ошибка', xhr.responseJSON.meta.text);
    } else if (xhr?.responseJSON?.meta.message) {
      notify = this.getNotifyManager().error('Ошибка', xhr.responseJSON.meta.message);
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
   * Function to handle the common request logic
   * @param successCallback
   * @param errorCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @param byUrl
   * @return {ApiRequest}
   */
  executeRequest(successCallback, errorCallback, params = {}, dataKey = 'data', argumentsKey = 'arguments', queryKey = 'query', byUrl = false) {
    let self = this;
    this.callSuccess = successCallback;
    this.callError = errorCallback;

    let url = byUrl ? this.url : this.getUrl();
    let notify = null;
    let data = this.constructRequestData(dataKey, argumentsKey, queryKey);

    Api.makeRequest({
      url: url,
      method: this.method,
      data: data,
      params: params,
      success: (response, status, xhr) => {
        if (response && response.result === 'success') {
          notify = this.handleSuccessNotification(response, xhr.status);
          self.toBind(response);
          self.resetBindErrors();
          successCallback(response, status, xhr);
        }
      },
      error: (xhr, status, errorText) => {
        this.handleError(notify, errorCallback, xhr, errorText);
      }
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
      if (response?.meta.text) {
        notify = this.getNotifyManager().info('Успешно', response.meta.text);
      } else if (response?.meta.message) {
        notify = this.getNotifyManager().info('Успешно', response.meta.message);
      }
    }

    return notify;
  }

  /**
   *
   * @param notify
   * @param errorCallback
   * @param xhr
   * @param errorText
   */
  handleError(notify, errorCallback, xhr, errorText)
  {
    console.log('------------');
    console.log(xhr);
    console.log(errorText);

    try {
      let result = this.notifyCallback(xhr.status);
      if (result) notify = this.getErrorNotification(xhr, errorText);
    } catch (e) {
      notify = this.getErrorNotificationFallback(e);
    }

    this.toBindErrors(xhr);
    errorCallback(xhr);
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @return {ApiRequest}
   */
  callSync(successCallback = (r) => {
  }, errorCallback = () => {
  }) {
    return this.executeRequest(successCallback, errorCallback, {async: false});
  }

  /**
   *
   * @param successCallback
   * @param errorCallback
   * @param params
   * @param dataKey
   * @param argumentsKey
   * @param queryKey
   * @return {ApiRequest}
   */
  callUrl(successCallback = (r) => {
  }, errorCallback = () => {
  }, params = {}, dataKey = 'data', argumentsKey = 'arguments', queryKey = 'query')
  {
    return this.executeRequest(successCallback, errorCallback, params, dataKey, argumentsKey, queryKey, true)
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
   * @param response
   */
  toBindErrors(response = {})
  {
    if (this.responseBindingErrors !== null && 'responseJSON' in response && typeof response.responseJSON === 'object')
    {
      this.responseBindingErrors.fire(response.responseJSON.meta.errors);
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