import Api from "./Api";
import ApiRequest from "./ApiRequest";
import NotifyManager from "../../interface/notify/NotifyManager";

/**
 *
 */
export default class NewApiRequest extends ApiRequest
{

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
        if(response && response.result === 'success')
        {
          if (response.meta && response.meta.text)
          {
            notify = this.notify ? NotifyManager.info('Успешно', response.meta.text) : null
          }
          self.toBind(response);
          self.resetBindErrors();
          success(response, status, xhr);
        }
      },
      error: (xhr, status, errorText) => {
        this.handleError(notify, error, xhr, status, errorText);
      }
    });

    return this;
  }
};