import { useState, useRef, type ReactNode, type TouchEvent } from "react";

interface SwipeableProps {
  children: (currentIndex: number) => ReactNode;
  totalPages: number;
  onPageChange?: (index: number) => void;
  className?: string;
}

export function Swipeable({
  children,
  totalPages,
  onPageChange,
  className = "",
}: SwipeableProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 50;

    if (Math.abs(offsetX) > threshold) {
      let newIndex = currentIndex;
      if (offsetX < 0 && currentIndex < totalPages - 1) {
        newIndex = currentIndex + 1;
      } else if (offsetX > 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      setCurrentIndex(newIndex);
      onPageChange?.(newIndex);
    }
    setOffsetX(0);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? offsetX : 0}px))`,
          transitionDuration: isDragging ? "0ms" : "300ms",
        }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} className="w-full flex-shrink-0">
            {children(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
