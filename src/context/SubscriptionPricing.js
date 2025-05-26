import { createContext, useContext, useState, useMemo } from "react";

// ---- Context Creation ---- //
const SubscriptionPricingContext = createContext();

// ---- Provider Component ---- //
export const SubscriptionPricingProvider = ({ children }) => {
  const [pricingInputs, setPricingInputs] = useState({
    basePrice: 0,
    coachPrice: 0,
    tax: 0,
    cardPrice: 0,
    insurancePrice: 0,
  });

  const pricing = useSubscriptionPricing(pricingInputs);

  const updatePricingInput = (name, value) => {
    setPricingInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <SubscriptionPricingContext.Provider
      value={{ pricingInputs, updatePricingInput, pricing }}
    >
      {children}
    </SubscriptionPricingContext.Provider>
  );
};

// ---- Custom Hook to Use Context ---- //
export const usePricingContext = () => useContext(SubscriptionPricingContext);

// ---- Pricing Calculation Logic ---- //
function useSubscriptionPricing({
  basePrice = 0,
  coachPrice = 0,
  tax = 0,
  cardPrice = 0,
  insurancePrice = 0,
}) {
  const parsed = {
    base: Number(basePrice) || 0,
    coach: Number(coachPrice) || 0,
    tax: Number(tax) || 0,
    card: Number(cardPrice) || 0,
    insurance: Number(insurancePrice) || 0,
  };

  return useMemo(() => {
    const subtotal =
      parsed.base + parsed.coach + parsed.card + parsed.insurance;

    const taxAmount = parsed.tax
      ? (parsed.tax / 100) * parsed.base
      : 0;

    const total = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      total,
      breakdown: parsed,
    };
  }, [parsed.base, parsed.coach, parsed.tax, parsed.card, parsed.insurance]);
}
