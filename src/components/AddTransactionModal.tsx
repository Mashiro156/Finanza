import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { TransactionType } from "../types/finance";
import { CategoryIcon } from "./CategoryIcon";
import {
  X,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Settings2,
} from "lucide-react";

export const AddTransactionModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingTransaction,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
    categories,
    user,
    labels,
    addLabel,
    updateLabel,
    deleteLabel,
  } = useFinance();

  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  // Label management state
  const [isManagingLabels, setIsManagingLabels] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState("");
  const [editingLabelOld, setEditingLabelOld] = useState<string | null>(null);
  const [editingLabelNew, setEditingLabelNew] = useState("");

  // Current active labels for the type
  const activeLabels = labels ? labels[type] || [] : [];

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || "12:00");
      setNote(editingTransaction.note || "");
    } else {
      // Default new transaction values
      setType("expense");
      setTitle("");
      setAmount("");
      const defaultCat = categories.find(
        (c) => c.type === "expense" || c.type === "both",
      );
      setCategoryId(defaultCat ? defaultCat.id : "food");

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);

      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${min}`);
      setNote("");
    }
  }, [editingTransaction, isAddModalOpen, categories]);

  if (!isAddModalOpen) return null;

  // Amount input strictly numeric validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Replace comma with dot or keep comma, but remove all non-numeric characters
    let cleaned = raw.replace(/[^0-9.,]/g, "");

    // Allow at most one decimal separator
    const firstSep = cleaned.search(/[.,]/);
    if (firstSep !== -1) {
      const before = cleaned.slice(0, firstSep + 1);
      const after = cleaned.slice(firstSep + 1).replace(/[.,]/g, "");
      cleaned = before + after;
    }
    setAmount(cleaned);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigational and editing keys
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }
    // Allow Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    // Allow numeric characters and dot/comma
    if (!/^[0-9.,]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleCreateLabel = () => {
    const trimmed = newLabelInput.trim();
    if (!trimmed) return;
    addLabel(type, trimmed);
    setNewLabelInput("");
  };

  const handleSaveEditedLabel = (oldLabel: string) => {
    const trimmed = editingLabelNew.trim();
    if (!trimmed) return;
    updateLabel(type, oldLabel, trimmed);
    setEditingLabelOld(null);
    setEditingLabelNew("");
  };

  const availableCategories = categories.filter(
    (c) => c.type === type || c.type === "both",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, "").replace(",", "."));
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        title: title.trim(),
        amount: numAmount,
        type,
        categoryId: categoryId || availableCategories[0]?.id || "food",
        date,
        time,
        note: note.trim() || undefined,
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        categoryId: categoryId || availableCategories[0]?.id || "food",
        date,
        time,
        note: note.trim() || undefined,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    setIsManagingLabels(false);
    setEditingLabelOld(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingTransaction
                ? "Modifier la transaction"
                : "Nouvelle transaction"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-4 no-scrollbar"
        >
          {/* Type Selector (Dépense vs Revenu) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                const firstExp = categories.find((c) => c.type === "expense");
                if (firstExp) setCategoryId(firstExp.id);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === "expense"
                  ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sortie (Dépense)
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                const firstInc = categories.find((c) => c.type === "income");
                if (firstInc) setCategoryId(firstInc.id);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === "income"
                  ? "bg-white dark:bg-slate-900 text-accent font-bold shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Entrée (Revenu)
            </button>
          </div>

          {/* Amount Input with strict numeric enforcement */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Montant ({user.currency})
            </label>
            <div className="relative">
              {user.currency === "FCFA" || user.currency === "CFA" ? (
                <>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={handleAmountChange}
                    onKeyDown={handleAmountKeyDown}
                    className="w-full pl-4 pr-18 py-3 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white dark:focus:bg-slate-900 font-mono-numbers"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono-numbers">
                    FCFA
                  </span>
                </>
              ) : (
                <>
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 font-mono-numbers">
                    {user.currency}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    onKeyDown={handleAmountKeyDown}
                    className="w-full pl-9 pr-4 py-3 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white dark:focus:bg-slate-900 font-mono-numbers"
                  />
                </>
              )}
            </div>
          </div>

          {/* Title / Description & Libellés management */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Libellé / Destinataire
              </label>
              <button
                type="button"
                onClick={() => setIsManagingLabels(!isManagingLabels)}
                className={`text-[10px] font-semibold flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded-md ${
                  isManagingLabels
                    ? "bg-accent-light text-accent-themed"
                    : "text-slate-400 hover:text-accent"
                }`}
              >
                <Settings2 size={12} />
                <span>
                  {isManagingLabels ? "Fermer gestion" : "Gérer les libellés"}
                </span>
              </button>
            </div>

            <input
              type="text"
              required
              placeholder={
                type === "expense"
                  ? "Ex: Monoprix Courses, Café Nomade..."
                  : "Ex: Salaire, Remboursement..."
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white dark:focus:bg-slate-900"
            />

            {/* Quick Suggestions & Management */}
            {!isManagingLabels ? (
              <div className="space-y-1.5 mt-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {activeLabels.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setTitle(sug)}
                      className={`px-2 py-0.5 text-[11px] rounded-md transition-colors ${
                        title === sug
                          ? "bg-accent text-white font-semibold shadow-2xs"
                          : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Save typed title as label shortcut */}
                {title.trim() && !activeLabels.includes(title.trim()) && (
                  <button
                    type="button"
                    onClick={() => addLabel(type, title.trim())}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-themed bg-accent-light hover:opacity-90 px-2 py-0.5 rounded-md transition-colors border border-accent"
                  >
                    <Plus size={12} />
                    <span>
                      Enregistrer « {title.trim()} » comme libellé rapide
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Label Management Panel */
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>
                    Personnaliser les libellés (
                    {type === "expense" ? "Dépenses" : "Revenus"})
                  </span>
                </div>

                {/* Add new label input */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nouveau libellé..."
                    value={newLabelInput}
                    onChange={(e) => setNewLabelInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={handleCreateLabel}
                    className="px-2.5 py-1 bg-accent hover:opacity-90 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus size={13} />
                    Ajouter
                  </button>
                </div>

                {/* Existing labels with inline edit & delete */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                  {activeLabels.map((label) => {
                    const isEditing = editingLabelOld === label;
                    return (
                      <div
                        key={label}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full">
                            <input
                              type="text"
                              autoFocus
                              value={editingLabelNew}
                              onChange={(e) =>
                                setEditingLabelNew(e.target.value)
                              }
                              className="flex-1 px-1.5 py-0.5 text-xs border border-accent rounded focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditedLabel(label)}
                              className="p-1 bg-accent text-white rounded hover:opacity-90"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingLabelOld(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                              {label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLabelOld(label);
                                  setEditingLabelNew(label);
                                }}
                                className="p-1 text-slate-400 hover:text-accent rounded"
                                title="Modifier ce libellé"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLabel(type, label)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Supprimer ce libellé"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Category Picker */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Catégorie
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 no-scrollbar">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                      isSelected
                        ? "border-accent bg-accent-light ring-2 ring-accent/30"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <CategoryIcon
                        iconName={cat.icon}
                        size={16}
                        className="text-white"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Heure
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Note (facultatif)
            </label>
            <input
              type="text"
              placeholder="Ex: Déjeuner pro, voyage..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-accent hover:opacity-95 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-accent transition-all"
            >
              <Check size={18} />
              {editingTransaction
                ? "Enregistrer les modifications"
                : "Ajouter la transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
