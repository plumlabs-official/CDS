interface PageIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export function PageIndicator({ current, total, className = "" }: PageIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-[9px] ${className}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i === current
              ? "w-[31px] h-[12px] bg-white"
              : "w-[12px] h-[12px] bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}
