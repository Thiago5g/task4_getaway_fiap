import { calculateResult } from './calculate-result';

describe('calculateResult', () => {
  it('retorna gain para buy quando exitPrice > entryPrice', () => {
    expect(calculateResult('buy', 100, 105)).toBe('gain');
  });

  it('retorna loss para buy quando exitPrice <= entryPrice', () => {
    expect(calculateResult('buy', 100, 99)).toBe('loss');
  });

  it('retorna gain para sell quando exitPrice < entryPrice', () => {
    expect(calculateResult('sell', 100, 90)).toBe('gain');
  });

  it('retorna loss para sell quando exitPrice >= entryPrice', () => {
    expect(calculateResult('sell', 100, 110)).toBe('loss');
  });
});
