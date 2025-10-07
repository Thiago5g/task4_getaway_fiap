export const calculateResult = (
  type: 'buy' | 'sell',
  entryPrice: number,
  exitPrice: number,
): 'gain' | 'loss' => {
  if (
    (type === 'buy' && exitPrice > entryPrice) ||
    (type === 'sell' && exitPrice < entryPrice)
  ) {
    return 'gain';
  } else {
    return 'loss';
  }
};
