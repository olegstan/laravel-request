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
    this.domain = process.env.REACT_APP_API_URL;
    this.target = target;
    this.focus = focus;
    this.method = method;
    this.data = data;
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

  getNotifyManager()
  {
    return ApiRequest.notifyClass;
  }

  setUrl(url)
  {
    this.url = url;

    return this;
  }

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
    return this.call(successCallback, errorCallback);
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
    return this.call(successCallback, errorCallback);
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
    return this.call(successCallback, errorCallback);
  }

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
   * @return {ApiRequest}
   */
  call(successCallback = (r) => {
  }, errorCallback = () => {
  }, params = {}, dataKey = 'data', argumentsKey = 'arguments', queryKey = 'query', byUrl = false) {
    let self = this;
    this.callSuccess = successCallback;
    this.callError = errorCallback;

    let url = this.domain + '/api/v1/call/' + this.target + '/' + this.focus;

    if(byUrl)
    {
      url = this.url;
    }

    let notify = null;

    let data = {};

    if(argumentsKey)
    {
      data[argumentsKey] = this.arguments;
    }

    if(queryKey)
    {
      data[queryKey] = this.builder.toArray();
    }

    if(dataKey)
    {
      data[dataKey] = this.data;
    }else{
      data = this.data;
    }

    Api.makeRequest({
      url: url,
      method: this.method,
      data: data,
      params: params,
      success: (response, status, xhr) => {
        if(response && response.result === 'success')
        {
          if (response.meta && response.meta.text)
          {
            let result = this.notifyCallback(xhr.status);

            if(result)
            {
              notify = this.getNotifyManager().info('Успешно', response.meta.text)
            }
          }
          self.toBind(response);
          self.resetBindErrors();
          successCallback(response, status, xhr);
        }
      },
      error: (xhr, status, errorText) => {
        this.handleError(notify, errorCallback, xhr, status, errorText);
      }
    });

    return this;
  }

  /**
   *
   * @param notify
   * @param errorCallback
   * @param xhr
   * @param status
   * @param errorText
   */
  handleError(notify, errorCallback, xhr, status, errorText)
  {
    if (xhr.readyState === 4) {
      try {
        let result = this.notifyCallback(xhr.status);

        if(result)
        {
          switch (xhr.status) {
            case 0://точно ошибка
              notify = this.getNotifyManager().error('Ошибка', errorText);
              break;
            case 404:

              break;
            default:
              if(xhr?.responseJSON?.meta.text)
              {
                notify = this.getNotifyManager().error('Ошибка', xhr.responseJSON.meta.text);
              }else if(xhr?.responseJSON?.meta.message)
              {
                notify = this.getNotifyManager().error('Ошибка', xhr.responseJSON.meta.message);
              }else{
                if(typeof errorText === 'string')
                {
                  notify = this.getNotifyManager().error('Ошибка', errorText);
                }else if(errorText?.message && typeof errorText.message === 'string'){
                  notify = this.getNotifyManager().error('Ошибка', errorText.message);
                }
              }
              break;
          }
        }
      } catch (e) {
        console.error(e);
        notify = this.notify ? this.getNotifyManager().error('Ошибка') : null;
      }
    }
    else if (xhr.readyState === 0) {
      notify = this.getNotifyManager().errorOnce('network_error', 'Ошибка', ' (Network Error) или невозможность получения доступа к сети');
    }
    else {
      if(typeof errorText === 'string')
      {
        notify = this.getNotifyManager().error('Ошибка', errorText);
      }else if(errorText?.message && typeof errorText.message === 'string'){
        notify = this.getNotifyManager().error('Ошибка', errorText.message);
      }
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
    return this.call(successCallback, errorCallback, {async: false});
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
    return this.call(successCallback, errorCallback, params, dataKey, argumentsKey, queryKey, true)
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

  resetBindErrors() {
    if (this.responseBindingErrors !== null) {
      this.responseBindingErrors.fire({});
    }
  }

  toBindErrors(response = {})
  {
    if (this.responseBindingErrors !== null && 'responseJSON' in response && typeof response.responseJSON === 'object')
    {
      this.responseBindingErrors.fire(response.responseJSON.meta.errors);
    }
  }

  withValidateForm(obj, item = 'formErrors', key = 'meta') {
    this.responseBindingErrors = new Binding(obj, item, key);
    return this;
  }

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