import { useState } from "react";
import { StatusBar } from "../components/layout/StatusBar";
import { HomeIndicator } from "../components/layout/HomeIndicator";
import { Button } from "../components/ui/Button";
import { PageIndicator } from "../components/ui/PageIndicator";
import { Swipeable } from "../components/ui/Swipeable";
import { Logo } from "../components/onboarding/Logo";
import { MainText } from "../components/onboarding/MainText";
import { CharacterGroup } from "../components/onboarding/CharacterGroup";

interface ScreenOnboardingProps {
  totalPages?: number;
  onStart?: () => void;
  onInvite?: () => void;
  onExistingUser?: () => void;
}

export function ScreenOnboarding({
  totalPages = 5,
  onStart,
  onInvite,
  onExistingUser,
}: ScreenOnboardingProps) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="relative w-[375px] h-[812px] bg-gradient-to-b from-[#00cc61] to-[#01a54f] overflow-hidden flex flex-col">
      {/* Status Bar */}
      <StatusBar />

      {/* Logo */}
      <Logo className="mt-[18px]" />

      {/* Swipeable Main Text */}
      <Swipeable
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-[26px]"
      >
        {() => (
          <MainText
            title={["혼자보다 함께할 때", "습관이 될 가능성이 3배 높아요"]}
            subtitle={[
              "Wing & Jeffery, Journal of Consulting and",
              "Clinical Psychology, 1999",
            ]}
          />
        )}
      </Swipeable>

      {/* Page Indicator */}
      <PageIndicator
        current={currentPage}
        total={totalPages}
        className="mt-[12px]"
      />

      {/* Character Group */}
      <CharacterGroup className="flex-1 mt-[20px]" />

      {/* Action Buttons */}
      <div className="px-4 flex flex-col gap-4 mb-[16px]">
        <Button intent="Primary" scale="56" color="White" onClick={onStart}>
          시작하기
        </Button>
        <Button intent="Secondary" scale="56" color="White" onClick={onInvite}>
          초대를 받으셨나요?
        </Button>
      </div>

      {/* Bottom Link */}
      <Button
        intent="Ghost"
        scale="32"
        color="Transparent"
        iconLeft={<span className="text-[14px]">✋</span>}
        onClick={onExistingUser}
        className="mb-[34px]"
      >
        웰위를 이용해본적이 있으신가요?
      </Button>

      {/* Home Indicator */}
      <HomeIndicator />
    </div>
  );
}
