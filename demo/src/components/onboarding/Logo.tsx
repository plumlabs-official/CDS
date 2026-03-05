import { ASSETS } from "../../constants/assets";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <img src={ASSETS.logo} alt="Tryve" className="h-[59px]" />
    </div>
  );
}
