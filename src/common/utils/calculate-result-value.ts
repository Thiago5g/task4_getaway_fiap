export const calculateResultValue = (
  asset: string,
  entryPrice: number,
  exitPrice: number,
  type: 'buy' | 'sell',
  quantityContracts: number,
): number | null => {
  let pointValue: number;

  if (asset.includes('WIN')) {
    pointValue = 0.2;
  } else if (asset.includes('WDO')) {
    pointValue = 10;
  } else {
    return null;
  }

  const priceDifference =
    type === 'buy' ? exitPrice - entryPrice : entryPrice - exitPrice;

  const result = priceDifference * pointValue * quantityContracts;

  return parseFloat(result.toFixed(2));
};
