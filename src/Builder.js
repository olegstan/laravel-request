export default class Builder
{
  /**
   *
   * @type {string[]}
   */
  static availableMethod = [
        'select',
        'where',
        'whereDate',
        'whereYear',
        'has',
        'whereIn',
        'whereNotIn',
        'whereHas',
        'orWhereHas',
        'whereDoesntHave',
        'orWhereDoesntHave',
        'orWhere',
        'orderBy',
        'groupBy',
        'whereNull',
        'orWhereNull',
        'whereNotNull',
        'orWhereNotNull',
        /**
         *@property Builder.availableMethod.with array
         */
        'with',
        'withCount',
        'offset',
        'limit',
        'distinct',
        'owner',

        'whereAccount',
        'whereDate',
        'whereYear',

        'whereIncomeType',
        'whereSalaryType',
        'whereSpendingType',
        'whereObligationType',
        'wherePropertyType',
        'whereInvestType',
        'whereCurrencyType',
        'whereAccountType'
    ];

  /**
   *
   */
    constructor() {
        var self = this;
        this.query = [];
        Builder.availableMethod.map(function (val)
        {
            self[val] = function () {
                self.add(val, Array.prototype.slice.call(arguments));
                return self;
            }

          return;
        });
    }

  /**
   *
   * @param method
   * @param args
   * @returns {Builder}
   */
    add(method, args) {
        this.query.push({});
        args.map(function (val, key)
        {
            if (typeof val == 'function')
            {
                var func = val;
                args[key] = {query: new Builder()};
                args[key].query = func(args[key].query).toArray();
            }

          return;
        });
        this.query[this.query.length - 1][method] = args;
        return this;
    }

  /**
   *
   * @returns {Array}
   */
  toArray() {
        return this.query;
    }
};