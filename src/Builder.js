export default class Builder {

    static availableMethod = [
        'select',
        'where',
        'orWhere',
        'whereDate',
        'orWhereDate',
        'whereYear',
        'orWhereYear',
        'whereMonth',
        'orWhereMonth',
        'has',
        'whereIn',
        'orWhereIn',
        'whereNotIn',
        'orWhereNotIn',
        'whereHas',
        'orWhereHas',
        'whereHasMorph',
        'orWhereHasMorph',
        'whereDoesntHave',
        'orWhereDoesntHave',
        'whereNull',
        'orWhereNull',
        'whereNotNull',
        'orWhereNotNull',
        'orderBy',
        'groupBy',

        'with',
        'withCount',
        'offset',
        'limit',
        'distinct',
        'owner',
        'whereAbs',
        'contactsOrder',
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