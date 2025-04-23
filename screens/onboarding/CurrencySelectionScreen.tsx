import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import CurrencyPairSelector from "../../components/CurrencyPairSelector";
import CurrencyPairModal from "../../components/CurrencyPairModal";
import { CurrencyPair } from "../../constants/currencies";

const { width } = Dimensions.get("window");

interface CurrencySelectionScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const CurrencySelectionScreen: React.FC<CurrencySelectionScreenProps> = ({
  onNext,
  onSkip,
}) => {
  const { colors, getGradient } = useTheme();
  const { setSelectedCurrencyPair } = useOnboarding();
  const [showModal, setShowModal] = useState(false);
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>({
    name: "EUR/USD",
    base: "EUR",
    quote: "USD",
    group: "Major",
  });

  const handlePairSelect = async (pair: CurrencyPair) => {
    setSelectedPair(pair);
    await setSelectedCurrencyPair(pair);
    setShowModal(false);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Select Your Primary Currency Pair
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Choose the currency pair you trade most frequently. You can always
          change this later in settings.
        </Text>

        <View style={styles.selectorContainer}>
          <CurrencyPairSelector
            label="Primary Currency Pair"
            selectedPair={selectedPair}
            onPress={() => setShowModal(true)}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.skipButton, { borderColor: colors.border }]}
          onPress={onSkip}
        >
          <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.gradient}
          >
            <Text style={styles.nextText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showModal && (
        <CurrencyPairModal
          onClose={() => setShowModal(false)}
          onSelect={handlePairSelect}
          selectedPair={selectedPair}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  selectorContainer: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 8,
  },
});

export default CurrencySelectionScreen;
