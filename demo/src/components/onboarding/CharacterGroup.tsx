import { ASSETS } from "../../constants/assets";

interface CharacterGroupProps {
  className?: string;
}

const characters = [
  { src: ASSETS.characters.cat, style: "left-[22px] top-[36px] w-[123px] h-[147px]" },
  { src: ASSETS.characters.corn, style: "left-[231px] top-[44px] w-[121px] h-[140px] rotate-180 -scale-y-100" },
  { src: ASSETS.characters.bear, style: "left-[48px] top-[69px] w-[152px] h-[152px]" },
  { src: ASSETS.characters.emoji, style: "left-[173px] top-[45px] w-[156px] h-[163px] rotate-180 -scale-y-100" },
  { src: ASSETS.characters.pink, style: "left-[119px] top-[82px] w-[123px] h-[153px] rotate-180 -scale-y-100" },
];

export function CharacterGroup({ className = "" }: CharacterGroupProps) {
  return (
    <div className={`relative h-[254px] overflow-hidden ${className}`}>
      {characters.map((char, i) => (
        <img
          key={i}
          src={char.src}
          alt=""
          className={`absolute object-cover ${char.style}`}
        />
      ))}
    </div>
  );
}
