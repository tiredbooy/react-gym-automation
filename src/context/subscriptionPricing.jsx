import { createContext, useContext, useState, useMemo } from "react";

// ---- TYPES ----
const INITIAL_INPUTS = {
  price: 0,
  tax: 0,
  coachPrice: 0,
  insurancePrice: 0,
  discount: 0,
  cardPrice: 0,
};

// ---- CONTEXT ----
const PricingContext = createContext({
  inputs: INITIAL_INPUTS,
  updateInput: () => {
    console.warn(
      "PricingContext not initialized. Wrap your app in <PricingProvider>."
    );
  },
  pricing: {
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  },
});

// ---- UTILITIES ----
const parseNumber = (value) => {
  const num = Number(value);
  return isNaN(num) || num < 0 ? 0 : num;
};

// ---- PRICING CALCULATION HOOK ----
const usePricingCalculation = ({
  price = 0,
  tax = 0,
  coachPrice = 0,
  insurancePrice = 0,
  discount = 0,
  cardPrice = 0,
}) => {
  const parsedPrice = parseNumber(price);
  const parsedTax = parseNumber(tax);
  const parsedCoachPrice = parseNumber(coachPrice);
  const parsedInsurancePrice = parseNumber(insurancePrice);
  const parsedDiscount = parseNumber(discount);
  const parsedCardPrice = parseNumber(cardPrice);

  return useMemo(() => {
    const baseSubtotal =
      parsedPrice + parsedCoachPrice + parsedInsurancePrice + parsedCardPrice;

    const taxAmount = parsedTax ? (parsedTax / 100) * parsedPrice : 0;
    const discountedAmount =
      parsedDiscount > baseSubtotal ? baseSubtotal : parsedDiscount;

    const subtotal = baseSubtotal - discountedAmount;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  }, [
    parsedPrice,
    parsedTax,
    parsedCoachPrice,
    parsedInsurancePrice,
    parsedDiscount,
    parsedCardPrice,
  ]);
};

// ---- PROVIDER ----
export const PricingProvider = ({ children }) => {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);

  const updateInput = (key, value) => {
    if (!(key in INITIAL_INPUTS)) {
      console.warn(`Invalid input key: "${key}"`);
      return;
    }
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const pricing = usePricingCalculation(inputs);

  return (
    <PricingContext.Provider value={{ inputs, updateInput, pricing }}>
      {children}
    </PricingContext.Provider>
  );
};

// ---- CONSUMER HOOK ----
export const usePricing = () => {
  const context = useContext(PricingContext);

  if (!context || typeof context.updateInput !== "function") {
    throw new Error("usePricing must be used within a <PricingProvider>");
  }

  return context;
};
