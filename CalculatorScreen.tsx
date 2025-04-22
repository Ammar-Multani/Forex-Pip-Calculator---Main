import { AssetPair } from "../constants/assetTypes";

const selectedAssetPair: AssetPair = {
  ...selectedPair,
  baseType: "currency",
  quoteType: "currency",
  group: selectedPair.group || "Major Pairs",
};

<ResultCard
  instrument={selectedAssetPair}
  pipValue={pipValueInQuoteCurrency}
  totalValue={totalValueInQuoteCurrency}
  pipCount={pipCount}
  positionSize={positionSize}
  lotType={lotType}
  lotCount={lotCount}
/>;
