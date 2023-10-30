import NewApiRequest from "./NewApiRequest";
import axios from 'axios';
import Api from "./Api";

export default class NewApi extends Api
{
  /**
   *
   * @type {ApiRequest}
   */
  static requestClass = NewApiRequest;

  static async makeRequest({url, method, data, dataType, params, headers, success, error})
  {
    try {
      if (typeof headers === 'undefined') {
        headers = {};
      }

      if(dataType === 'json')
      {
        headers['Content-Type'] = 'application/json';
      }

      let api_token = localStorage.getItem('api_token');
      if (api_token)
      {
        headers["Authorization"] = api_token;
      }

      const response = await axios({
        url: url,
        method: method,
        data: data,
        params: params,
        headers: headers
      });

      // get status code
      const statusCode = response.status;

      // get full response object
      const xhr = response;

      const data = response.data;

      success(data, statusCode, xhr);

    } catch(e) {
      throw new Error(`API request to ${url} failed: ${error}`);

      const xhr = e.response;

      // status code
      const statusCode = e.response.status;

      // status text
      const statusText = e.response.statusText;

      error(xhr, statusCode, statusText);
    }
  }
}