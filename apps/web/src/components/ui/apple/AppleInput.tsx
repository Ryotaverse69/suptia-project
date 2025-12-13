"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import {
  appleWebColors,
  systemColors,
  typography,
  touchTargets,
} from "@/lib/design-system";

interface AppleInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "default" | "search";
  inputSize?: "medium" | "large";
}

/**
 * Apple HIG Input Component
 *
 * A text input following Apple's design guidelines.
 * Supports default and search variants with proper touch targets.
 */
export const AppleInput = forwardRef<HTMLInputElement, AppleInputProps>(
  function AppleInput(
    {
      label,
      error,
      variant = "default",
      inputSize = "medium",
      className = "",
      id,
      ...props
    },
    ref,
  ) {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const height = inputSize === "large" ? 56 : touchTargets.minimum;

    if (variant === "search") {
      return (
        <div className={`relative ${className}`}>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: appleWebColors.textSecondary }}
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full pl-12 pr-4
              ${typography.body}
              bg-[#E5E5EA]/60
              rounded-[10px]
              placeholder:text-[#86868b]
              focus:outline-none focus:ring-2 focus:ring-[#007AFF]
              transition-shadow
            `}
            style={{
              height,
              color: appleWebColors.textPrimary,
            }}
            {...props}
          />
        </div>
      );
    }

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block ${typography.subhead} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4
            ${typography.body}
            bg-[#E5E5EA]
            rounded-[10px]
            placeholder:text-[#86868b]
            focus:outline-none focus:ring-2 focus:ring-[#007AFF]
            transition-shadow
          `}
          style={{
            height,
            color: appleWebColors.textPrimary,
            borderColor: error ? systemColors.red : "transparent",
            borderWidth: error ? 1 : 0,
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className={`mt-2 ${typography.footnote}`}
            style={{ color: systemColors.red }}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default AppleInput;
