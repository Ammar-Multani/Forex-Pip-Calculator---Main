import React from "react";
import { CurrencyPair } from "../constants/currencies";
import { AssetPair } from "../constants/assetTypes";
import AssetPairModal from "./AssetPairModal";

// For backward compatibility - original interface remains unchanged
interface CurrencyPairModalProps {
  onClose: () => void;
  onSelect: (pair: CurrencyPair) => void;
  selectedPair: CurrencyPair;
  showAllAssets?: boolean; // Optional flag to show all asset types
}

const CurrencyPairModal: React.FC<CurrencyPairModalProps> = ({
  onClose,
  onSelect,
  selectedPair,
  showAllAssets = false,
}) => {
  // Convert CurrencyPair to AssetPair for internal use
  const selectedAssetPair: AssetPair = {
    ...selectedPair,
    baseType: "currency",
    quoteType: "currency",
    group: selectedPair.group || "Major Pairs", // Use existing group or default
  };

  // Handle selection and convert back to CurrencyPair
  const handleAssetSelect = (pair: AssetPair) => {
    const currencyPair: CurrencyPair = {
      name: pair.name,
      base: pair.base,
      quote: pair.quote,
      pipDecimalPlaces: pair.pipDecimalPlaces,
      group: pair.group, // Preserve the group when converting back
    };
    onSelect(currencyPair);
  };

  return (
    <AssetPairModal
      onClose={onClose}
      onSelect={handleAssetSelect}
      selectedPair={selectedAssetPair}
      showAllAssets={showAllAssets}
    />
  );
};

export default CurrencyPairModal;
