import { calculateStopValue } from './calculate-stop';

describe('calculateStopValue', () => {
  it('calcula stop para WIN buy', () => {
    const v = calculateStopValue('WINFUT', 1000, 995, 'buy', 2);
    // diff 1000-995 =5 *0.2*2=2
    expect(v).toBe(2);
  });

  it('calcula stop para WIN sell', () => {
    const v = calculateStopValue('WINFUT', 1000, 1005, 'sell', 1);
    // diff 1005-1000=5 *0.2*1=1
    expect(v).toBe(1);
  });

  it('calcula stop para WDO', () => {
    const v = calculateStopValue('WDOFUT', 5, 4.5, 'buy', 1);
    // diff 5-4.5=0.5 *10*1=5
    expect(v).toBe(5);
  });

  it('retorna null para ativo desconhecido', () => {
    expect(calculateStopValue('VALE3', 10, 9, 'buy', 1)).toBeNull();
  });
});
