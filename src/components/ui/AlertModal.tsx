"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

export type AlertType = "error" | "warning" | "success" | "info";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
  buttonText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "warning",
  buttonText = "Saya Mengerti",
}: AlertModalProps) {
  const getIconAndStyle = () => {
    switch (type) {
      case "error":
        return {
          icon: <XCircle className="w-6 h-6 text-rose-500" />,
          bg: "bg-rose-50 border-rose-100",
          titleDefault: "Validasi Gagal",
          buttonBg: "bg-rose-600 hover:bg-rose-700 text-white",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
          bg: "bg-emerald-50 border-emerald-100",
          titleDefault: "Berhasil",
          buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
        };
      case "info":
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          bg: "bg-blue-50 border-blue-100",
          titleDefault: "Informasi",
          buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "warning":
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-500" />,
          bg: "bg-amber-50 border-amber-100",
          titleDefault: "Perhatian",
          buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
        };
    }
  };

  const config = getIconAndStyle();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-slate-200/80 shadow-xl bg-white/95 backdrop-blur-md">
        <DialogHeader className="flex flex-col items-center text-center space-y-3 pt-2">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xs ${config.bg}`}
          >
            {config.icon}
          </div>
          <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
            {title || config.titleDefault}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-600 leading-relaxed pt-1">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-6 h-11 rounded-2xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${config.buttonBg}`}
          >
            {buttonText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
