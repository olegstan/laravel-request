import QueryString from "query-string";

export default class UrlBind
{

  static parse = false;


  static order(query, options)
  {
    if (options.value != '') {
      var order = options.value.split('.');
      query.orderBy(order[0], order[1]);
    } else {
    }
    return query;
  }

  static filter(query, options)
  {
    for (var key in options) {
      var data = options[key];
      if (typeof data === 'object') {
        if (data.value !== '') {
          if (!data.hasOwnProperty('method')) {
            query.where(
              data.hasOwnProperty('field') ? data.field : key,
              data.hasOwnProperty('operator') ? data.operator : '=',
              data.operator === 'LIKE' ? '%' + data.value + '%' : data.value
            );
          } else if (typeof data.method === 'function') {
            data.method(query, data.value);
          }

          const parsed = QueryString.parse(History.location.search);
          parsed[key] = data.value;

        } else {
          const parsed = QueryString.parse(History.location.search);
          if (key in parsed) {
            delete parsed[key];
          }
        }
      }
    }

    return query;
  }

  static getParams(query, options)
  {
    let parsed = [];

    for (var key in options) {
      var data = options[key];
      if (typeof data === 'object') {
        if (data.value !== '') {
          if (!data.hasOwnProperty('method')) {
            query.where(
              data.hasOwnProperty('field') ? data.field : key,
              data.hasOwnProperty('operator') ? data.operator : '=',
              data.operator === 'LIKE' ? '%' + data.value + '%' : data.value
            );
          } else if (typeof data.method === 'function') {
            data.method(query, data.value);
          }

          parsed = QueryString.parse(History.location.search);
          parsed[key] = data.value;
        } else {
          parsed = QueryString.parse(History.location.search);
          if (key in parsed) {
            delete parsed[key];
          }
        }
      }
    }

    return query;
  }

  static urlParse(obj)
  {

    UrlBind.parse = true;

    for (var key in obj) {
      var data = obj[key];
      if (typeof data === 'object') {
        if (data.value === '') {
        }
      }

    }
  }
};