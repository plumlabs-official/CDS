interface StatusBarProps {
  time?: string;
  className?: string;
}

function IconSignal() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
      <rect x="0" y="7" width="3" height="4" rx="1" fill="white" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" fill="white" />
      <rect x="9" y="3" width="3" height="8" rx="1" fill="white" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" fill="white" />
    </svg>
  );
}

function IconWifi() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path
        d="M7.5 2.5C9.8 2.5 11.9 3.4 13.4 4.9L14.5 3.8C12.7 2 10.2 0.9 7.5 0.9C4.8 0.9 2.3 2 0.5 3.8L1.6 4.9C3.1 3.4 5.2 2.5 7.5 2.5Z"
        fill="white"
      />
      <path
        d="M3.2 6.5L4.3 7.6C5.2 6.7 6.3 6.2 7.5 6.2C8.7 6.2 9.8 6.7 10.7 7.6L11.8 6.5C10.6 5.3 9.1 4.6 7.5 4.6C5.9 4.6 4.4 5.3 3.2 6.5Z"
        fill="white"
      />
      <circle cx="7.5" cy="9.5" r="1.5" fill="white" />
    </svg>
  );
}

function IconBattery() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="2.5"
        stroke="white"
        strokeOpacity="0.35"
      />
      <rect x="2" y="2" width="18" height="7" rx="1.5" fill="white" />
      <path
        d="M23 4V8C23.8 7.6 24.5 6.9 24.5 6C24.5 5.1 23.8 4.4 23 4Z"
        fill="white"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export function StatusBar({ time = "9:40", className = "" }: StatusBarProps) {
  return (
    <div className={`h-[50px] flex items-center justify-between px-[18px] pt-[21px] ${className}`}>
      <div className="text-white text-[15px] font-semibold tracking-[-0.5px]">
        {time}
      </div>
      <div className="flex items-center gap-[6px]">
        <IconSignal />
        <IconWifi />
        <IconBattery />
      </div>
    </div>
  );
}
