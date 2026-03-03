import { expect } from 'chai';
import { Api } from '../src/index.js';

// Моки для зависимостей из кода приложения (moment, Money, ActiveConstants)
const mockMoment = (date) => ({
  isValid: () => true,
  format: (fmt) => (date != null ? String(date) : '2020-01-01 00:00:00'),
});
const Money = { toDigits: (x) => (typeof x === 'number' ? x : parseInt(String(x), 10) || 0) };
const ActiveConstants = { CUSTOM_SPEND: 999 };

function buildActiveIndexGridQuery(options = {}) {
  const {
    currencyId = 1,
    clientId = 2,
    hasCategoryFilter = false,
    regularTypeIds = [],
    customTypeIds = [],
    filterSubcategoryIds = [],
    filterTagNames = [],
    filterAccountIds = [],
    apiFilters = {},
  } = options;

  let query = Api.post('active', 'index-grid', {
    currency_id: currencyId,
    user_id: clientId,
    _method: 'GET',
  }).whereHas('income_account', (q) => q.where('is_visible', 1));

  if (hasCategoryFilter) {
    const customTypeId = ActiveConstants.CUSTOM_SPEND;
    query = query.where((q) => {
      q.where((subQuery) => {
        if (regularTypeIds.length > 0) {
          subQuery.whereIn('type_id', regularTypeIds);
        }
        if (customTypeIds.length > 0) {
          subQuery.orWhere((sub) =>
            sub.where('type_id', customTypeId).whereIn('custom_type_id', customTypeIds)
          );
        }
        if (regularTypeIds.length > 0 || customTypeIds.length > 0) {
          return subQuery;
        }
      });
      return q;
    });
  }

  query = query
    .where((q2) => {
      if (filterSubcategoryIds?.length) {
        q2.whereIn('subcategory_id', filterSubcategoryIds);
      }
      if (typeof apiFilters.filterDesc !== 'undefined' && apiFilters.filterDesc !== '') {
        q2.where('comment', 'LIKE', '%' + apiFilters.filterDesc + '%');
      }
      if (filterTagNames?.length) {
        q2.whereHas('tags.tag', (q) => q.whereIn('name', filterTagNames));
      }
      return q2;
    })
    .with('operation', 'custom_type', 'subcategory', 'tags.tags')
    .whereHas('payments', (paymentQuery) => {
      if (apiFilters?.filterDateFrom) {
        const startMoment = mockMoment(apiFilters.filterDateFrom);
        if (startMoment.isValid()) {
          paymentQuery.where('paid_at', '>=', startMoment.format('YYYY-MM-DD HH:mm:ss'));
        }
      }
      if (apiFilters?.filterDateTo) {
        const endMoment = mockMoment(apiFilters.filterDateTo);
        if (endMoment.isValid()) {
          paymentQuery.where('paid_at', '<=', endMoment.format('YYYY-MM-DD HH:mm:ss'));
        }
      }
      if (typeof apiFilters?.filterSumFrom !== 'undefined' && apiFilters.filterSumFrom !== '') {
        paymentQuery.whereAbs('sum', '>=', Money.toDigits(apiFilters.filterSumFrom));
      }
      if (typeof apiFilters?.filterSumTo !== 'undefined' && apiFilters.filterSumTo !== '') {
        paymentQuery.whereAbs('sum', '<=', Money.toDigits(apiFilters.filterSumTo));
      }
      if (filterAccountIds?.length) {
        paymentQuery.whereIn('account_id', filterAccountIds);
      }
      return paymentQuery.where('sum', '<', 0).where('is_confirmed', 1);
    })
    .with('payments')
    .orderBy('buy_at', 'DESC');

  return query;
}

describe('active index-grid query', () => {
  before(() => {
    process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://api.test';
  });

  it('builds correct query and arguments without category filter', () => {
    const query = buildActiveIndexGridQuery({
      currencyId: 10,
      clientId: 20,
      hasCategoryFilter: false,
    });

    const { query: queryArray, data, arguments: args } = query.getBuiltPayload();

    expect(args).to.deep.equal([]);
    expect(data).to.include({
      currency_id: 10,
      user_id: 20,
      _method: 'GET',
    });

    expect(queryArray).to.be.an('array');

    const whereHasIncomeAccount = queryArray.find(
      (op) => op.whereHas && op.whereHas[0] === 'income_account'
    );
    expect(whereHasIncomeAccount).to.be.ok;
    expect(whereHasIncomeAccount.whereHas[1].query).to.deep.equal([
      { where: ['is_visible', 1] },
    ]);

    const withOps = queryArray.filter((op) => op.with);
    expect(withOps.length).to.be.at.least(1);
    const withMain = withOps.find((op) => op.with.includes('operation'));
    expect(withMain).to.be.ok;
    expect(withMain.with).to.include('custom_type');
    expect(withMain.with).to.include('subcategory');
    expect(withMain.with).to.include('tags.tags');
    expect(queryArray.some((op) => op.with && op.with.includes('payments'))).to.be.true;

    const orderBy = queryArray.find((op) => op.orderBy);
    expect(orderBy).to.be.ok;
    expect(orderBy.orderBy[0]).to.equal('buy_at');
    expect(orderBy.orderBy[1]).to.equal('DESC');

    const whereHasPayments = queryArray.find(
      (op) => op.whereHas && op.whereHas[0] === 'payments'
    );
    expect(whereHasPayments).to.be.ok;
    const paymentQuery = whereHasPayments.whereHas[1].query;
    expect(paymentQuery).to.be.ok;
    const sumLt = paymentQuery.find((op) => op.where && op.where[0] === 'sum' && op.where[2] === 0);
    const isConfirmed = paymentQuery.find(
      (op) => op.where && op.where[0] === 'is_confirmed' && op.where[1] === 1
    );
    expect(Boolean(sumLt)).to.be.true;
    expect(Boolean(isConfirmed)).to.be.true;
  });

  it('builds correct query with category filter (regularTypeIds and customTypeIds)', () => {
    const query = buildActiveIndexGridQuery({
      currencyId: 1,
      clientId: 1,
      hasCategoryFilter: true,
      regularTypeIds: [1, 2],
      customTypeIds: [10, 20],
    });

    const { query: queryArray } = query.getBuiltPayload();

    // where(cb) -> [{ where: [{ query: innerArray }] }], category filter is in innerArray
    const whereOp = queryArray.find((op) => op.where && op.where[0]?.query);
    expect(whereOp).to.be.ok;
    const outerNested = whereOp.where[0].query; // array of ops from outer callback
    const innerWhereOp = Array.isArray(outerNested)
      ? outerNested.find((o) => o.where?.[0]?.query)
      : null;
    const innerArray = innerWhereOp?.where?.[0]?.query ?? outerNested;
    expect(innerArray).to.be.ok;

    const whereInTypeId = innerArray.find((op) => op.whereIn && op.whereIn[0] === 'type_id');
    expect(whereInTypeId).to.be.ok;
    expect(whereInTypeId.whereIn[1]).to.deep.equal([1, 2]);

    const orWhereOp = innerArray.find((op) => op.orWhere && op.orWhere[0]?.query);
    expect(orWhereOp).to.be.ok;
    const subQuery = orWhereOp.orWhere[0].query;
    const typeIdCustom = subQuery.find((op) => op.where && op.where[0] === 'type_id');
    const customTypeIdIn = subQuery.find((op) => op.whereIn && op.whereIn[0] === 'custom_type_id');
    expect(typeIdCustom).to.be.ok;
    expect(typeIdCustom.where[1]).to.equal(ActiveConstants.CUSTOM_SPEND);
    expect(customTypeIdIn.whereIn[1]).to.deep.equal([10, 20]);
  });

  it('builds correct query with subcategory, comment and tag filters', () => {
    const query = buildActiveIndexGridQuery({
      filterSubcategoryIds: [5, 6],
      apiFilters: { filterDesc: 'test comment' },
      filterTagNames: ['tag1', 'tag2'],
    });

    const { query: queryArray } = query.getBuiltPayload();

    const whereWithSub = queryArray.find(
      (op) => op.where && op.where[0]?.query && op.where[0].query.some(
        (q) => q.whereIn && q.whereIn[0] === 'subcategory_id'
      )
    );
    expect(whereWithSub).to.be.ok;
    const inner = whereWithSub.where[0].query;
    const subcategoryIn = inner.find((op) => op.whereIn && op.whereIn[0] === 'subcategory_id');
    expect(subcategoryIn.whereIn[1]).to.deep.equal([5, 6]);

    const commentLike = inner.find(
      (op) => op.where && op.where[0] === 'comment' && op.where[1] === 'LIKE'
    );
    expect(commentLike).to.be.ok;
    expect(commentLike.where[2]).to.include('test comment');

    const tagsWhereHas = inner.find(
      (op) => op.whereHas && op.whereHas[0] === 'tags.tag'
    );
    expect(tagsWhereHas).to.be.ok;
    expect(tagsWhereHas.whereHas[1].query).to.deep.equal([
      { whereIn: ['name', ['tag1', 'tag2']] },
    ]);
  });

  it('builds correct payments whereHas with date, sum and account filters', () => {
    const query = buildActiveIndexGridQuery({
      apiFilters: {
        filterDateFrom: '2024-01-01',
        filterDateTo: '2024-12-31',
        filterSumFrom: '100',
        filterSumTo: '500',
      },
      filterAccountIds: [7, 8],
    });

    const { query: queryArray } = query.getBuiltPayload();

    const whereHasPayments = queryArray.find(
      (op) => op.whereHas && op.whereHas[0] === 'payments'
    );
    expect(whereHasPayments).to.be.ok;
    const paymentQuery = whereHasPayments.whereHas[1].query;

    const paidAtFrom = paymentQuery.find(
      (op) => op.where && op.where[0] === 'paid_at' && op.where[1] === '>='
    );
    expect(paidAtFrom).to.be.ok;
    expect(paidAtFrom.where[2]).to.include('2024-01-01');

    const paidAtTo = paymentQuery.find(
      (op) => op.where && op.where[0] === 'paid_at' && op.where[1] === '<='
    );
    expect(paidAtTo).to.be.ok;
    expect(paidAtTo.where[2]).to.include('2024-12-31');

    const sumFrom = paymentQuery.find(
      (op) => op.whereAbs && op.whereAbs[0] === 'sum' && op.whereAbs[1] === '>='
    );
    expect(sumFrom).to.be.ok;
    expect(sumFrom.whereAbs[2]).to.equal(100);

    const sumTo = paymentQuery.find(
      (op) => op.whereAbs && op.whereAbs[0] === 'sum' && op.whereAbs[1] === '<='
    );
    expect(sumTo).to.be.ok;
    expect(sumTo.whereAbs[2]).to.equal(500);

    const accountIn = paymentQuery.find(
      (op) => op.whereIn && op.whereIn[0] === 'account_id'
    );
    expect(accountIn).to.be.ok;
    expect(accountIn.whereIn[1]).to.deep.equal([7, 8]);
  });

  it('getBuiltPayload returns query array and arguments matching constructRequestData', () => {
    const request = buildActiveIndexGridQuery({ currencyId: 1, clientId: 2 });
    const built = request.getBuiltPayload();
    const constructed = request.constructRequestData('data', 'arguments', 'query');

    expect(built.query).to.deep.equal(constructed.query);
    expect(built.arguments).to.deep.equal(constructed.arguments);
    expect(built.data).to.deep.equal(constructed.data);
  });
});
