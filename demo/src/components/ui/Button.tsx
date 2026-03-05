import type { ButtonHTMLAttributes, ReactNode } from "react";

type Intent = "Primary" | "Secondary" | "Ghost";
type Scale = "32" | "44" | "48" | "56";
type Color = "Green" | "White" | "Transparent";
type State = "Normal" | "Disabled" | "Loading";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  intent?: Intent;
  scale?: Scale;
  color?: Color;
  state?: State;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const scaleStyles: Record<Scale, { height: string; fontSize: string }> = {
  "56": { height: "h-[56px]", fontSize: "text-[20px]" },
  "48": { height: "h-[48px]", fontSize: "text-[17px]" },
  "44": { height: "h-[44px]", fontSize: "text-[15px]" },
  "32": { height: "h-[32px]", fontSize: "text-[14px]" },
};

function getButtonStyles(intent: Intent, color: Color, state: State) {
  const isDisabled = state === "Disabled";

  if (intent === "Primary") {
    if (color === "Green") {
      return {
        bg: isDisabled ? "bg-[#d3d8dc]" : "bg-[#00cc61]",
        text: "text-white",
        border: "",
        opacity: "",
      };
    }
    // White
    return {
      bg: "bg-white",
      text: "text-black",
      border: "",
      opacity: isDisabled ? "opacity-30" : "",
    };
  }

  if (intent === "Secondary") {
    return {
      bg: "",
      text: "text-black",
      border: "border border-[#d0d0d0]",
      opacity: isDisabled ? "opacity-30" : "",
    };
  }

  // Ghost (color prop 무시 - 항상 Transparent)
  return {
    bg: "",
    text: "text-white underline",
    border: "",
    opacity: isDisabled ? "opacity-30" : "",
  };
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin size-[23px]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  intent = "Primary",
  scale = "56",
  color = "Green",
  state = "Normal",
  iconLeft,
  iconRight,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const { height, fontSize } = scaleStyles[scale];
  const styles = getButtonStyles(intent, color, state);
  const isLoading = state === "Loading";
  const isDisabled = state === "Disabled" || disabled;

  const fontWeight = intent === "Ghost" ? "font-normal" : "font-semibold";

  return (
    <button
      type="button"
      className={`
        flex items-center justify-center gap-1
        px-6 rounded-[28px] transition-opacity
        hover:opacity-90 active:opacity-80
        disabled:cursor-not-allowed
        ${height}
        ${fontSize}
        ${fontWeight}
        ${styles.bg}
        ${styles.text}
        ${styles.border}
        ${styles.opacity}
        ${className}
      `}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {iconLeft}
          {children && <span>{children}</span>}
          {iconRight}
        </>
      )}
    </button>
  );
}
