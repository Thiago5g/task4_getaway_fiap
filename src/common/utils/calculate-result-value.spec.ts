import { calculateResultValue } from './calculate-result-value';

describe('calculateResultValue', () => {
  it('calcula resultado WIN para operação buy', () => {
    const v = calculateResultValue('WINFUT', 1000, 1010, 'buy', 5);
    // diff 10 * 0.2 * 5 = 10
    expect(v).toBe(10);
  });

  it('calcula resultado WIN para operação sell', () => {
    const v = calculateResultValue('WINFUT', 1000, 990, 'sell', 3);
    // diff (1000-990)=10 *0.2*3=6
    expect(v).toBe(6);
  });

  it('calcula resultado WDO', () => {
    const v = calculateResultValue('WDOFUT', 5, 6, 'buy', 1);
    // diff 1 * 10 *1 =10
    expect(v).toBe(10);
  });

  it('retorna null para ativo desconhecido', () => {
    expect(calculateResultValue('PETR4', 10, 11, 'buy', 1)).toBeNull();
  });
});
