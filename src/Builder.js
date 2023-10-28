export default class Builder {

    static availableMethod = [
        'select',
        'where',
        'whereDate',
        'whereYear',
        'whereMonth',
        'has',
        'whereIn',
        'whereNotIn',
        'whereHas',
        'orWhereHas',
        'whereHasMorph',
        'orWhereHasMorph',
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
        'whereAbs',

        'whereAccount',
        'whereDate',
        'whereYear',
        'whereMonth',

        'whereIncomeType',
        'whereSalaryType',
        'whereSpendingType',
        'whereObligationType',
        'wherePropertyType',
        'whereInvestType',
        'whereCurrencyType',
        'whereAccountType',
        'whereInsuranceType'
    ];

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

    add(method, args) {
        this.query.push({});
        args.map(function (val, key)
        {
            if (typeof val == 'function') {
                var func = val;
                args[key] = {query: new Builder()};
                args[key].query = func(args[key].query).toArray();
            }

          return;
        });
        this.query[this.query.length - 1][method] = args;
        return this;
    }

    toArray() {
        return this.query;
    }
};