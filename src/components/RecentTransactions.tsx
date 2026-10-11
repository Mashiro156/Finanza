import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { Transaction } from "../types/finance";
import { CategoryIcon } from "./CategoryIcon";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Edit3,
  X,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";

export const RecentTransactions: React.FC = () => {
  const {
    transactions,
    categories,
    user,
    deleteTransaction,
    setEditingTransaction,
    setIsAddModalOpen,
  } = useFinance();
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">(
    "all",
  );
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true;
    return tx.type === filterType;
  });

  // Group by date
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  filteredTransactions.forEach((tx) => {
    const dateKey = tx.date;
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(tx);
  });

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
    b.localeCompare(a),
  );

  // Helper to format date header like "Mon, 18 Oct"
  const formatDateHeader = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const getCategory = (catId: string) => {
    return (
      categories.find((c) => c.id === catId) || {
        id: "other",
        name: "Général",
        icon: "PlusCircle",
        bgColor: "#64748b",
        textColor: "#ffffff",
      }
    );
  };

  const formatAmount = (amount: number, type: "expense" | "income") => {
    const isCFA =
      user.currency === "FCFA" ||
      user.currency === "CFA" ||
      user.currency === "XOF" ||
      user.currency === "XAF";
    const isCHF = user.currency === "CHF";
    const decimals = isCFA && Number.isInteger(amount) ? 0 : 2;
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    if (isCFA) {
      return type === "expense" ? `-${formatted} FCFA` : `+${formatted} FCFA`;
    }
    if (isCHF) {
      return type === "expense" ? `-${formatted} CHF` : `+${formatted} CHF`;
    }
    return type === "expense"
      ? `-${user.currency}${formatted}`
      : `+${user.currency}${formatted}`;
  };

  return (
    <div data-tour="home-recent" className="mt-5 pb-24">
      {/* Title & Filter Tabs */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Recent Transactions
        </h2>

        {/* Filter buttons */}
        <div className="flex items-center bg-slate-100/90 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700">
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
              filterType === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
              filterType === "expense"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Sorties
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
              filterType === "income"
                ? "bg-white dark:bg-slate-900 text-accent font-bold shadow-2xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Entrées
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {sortedDates.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            Aucune transaction enregistrée pour ce profil
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 text-xs font-semibold text-accent hover:underline underline-offset-4"
          >
            + Enregistrer une nouvelle transaction
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateStr) => {
            const dayTxs = groupedTransactions[dateStr];
            const firstCategory = getCategory(dayTxs[0].categoryId);

            return (
              <div key={dateStr} className="space-y-2">
                {/* Date header with bullet dot */}
                <div className="flex items-center gap-2 px-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: firstCategory.bgColor }}
                  />
                  <span className="text-[12px] font-semibold text-slate-400 tracking-normal">
                    {formatDateHeader(dateStr)}
                  </span>
                </div>

                {/* Items in date */}
                <div className="space-y-2">
                  {dayTxs.map((tx) => {
                    const cat = getCategory(tx.categoryId);
                    const isExpense = tx.type === "expense";

                    return (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-all active:scale-[0.99] shadow-2xs overflow-hidden"
                      >
                        {/* Left: Squircle Icon + Name & Category (with min-w-0, flex-1, and truncate to strictly clip long titles) */}
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2.5 overflow-hidden">
                          <div
                            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: cat.bgColor }}
                          >
                            <CategoryIcon
                              iconName={cat.icon}
                              size={20}
                              className="text-white"
                            />
                          </div>

                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h4
                              className="text-sm font-bold text-slate-900 dark:text-white truncate leading-snug block w-full"
                              title={tx.title}
                            >
                              {tx.title}
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5 block w-full">
                              {cat.name}
                            </p>
                          </div>
                        </div>

                        {/* Right: Amount & Timestamp (strictly shrink-0, min-w-fit, whitespace-nowrap to never overflow) */}
                        <div className="text-right shrink-0 min-w-fit pl-1 whitespace-nowrap">
                          <span
                            className={`text-sm font-bold font-mono-numbers block whitespace-nowrap ${
                              isExpense
                                ? "text-slate-900 dark:text-white"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {formatAmount(tx.amount, tx.type)}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono-numbers mt-0.5 block whitespace-nowrap">
                            {tx.time || "12:00"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Détail de la transaction
              </span>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Info */}
            <div className="mt-4 flex items-center gap-3.5">
              {(() => {
                const cat = getCategory(selectedTx.categoryId);
                return (
                  <>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <CategoryIcon
                        iconName={cat.icon}
                        size={28}
                        className="text-white"
                      />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h3
                        className="text-lg font-bold text-slate-900 dark:text-white break-words leading-tight"
                        title={selectedTx.title}
                      >
                        {selectedTx.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                        {cat.name} ·{" "}
                        {selectedTx.type === "expense" ? "Dépense" : "Revenu"}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Amount Banner */}
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Montant net
              </span>
              <span
                className={`text-2xl font-bold font-mono-numbers ${
                  selectedTx.type === "expense"
                    ? "text-slate-900 dark:text-white"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {formatAmount(selectedTx.amount, selectedTx.type)}
              </span>
            </div>

            {/* Meta tags */}
            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>Date : {formatDateHeader(selectedTx.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span>Heure : {selectedTx.time || "Non spécifiée"}</span>
              </div>
              {selectedTx.note && (
                <div className="flex items-start gap-2 pt-1">
                  <Tag size={14} className="text-slate-400 mt-0.5" />
                  <span className="text-slate-500 dark:text-slate-400 italic">
                    « {selectedTx.note} »
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setEditingTransaction(selectedTx);
                  setSelectedTx(null);
                  setIsAddModalOpen(true);
                }}
                className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 size={15} />
                Modifier
              </button>
              <button
                onClick={() => {
                  deleteTransaction(selectedTx.id);
                  setSelectedTx(null);
                }}
                className="h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={15} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
