import { useEffect, useState } from "react";

interface ProgressRingProps {
  completed: number;
  total: number;
}

export function ProgressRing({ completed, total }: ProgressRingProps) {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  const allDone = total > 0 && completed === total;
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 600;
    const start = performance.now();
    const from = displayCount;
    const to = completed;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="7"
          opacity="0.3"
        />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#FDAA3E"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-draw-ring"
          style={{
            transition: "stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-semibold text-foreground tabular-nums leading-none">
          {displayCount}/{total}
        </span>
        <span className="text-[9px] text-muted-foreground mt-0.5 font-medium tracking-wide uppercase">
          {allDone ? "done" : "today"}
        </span>
      </div>
    </div>
  );
}
