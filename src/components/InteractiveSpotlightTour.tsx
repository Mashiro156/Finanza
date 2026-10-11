import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFinance } from "../context/FinanceContext";
import { TOURS_CONFIG } from "../data/tours";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  CheckCircle,
} from "lucide-react";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const InteractiveSpotlightTour: React.FC = () => {
  const {
    activeTourPage,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    stopTour,
  } = useFinance();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<"below" | "above" | "center">("below");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const currentTour = activeTourPage ? TOURS_CONFIG[activeTourPage] : null;
  const currentStep =
    currentTour && currentTour.steps[tourStepIndex]
      ? currentTour.steps[tourStepIndex]
      : null;

  // Measure and position spotlight over the target DOM element
  const updateSpotlightPosition = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }

    const selector = `[data-tour="${currentStep.targetId}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;

    if (!el) {
      // Element might be rendering or in another tab; fallback
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    // Determine whether card fits below or above target
    const estimatedCardHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow >= estimatedCardHeight + 20) {
      setTooltipPos("below");
    } else if (spaceAbove >= estimatedCardHeight + 20) {
      setTooltipPos("above");
    } else {
      setTooltipPos("center");
    }
  }, [currentStep]);

  // When step changes, scroll target element into view smoothly and measure
  useEffect(() => {
    if (!currentStep) return;

    const selector = `[data-tour="${currentStep.targetId}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }

    // Measure initially and after smooth scroll completes
    updateSpotlightPosition();
    const timer1 = setTimeout(updateSpotlightPosition, 100);
    const timer2 = setTimeout(updateSpotlightPosition, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentStep, updateSpotlightPosition]);

  // Keep measuring on window resize or scroll
  useEffect(() => {
    if (!activeTourPage) return;

    const handleScrollOrResize = () => {
      updateSpotlightPosition();
    };

    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize);
    };
  }, [activeTourPage, updateSpotlightPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeTourPage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopTour();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        nextTourStep();
      } else if (e.key === "ArrowLeft") {
        prevTourStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTourPage, nextTourStep, prevTourStep, stopTour]);

  if (!activeTourPage || !currentTour || !currentStep) {
    return null;
  }

  const isFirstStep = tourStepIndex === 0;
  const isLastStep = tourStepIndex === currentTour.steps.length - 1;
  const padding = 8; // Margin around spotlighted element

  // Calculate tooltip style coordinates
  const computeTooltipStyle = (): React.CSSProperties => {
    if (!targetRect || tooltipPos === "center") {
      // Centered at bottom of viewport
      return {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(390px, calc(100vw - 32px))",
      };
    }

    const cardWidth = Math.min(390, window.innerWidth - 32);
    let leftPos = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    // Keep card inside screen bounds
    leftPos = Math.max(16, Math.min(leftPos, window.innerWidth - cardWidth - 16));

    if (tooltipPos === "below") {
      const topPos = targetRect.top + targetRect.height + padding + 12;
      return {
        position: "fixed",
        top: `${Math.max(16, topPos)}px`,
        left: leftPos,
        width: `${cardWidth}px`,
        maxHeight: "calc(100vh - 32px)",
      };
    } else {
      // above
      const bottomPos = Math.max(
        16,
        window.innerHeight - targetRect.top + padding + 12,
      );
      return {
        position: "fixed",
        bottom: `${bottomPos}px`,
        left: leftPos,
        width: `${cardWidth}px`,
        maxHeight: "calc(100vh - 32px)",
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* SVG Mask definition for spotlight cutout */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <mask id="spotlight-tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx={18}
                ry={18}
                fill="black"
              />
            )}
          </mask>
        </defs>
      </svg>

      {/* 1. Backdrop overlay with smooth blur and clear spotlight cutout */}
      <div
        onClick={nextTourStep}
        style={{
          mask: "url(#spotlight-tour-mask)",
          WebkitMask: "url(#spotlight-tour-mask)",
        }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-[5px] transition-all duration-300 cursor-pointer"
        title="Cliquez pour continuer"
      />

      {/* 2. Spotlight Highlight Box on target element */}
      {targetRect && (
        <div
          className="fixed rounded-2xl border-2 border-accent ring-4 ring-accent/30 pointer-events-none transition-all duration-300 ease-out shadow-[0_0_35px_var(--accent-color)]"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
        >
          {/* Animated pulsing dot on target element */}
          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent ring-2 ring-white dark:ring-slate-900"></span>
          </span>
        </div>
      )}

      {/* 3. Floating Explanatory Tooltip Card */}
      <div
        ref={cardRef}
        style={computeTooltipStyle()}
        className="z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 pointer-events-auto transition-all duration-300 ease-out"
      >
        {/* Card Header: Step counter & Dismiss button */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-light text-accent text-[11px] font-bold">
              <Compass size={12} className="stroke-[2.5]" />
              <span>{currentTour.pageName}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono-numbers">
              {tourStepIndex + 1} / {currentTour.steps.length}
            </span>
          </div>

          <button
            onClick={stopTour}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Quitter le guide"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step Title & Explanation Text */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-accent shrink-0" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {currentStep.title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {currentTour.steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === tourStepIndex
                  ? "w-6 bg-accent"
                  : idx < tourStepIndex
                    ? "w-2 bg-accent/50"
                    : "w-2 bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={stopTour}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Passer
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={prevTourStep}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Précédent</span>
              </button>
            )}

            <button
              onClick={nextTourStep}
              className="px-3.5 py-1.5 rounded-xl bg-accent hover:opacity-95 active:scale-95 text-white text-xs font-bold shadow-accent flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isLastStep ? "Terminer" : "Suivant"}</span>
              {isLastStep ? (
                <CheckCircle size={14} />
              ) : (
                <ArrowRight size={13} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
