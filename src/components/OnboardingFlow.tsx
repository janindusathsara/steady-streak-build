import { useState } from "react";
import { Leaf, ArrowRight, Check, Sparkles } from "lucide-react";
import { HABIT_COLORS, createHabit } from "@/lib/habits";
import type { Habit } from "@/lib/habits";

interface OnboardingFlowProps {
  onComplete: (habit?: Habit) => void;
}

const ONBOARDED_KEY = "continuum_onboarded";

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function setOnboarded(): void {
  localStorage.setItem(ONBOARDED_KEY, "true");
}

const SUGGESTED_HABITS = [
  { name: "Morning walk", description: "20 minutes of fresh air", color: HABIT_COLORS[0] },
  { name: "Read", description: "At least 10 pages", color: HABIT_COLORS[1] },
  { name: "Meditate", description: "5 minutes of stillness", color: HABIT_COLORS[4] },
  { name: "Drink water", description: "8 glasses throughout the day", color: HABIT_COLORS[2] },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [customName, setCustomName] = useState("");

  const handleFinish = () => {
    setOnboarded();
    if (selectedHabit !== null) {
      const h = SUGGESTED_HABITS[selectedHabit];
      onComplete(createHabit(h.name, h.description, h.color));
    } else if (customName.trim()) {
      onComplete(createHabit(customName.trim(), "", HABIT_COLORS[0]));
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setOnboarded();
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-sm w-full">
        {/* Step indicators */}
        <div className="flex gap-2 justify-center mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/50" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="text-center animate-fade-up-blur">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-9 h-9 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight" style={{ lineHeight: "1.2" }}>
              Welcome to Continuum
            </h1>
            <p className="text-sm text-muted-foreground mt-3 mx-auto max-w-[280px]" style={{ textWrap: "pretty" }}>
              A calm space to build lasting habits. No noise, no pressure — just you and your daily ritual.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="text-center animate-fade-up-blur">
            <div className="w-20 h-20 rounded-3xl bg-accent/60 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight" style={{ lineHeight: "1.2" }}>
              How it works
            </h1>
            <div className="mt-6 space-y-4 text-left">
              {[
                { emoji: "☑️", text: "Tap to mark habits complete each day" },
                { emoji: "🔥", text: "Build streaks with consecutive days" },
                { emoji: "📊", text: "Watch your progress grow over time" },
              ].map(({ emoji, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm text-foreground">{text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              Create my first habit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up-blur">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight text-center" style={{ lineHeight: "1.2" }}>
              Pick a habit to start
            </h1>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Choose one or type your own
            </p>

            <div className="mt-6 space-y-2">
              {SUGGESTED_HABITS.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setSelectedHabit(i); setCustomName(""); }}
                  className={`w-full flex items-center gap-3 rounded-xl p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                    selectedHabit === i
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "bg-card shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.description}</p>
                  </div>
                  {selectedHabit === i && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={customName}
                onChange={(e) => { setCustomName(e.target.value); setSelectedHabit(null); }}
                placeholder="Or type your own..."
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium text-muted-foreground bg-muted hover:bg-muted/80 transition-all duration-200 active:scale-[0.97]"
              >
                Skip for now
              </button>
              <button
                onClick={handleFinish}
                disabled={selectedHabit === null && !customName.trim()}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
              >
                Let's go
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
