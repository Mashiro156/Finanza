/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { PhoneFrame } from "./components/PhoneFrame";
import { Header } from "./components/Header";
import { HeroBalanceCard } from "./components/HeroBalanceCard";
import { MetricCards } from "./components/MetricCards";
import { RecentTransactions } from "./components/RecentTransactions";
import { AnalyticsView } from "./components/AnalyticsView";
import { BudgetsGoalsView } from "./components/BudgetsGoalsView";
import { ProfileView } from "./components/ProfileView";
import { BottomNavBar } from "./components/BottomNavBar";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { AvatarPickerModal } from "./components/AvatarPickerModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { TutorialModal } from "./components/TutorialModal";
import { TutorialPromptModal } from "./components/TutorialPromptModal";
import { InteractiveSpotlightTour } from "./components/InteractiveSpotlightTour";
import { TourSuggestionPrompt } from "./components/TourSuggestionPrompt";

function MainAppContent() {
  const {
    activeTab,
    isAvatarModalOpen,
    setIsAvatarModalOpen,
    isOnboardingOpen,
    completeOnboarding,
    isTutorialOpen,
    setIsTutorialOpen,
  } = useFinance();

  return (
    <>
      <div className="flex-1 pb-16">
        {activeTab === "home" && (
          <div className="animate-in fade-in duration-150">
            <Header />
            <HeroBalanceCard />
            <MetricCards />
            <RecentTransactions />
          </div>
        )}

        {activeTab === "analytics" && <AnalyticsView />}

        {activeTab === "goals" && <BudgetsGoalsView />}

        {activeTab === "profile" && <ProfileView />}
      </div>

      <BottomNavBar />
      <AddTransactionModal />
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={completeOnboarding}
      />
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
      <TutorialPromptModal />
      <InteractiveSpotlightTour />
      <TourSuggestionPrompt />
    </>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <PhoneFrame>
        <MainAppContent />
      </PhoneFrame>
    </FinanceProvider>
  );
}
