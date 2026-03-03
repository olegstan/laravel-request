import { expect } from 'chai';
import { Api } from '../src/index.js';
import Builder from '../src/Builder.js';

describe('Builder callback return guard', () => {
  it('throws an Error when callback does not return Builder instance', () => {
    const builder = new Builder();

    const build = () => {
      builder.whereHas('category', (q) => {
        q.where('visible', true);
        // нет return q;
      });
    };

    expect(build).to.throw(
      Error,
      'Callback for "whereHas" must return instance of Builder.'
    );
  });

  it('throws an Error when callback returns non-Builder value', () => {
    const builder = new Builder();

    const build = () => {
      builder.whereHas('category', () => {
        return { some: 'object' };
      });
    };

    expect(build).to.throw(
      Error,
      'Callback for "whereHas" must return instance of Builder.'
    );
  });

  it('throws an Error for where() when callback does not return Builder instance', () => {
    const builder = new Builder();

    const build = () => {
      builder.where((q) => {
        q.where('id', 1);
        // нет return q;
      });
    };

    expect(build).to.throw(
      Error,
      'Callback for "where" must return instance of Builder.'
    );
  });

  it('throws an Error for where() when callback returns non-Builder value', () => {
    const builder = new Builder();

    const build = () => {
      builder.where(() => {
        return 'not a builder';
      });
    };

    expect(build).to.throw(
      Error,
      'Callback for "where" must return instance of Builder.'
    );
  });

  it('throws an Error for nested where() callback inside Api query when callback does not return Builder', () => {
    const currencyId = 1;
    const clientId = 2;
    const hasCategoryFilter = true;
    const regularTypeIds = [1];
    const customTypeIds = [];
    const ActiveConstants = { CUSTOM_INCOME: 123 };

    const build = () => {
      let query = Api.post('active', 'index-grid', {
        currency_id: currencyId,
        user_id: clientId,
        _method: 'GET',
      }).whereHas('income_account', (q) => q.where('is_visible', 1));

      if (hasCategoryFilter) {
        const customTypeId = ActiveConstants.CUSTOM_INCOME;
        query.where((q) => {
          q.where((innerQuery) => {
            if (regularTypeIds.length > 0) {
              innerQuery.whereIn('type_id', regularTypeIds);
            }
            if (customTypeIds.length > 0) {
              innerQuery.orWhere((sub) =>
                sub.where('type_id', customTypeId).whereIn('custom_type_id', customTypeIds)
              );
            }
            // нет return innerQuery;
          });
          return q;
        });
      }
    };

    expect(build).to.throw(
      Error,
      'Callback for "where" must return instance of Builder.'
    );
  });
});

