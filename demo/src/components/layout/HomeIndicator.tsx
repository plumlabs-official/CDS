interface HomeIndicatorProps {
  color?: "black" | "white";
  className?: string;
}

export function HomeIndicator({ color = "black", className = "" }: HomeIndicatorProps) {
  return (
    <div className={`flex justify-center pb-2 ${className}`}>
      <div
        className={`w-[135px] h-[5px] rounded-[100px] ${
          color === "black" ? "bg-black" : "bg-white"
        }`}
      />
    </div>
  );
}
