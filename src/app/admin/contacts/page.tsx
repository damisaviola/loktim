import { getContactMessagesAction } from "@/app/actions/contact";
import { Mail, MessageSquare, Inbox, Clock, CheckCircle2, Archive } from "lucide-react";
import ContactsTable, { ContactMessageItem } from "./ContactsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Pesan Kontak - Admin LokerTimika",
  description: "Manajemen dan tindak lanjut pesan, pertanyaan, dan permohonan dari formulir kontak LokerTimika.",
};

export default async function AdminContactsPage() {
  const messages: ContactMessageItem[] = await getContactMessagesAction();

  const totalCount = messages.length;
  const unreadCount = messages.filter((m: ContactMessageItem) => m.status === "unread").length;
  const repliedCount = messages.filter((m: ContactMessageItem) => m.status === "replied").length;
  const archivedCount = messages.filter((m: ContactMessageItem) => m.status === "archived").length;

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
            <Mail className="w-4 h-4" />
            <span>Pusat Bantuan &amp; Inbox</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Pesan &amp; Permintaan Kontak
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola, tinjau, dan balas pesan atau laporan dari pengguna serta pelaku usaha di Timika.
          </p>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Pesan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Masuk</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        {/* Belum Dibaca */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Perlu Tindak Lanjut</span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-700">{unreadCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Sudah Dibalas */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Sudah Dibalas</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">{repliedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Diarsipkan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diarsipkan</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-700">{archivedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Archive className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. INTERACTIVE CONTACTS TABLE */}
      <ContactsTable initialMessages={messages} />

    </div>
  );
}
