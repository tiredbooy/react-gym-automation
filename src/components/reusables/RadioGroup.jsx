import { motion, AnimatePresence } from "framer-motion";

/**
 * A reusable radio group component with customizable options, styling, and animations.
 * @param {string} name - The name attribute for the radio inputs.
 * @param {string|boolean} value - The currently selected value.
 * @param {function} onChange - Callback for when a radio is selected.
 * @param {Array<{value: string|boolean, label: string, disabled?: boolean}>} options - Array of radio options.
 * @param {string} label - Optional label for the radio group.
 * @param {string} error - Optional error message to display.
 * @param {string} [wrapperClass] - Additional classes for the wrapper div.
 * @param {string} [labelClass] - Additional classes for the group label.
 * @param {string} [inputClass] - Additional classes for the radio inputs.
 * @param {string} [optionClass] - Additional classes for each option label.
 * @param {boolean} [isVertical=false] - Stack options vertically if true.
 * @param {Object} [ariaProps] - Additional ARIA attributes for accessibility.
 */
const RadioGroup = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  wrapperClass = "",
  labelClass = "",
  inputClass = "",
  optionClass = "",
  isVertical = false,
  ariaProps = {},
}) => {
  return (
    <div className={`text-right ${wrapperClass}`}>
      {label && (
        <p className={`mb-2 text-sm font-semibold text-nearBlack ${labelClass}`}>
          {label}
        </p>
      )}
      <div
        className={`flex ${isVertical ? "flex-col gap-4" : "gap-6 justify-start"} ${
          error ? "border-l-4 border-errorRed pl-2" : ""
        }`}
      >
        {options.map((option) => (
          <motion.label
            key={String(option.value)}
            className={`flex items-center gap-3 cursor-pointer relative ${optionClass} ${
              option.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={option.disabled ? {} : { scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => !option.disabled && onChange(option.value)}
              className={`appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-darkBlue checked:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-hoverBeige transition-all duration-200 ${inputClass}`}
              aria-label={option.label}
              disabled={option.disabled}
              {...ariaProps}
            />
            <motion.span
              className="text-sm font-medium text-nearBlack"
              whileHover={option.disabled ? {} : { color: "#123458" }}
              transition={{ duration: 0.2 }}
            >
              {option.label}
            </motion.span>
          </motion.label>
        ))}
      </div>
      {error && (
        <p className="text-errorRed text-xs mt-1 text-right">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;