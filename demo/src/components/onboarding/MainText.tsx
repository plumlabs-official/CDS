interface MainTextProps {
  title: string[];
  subtitle: string[];
  className?: string;
}

export function MainText({ title, subtitle, className = "" }: MainTextProps) {
  return (
    <div className={`flex flex-col items-center gap-[10px] px-4 ${className}`}>
      <div className="text-white text-[24px] font-semibold text-center leading-[1.4]">
        {title.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="text-white/50 text-[14px] text-center leading-[16px]">
        {subtitle.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
