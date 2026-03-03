import { expect } from 'chai';
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
});

