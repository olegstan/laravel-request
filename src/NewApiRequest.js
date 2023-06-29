import Builder from "./Builder";
import Binding from "./Binding";
import Api from "./Api";
import NotifyManager from "../../interface/notify/NotifyManager";

/**
 *
 */
export default class ApiRequest
{
  /**
   *
   * @type {string}
   */
  url = '';

  /**
   *
   * @type {XMLHttpRequest|null}
   */
  xhr = null;

  /**
   *
   * @param target
   * @param focus
   * @param data
   * @param method
   */
  constructor(target, focus, data = {}, method = 'GET')
  {
    let self = this;
    this.target = target;
    this.focus = focus;
    this.method = method;
    this.data = data;
    this.arguments = [];
    this.builder = new Builder();
    this.notify = true;
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

  setUrl(url)
  {
    this.url = url;

    return this;
  }

  /**
   *
   * @param arg
   * @returns {ApiRequest}
   */
  addArg(arg)
  {
    if (Array.isArray(arg)) {
      this.arguments = this.arguments.concat(arg);
    } else {
      this.arguments.push(arg);
    }
    return this;
  }

  /**
   *
   * @param success
   * @param error
   * @returns {*}
   */
  first(success = function () {
  }, error = function () {
  })
  {
    this.data['paginateType'] = 'first';
    return this.call(success, error);
  }

  /**
   *
   * @param success
   * @param error
   * @returns {*}
   */
  all(success = function () {
  }, error = function () {
  })
  {
    this.data['paginateType'] = 'all';
    return this.call(success, error);
  }

  /**
   *
   * @param page
   * @param perPage
   * @param success
   * @param error
   * @returns {*}
   */
  paginate(page = 1, perPage = 10, success = function () {
  }, error = function () {
  })
  {
    this.data['paginateType'] = 'paginate';
    this.data['page'] = page;
    this.data['perPage'] = perPage;
    return this.call(success, error);
  }

  getUrl()
  {
    return process.env.REACT_APP_API_URL + '/api/v1/call/' + this.target + '/' + this.focus;
  }

  /**
   *
   * @param success
   * @param error
   * @param params
   * @returns {ApiRequest}
   */
  call(success = function () {
  }, error = function () {
  }, params = {})
  {
    let self = this;
    this.callSuccess = success;
    this.callError = error;

    let notify = null;
    this.xhr = Api.makeRequest({
      url: process.env.REACT_APP_API_URL + '/api/v1/call/' + this.target + '/' + this.focus,
      method: this.method,
      data: {
        arguments: this.arguments,
        query: this.builder.toArray(),
        data: this.data,
      },
      ...params,
      dataType: "json",
      success: (response, status, xhr) => {
        if (response && response.result === 'success') {
          if (response.meta && response.meta.text) {
            notify = this.notify ? NotifyManager.info('Успешно', response.meta.text) : null
          }
          self.toBind(response);
          self.resetBindErrors();
          success(response, status, xhr);
        }
      },
      error: (xhr) => {
        try {
          switch (xhr.status) {
            case 0:
              notify = this.notify ? NotifyManager.error('Ошибка') : null;
              break;
            case 404:

              break;
            case 422:
              if (xhr?.responseJSON?.meta.text) {
                notify = this.notify ? NotifyManager.error('Ошибка', xhr.responseJSON.meta.text) : null;
              }
              break;
            default:
              notify = this.notify ? NotifyManager.error('Ошибка', xhr.status === 500 ? 'Произошла ошибка!' : xhr?.responseJSON?.meta?.text) : null;
              break;
          }
        } catch (e) {
          console.error(e);
          notify = this.notify ? NotifyManager.error('Ошибка') : null;
        }
        self.toBindErrors(xhr);
        error(xhr);
      }
    });

    return this;
  }

  callSync(success = function () {
  }, error = function () {
  })
  {
    return this.call(success, error, {async: false});
  }

  callUrl(success = function () {
  }, error = function () {
  }, params = {})
  {
    let self = this;
    this.callSuccess = success;
    this.callError = error;

    let notify = null;
    Api.makeRequest({
      url: this.url,
      method: this.method,
      data: {
        arguments: this.arguments,
        query: this.builder.toArray(),
        data: this.data,
      },
      ...params,
      success: (response, status, xhr) => {
        if (response && response.result === 'success') {
          if (response.meta && response.meta.text) {
            notify = this.notify ? NotifyManager.info('Успешно', response.meta.text) : null
          }
          self.toBind(response);
          self.resetBindErrors();
          success(response, status, xhr);
        }
      },
      error: (xhr) => {
        try {
          switch (xhr.status) {
            case 0:
              notify = this.notify ? NotifyManager.error('Ошибка') : null;
              break;
            case 404:

              break;
            case 422:
              if (xhr?.responseJSON?.meta.text) {
                notify = this.notify ? NotifyManager.error('Ошибка', xhr.responseJSON.meta.text) : null;
              }
              break;
            default:
              notify = this.notify ? NotifyManager.error('Ошибка', xhr.status === 500 ? 'Ошибка' : xhr?.responseJSON?.meta?.text) : null;
              break;
          }
        } catch (e) {
          console.error(e);
          notify = this.notify ? NotifyManager.error('Ошибка') : null;
        }
        self.toBindErrors(xhr);
        error(xhr);
      }
    });

    return this;
  }

  /**
   *
   * @param obj
   * @param item
   * @param rerender
   * @param cb
   */
  bind(obj, item, rerender = false, cb)
  {
    let key = 'data';
    let self = this;
    if (typeof item == 'object') {
      this.responseBinding = [];
      item.map(function (data) {
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
  toBind(response)
  {
    if (this.responseBinding !== null) {
      if (Array.isArray(this.responseBinding)) {
        this.responseBinding.map(function (data) {
          data.fire(response);

          return;
        })
      } else {
        this.responseBinding.fire(response);
      }
    }
  }

  resetBindErrors()
  {
    if (this.responseBindingErrors !== null) {
      this.responseBindingErrors.fire({});
    }
  }

  toBindErrors(response = {})
  {
    if (this.responseBindingErrors !== null && 'responseJSON' in response && typeof response.responseJSON === 'object') {
      this.responseBindingErrors.fire(response.responseJSON.meta.errors);
    }
  }

  withValidateForm(obj, item = 'formErrors', key = 'meta')
  {
    this.responseBindingErrors = new Binding(obj, item, key);
    return this;
  }

  withoutNotify()
  {
    this.notify = false;
    return this;
  }
};