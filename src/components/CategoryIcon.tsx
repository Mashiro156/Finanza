import React from "react";
import {
  Coffee,
  ShoppingCart,
  Home,
  Radio,
  Car,
  Building,
  Sparkles,
  HeartPulse,
  Banknote,
  Briefcase,
  TrendingUp,
  PlusCircle,
  Plane,
  ShieldCheck,
  Laptop,
  CreditCard,
  Utensils,
  Smartphone,
  Gift,
  HelpCircle,
} from "lucide-react";

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  className = "w-5 h-5 text-white",
  size = 20,
}) => {
  switch (iconName.toLowerCase()) {
    case "coffee":
    case "food":
      return <Coffee size={size} className={className} />;
    case "shoppingcart":
    case "cart":
    case "groceries":
      return <ShoppingCart size={size} className={className} />;
    case "home":
    case "travel":
      return <Home size={size} className={className} />;
    case "radio":
    case "spotify":
    case "subscriptions":
      return <Radio size={size} className={className} />;
    case "car":
    case "transport":
      return <Car size={size} className={className} />;
    case "building":
    case "housing":
      return <Building size={size} className={className} />;
    case "sparkles":
    case "leisure":
      return <Sparkles size={size} className={className} />;
    case "heartpulse":
    case "health":
      return <HeartPulse size={size} className={className} />;
    case "banknote":
    case "salary":
      return <Banknote size={size} className={className} />;
    case "briefcase":
    case "freelance":
      return <Briefcase size={size} className={className} />;
    case "trendingup":
    case "investment":
      return <TrendingUp size={size} className={className} />;
    case "plane":
      return <Plane size={size} className={className} />;
    case "shieldcheck":
      return <ShieldCheck size={size} className={className} />;
    case "laptop":
      return <Laptop size={size} className={className} />;
    case "creditcard":
      return <CreditCard size={size} className={className} />;
    case "utensils":
      return <Utensils size={size} className={className} />;
    case "smartphone":
      return <Smartphone size={size} className={className} />;
    case "gift":
      return <Gift size={size} className={className} />;
    case "pluscircle":
    default:
      return <PlusCircle size={size} className={className} />;
  }
};
