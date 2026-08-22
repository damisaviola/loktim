"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Mail, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Trash2, 
  Archive, 
  Building2, 
  Phone, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Filter,
  Calendar,
  ArrowUpDown,
  X,
  SlidersHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { 
  updateContactMessageStatusAction, 
  deleteContactMessageAction 
} from "@/app/actions/contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";

export interface ContactMessageItem {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  category: string;
  subject: string;
  message: string;
  status: string; // unread, read, replied, archived
  replyNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContactsTableProps {
  initialMessages: ContactMessageItem[];
}

export default function ContactsTable({ initialMessages }: ContactsTableProps) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessageItem | null>(null);
  const [replyNotesInput, setReplyNotesInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filtered & Sorted Messages
  const filteredAndSortedMessages = useMemo(() => {
    let result = messages.filter((msg) => {
      // 1. Status Filter
      if (statusFilter !== "all" && msg.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter
      if (dateFilter !== "all") {
        const msgDate = new Date(msg.createdAt).getTime();
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (dateFilter === "today") {
          const startOfToday = new Date().setHours(0, 0, 0, 0);
          if (msgDate < startOfToday) return false;
        } else if (dateFilter === "week") {
          if (now - msgDate > 7 * oneDay) return false;
        } else if (dateFilter === "month") {
          if (now - msgDate > 30 * oneDay) return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTicket = msg.ticketId.toLowerCase().includes(q);
        const matchName = msg.name.toLowerCase().includes(q);
        const matchEmail = msg.email.toLowerCase().includes(q);
        const matchPhone = msg.phone?.toLowerCase().includes(q) || false;
        const matchOrg = msg.organization?.toLowerCase().includes(q) || false;
        const matchSubject = msg.subject.toLowerCase().includes(q);
        const matchBody = msg.message.toLowerCase().includes(q);
        return matchTicket || matchName || matchEmail || matchPhone || matchOrg || matchSubject || matchBody;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name_desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [messages, statusFilter, dateFilter, searchQuery, sortBy]);

  // Counts for tabs
  const counts = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => m.status === "unread").length;
    const read = messages.filter((m) => m.status === "read").length;
    const replied = messages.filter((m) => m.status === "replied").length;
    const archived = messages.filter((m) => m.status === "archived").length;
    return { total, unread, read, replied, archived };
  }, [messages]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedMessages.length / itemsPerPage) || 1;
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedMessages.slice(start, start + itemsPerPage);
  }, [filteredAndSortedMessages, currentPage]);

  const isFiltered = statusFilter !== "all" || dateFilter !== "all" || searchQuery.trim() !== "" || sortBy !== "newest";

  const handleResetFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleOpenDetail = async (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    setReplyNotesInput(msg.replyNotes || "");
    setIsDetailOpen(true);

    if (msg.status === "unread") {
      try {
        await updateContactMessageStatusAction(msg.id, "read");
        setMessages((prev) =>
          prev.map((item) =>
            item.id === msg.id ? { ...item, status: "read" } : item
          )
        );
        setSelectedMessage((prev) => (prev ? { ...prev, status: "read" } : null));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedMessage) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateContactMessageStatusAction(selectedMessage.id, newStatus, replyNotesInput);
      if (res.success) {
        toast.success(`Status berhasil diubah ke ${getStatusLabel(newStatus)}`);
        setMessages((prev) =>
          prev.map((item) =>
            item.id === selectedMessage.id
              ? { ...item, status: newStatus, replyNotes: replyNotesInput }
              : item
          )
        );
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus, replyNotes: replyNotesInput } : null));
      } else {
        toast.error(res.error || "Gagal memperbarui status");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateContactMessageStatusAction(selectedMessage.id, selectedMessage.status, replyNotesInput);
      if (res.success) {
        toast.success("Catatan internal tersimpan!");
        setMessages((prev) =>
          prev.map((item) =>
            item.id === selectedMessage.id
              ? { ...item, replyNotes: replyNotesInput }
              : item
          )
        );
      } else {
        toast.error(res.error || "Gagal menyimpan catatan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteContactMessageAction(messageToDelete.id);
      if (res.success) {
        toast.success("Pesan berhasil dihapus!");
        setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
        if (selectedMessage?.id === messageToDelete.id) {
          setIsDetailOpen(false);
          setSelectedMessage(null);
        }
        setIsDeleteModalOpen(false);
        setMessageToDelete(null);
      } else {
        toast.error(res.error || "Gagal menghapus pesan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Belum Dibaca
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold border border-sky-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Sudah Dibaca
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Sudah Dibalas
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
            <Archive className="w-3 h-3 text-slate-500" />
            Diarsipkan
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "unread": return "Belum Dibaca";
      case "read": return "Sudah Dibaca";
      case "replied": return "Sudah Dibalas";
      case "archived": return "Diarsipkan";
      default: return status;
    }
  };

  const generateWaLink = (phone: string, name: string, ticketId: string, subject: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const text = encodeURIComponent(
      `Halo ${name}, terima kasih telah menghubungi LokerTimika terkait "${subject}" (Tiket: ${ticketId}).\n\nMenanggapi pesan Anda:\n`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const generateMailtoLink = (email: string, name: string, ticketId: string, subject: string) => {
    const sub = encodeURIComponent(`[LokerTimika - Tiket ${ticketId}] Re: ${subject}`);
    const body = encodeURIComponent(
      `Halo ${name},\n\nTerima kasih telah menghubungi Pusat Bantuan LokerTimika.\n\nMenanggapi pesan Anda:\n\n`
    );
    return `mailto:${email}?subject=${sub}&body=${body}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. FILTER TABS & CONTROL PANEL */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
            }`}
          >
            <span>Semua Pesan</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700 font-semibold"}`}>
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter("unread"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "unread"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50/50"
            }`}
          >
            <span>Belum Dibaca</span>
            {counts.unread > 0 && (
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusFilter === "unread" ? "bg-rose-700 text-white" : "bg-rose-100 text-rose-800"}`}>
                {counts.unread}
              </span>
            )}
          </button>

          <button
            onClick={() => { setStatusFilter("read"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "read"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
            }`}
          >
            <span>Sudah Dibaca</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "read" ? "bg-sky-700 text-white" : "bg-slate-200 text-slate-700 font-semibold"}`}>
              {counts.read}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter("replied"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "replied"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
            }`}
          >
            <span>Sudah Dibalas</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "replied" ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700 font-semibold"}`}>
              {counts.replied}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter("archived"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "archived"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
            }`}
          >
            <span>Diarsipkan</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "archived" ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700 font-semibold"}`}>
              {counts.archived}
            </span>
          </button>
        </div>

        {/* Filter Controls: Search + Date + Sort + Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-1 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari tiket, pengirim, subjek, isi pesan..."
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="lg:col-span-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-9 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-9 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="oldest">Urutkan: Terlama</option>
              <option value="name_asc">Nama: A - Z</option>
              <option value="name_desc">Nama: Z - A</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

        </div>

        {/* Active Filter Indicators & Reset */}
        {isFiltered && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs flex-wrap">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>
                Menampilkan <strong>{filteredAndSortedMessages.length}</strong> hasil filter dari total <strong>{messages.length}</strong> pesan
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}

      </div>

      {/* 2. DATA VIEW SECTION (DESKTOP TABLE + MOBILE CARD VIEW) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredAndSortedMessages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Tidak ada pesan ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isFiltered
                  ? "Coba ubah kriteria pencarian atau klik Reset Filter untuk menampilkan semua pesan."
                  : "Belum ada pesan kontak yang masuk ke sistem."}
              </p>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* A. MOBILE VIEW: RESPONSIVE CARDS (< md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {paginatedMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenDetail(msg)}
                  className={`p-4 space-y-3 transition-colors cursor-pointer active:bg-slate-50 ${
                    msg.status === "unread" ? "bg-rose-50/20" : ""
                  }`}
                >
                  {/* Top Bar: Ticket + Date + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                        {msg.ticketId}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <div>
                      {getStatusBadge(msg.status)}
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {msg.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs truncate">{msg.name}</span>
                        {msg.organization && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                            <Building2 className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[120px]">{msg.organization}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{msg.email}</div>
                    </div>
                  </div>

                  {/* Subject & Preview */}
                  <div className="space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{msg.subject}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {msg.message}
                    </p>
                    {msg.replyNotes && (
                      <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium inline-block mt-1">
                        Catatan: {msg.replyNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(msg)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {msg.phone && (
                        <a
                          href={generateWaLink(msg.phone, msg.name, msg.ticketId, msg.subject)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href={generateMailtoLink(msg.email, msg.name, msg.ticketId, msg.subject)}
                        className="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setMessageToDelete(msg);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* B. DESKTOP VIEW: ULTRA-NEAT TABLE (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Tiket &amp; Waktu</th>
                    <th className="py-3.5 px-4">Pengirim</th>
                    <th className="py-3.5 px-4">Subjek &amp; Cuplikan Pesan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedMessages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        msg.status === "unread" ? "bg-rose-50/20 font-semibold" : ""
                      }`}
                      onClick={() => handleOpenDetail(msg)}
                    >
                      {/* Ticket & Date */}
                      <td className="py-4 px-6 whitespace-nowrap align-top">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            {msg.ticketId}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(msg.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Sender Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs mt-0.5">
                            {msg.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-0.5 min-w-0 max-w-[200px]">
                            <div className="font-bold text-slate-900 truncate">
                              {msg.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate" title={msg.email}>
                              {msg.email}
                            </div>
                            {msg.phone && (
                              <div className="text-[11px] text-emerald-700 font-mono font-medium truncate flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{msg.phone}</span>
                              </div>
                            )}
                            {msg.organization && (
                              <div className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                                <Building2 className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[140px]">{msg.organization}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject & Snippet */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1 max-w-[320px] lg:max-w-[420px]">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {msg.subject}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                            {msg.message}
                          </p>
                          {msg.replyNotes && (
                            <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium inline-block mt-1">
                              Catatan: {msg.replyNotes}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        {getStatusBadge(msg.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap align-top text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(msg)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-600 transition-colors cursor-pointer"
                            title="Lihat Detail Pesan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {msg.phone && (
                            <a
                              href={generateWaLink(msg.phone, msg.name, msg.ticketId, msg.subject)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors shadow-2xs"
                              title="Balas via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <a
                            href={generateMailtoLink(msg.email, msg.name, msg.ticketId, msg.subject)}
                            className="p-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 transition-colors shadow-2xs"
                            title="Balas via Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setMessageToDelete(msg);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total <strong>{filteredAndSortedMessages.length}</strong> pesan)
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. DETAIL MESSAGE DIALOG (CLEAN & MINIMALIST) */}
      {selectedMessage && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-slate-200/90 shadow-2xl bg-white">
            
            {/* Minimalist Header */}
            <DialogHeader className="p-5 sm:p-6 border-b border-slate-100 space-y-2 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5">
                    <span>{selectedMessage.ticketId}</span>
                    <button
                      onClick={() => handleCopy(selectedMessage.ticketId, "Nomor Tiket")}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Salin Nomor Tiket"
                    >
                      {copiedField === "Nomor Tiket" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </span>
                  <span className="text-[11px] text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                <div>
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>

              <DialogTitle className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug pt-1 text-left">
                {selectedMessage.subject}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 text-left">
                Rincian pesan kontak dari {selectedMessage.name} ({selectedMessage.email})
              </DialogDescription>
            </DialogHeader>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              
              {/* Minimalist Sender Identity Bar */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {selectedMessage.name.slice(0, 2).toUpperCase()}
                </div>
                
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{selectedMessage.name}</span>
                    {selectedMessage.organization && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {selectedMessage.organization}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{selectedMessage.email}</span>
                      <button
                        onClick={() => handleCopy(selectedMessage.email, "Email")}
                        className="text-slate-400 hover:text-slate-700 p-0.5"
                        title="Salin Email"
                      >
                        {copiedField === "Email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {selectedMessage.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono text-emerald-800 font-semibold">{selectedMessage.phone}</span>
                        <button
                          onClick={() => handleCopy(selectedMessage.phone || "", "Nomor WA")}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Salin Nomor WA"
                        >
                          {copiedField === "Nomor WA" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Isi Pesan
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Minimalist Direct Reply & Status Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Balas Pengirim
                  </span>

                  <div className="flex items-center gap-2">
                    {selectedMessage.phone && (
                      <a
                        href={generateWaLink(selectedMessage.phone, selectedMessage.name, selectedMessage.ticketId, selectedMessage.subject)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    <a
                      href={generateMailtoLink(selectedMessage.email, selectedMessage.name, selectedMessage.ticketId, selectedMessage.subject)}
                      className="h-8 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                </div>

                {/* Status Segmented Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Status Pesan
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus("unread")}
                      disabled={isUpdatingStatus}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                        selectedMessage.status === "unread"
                          ? "bg-white text-rose-700 shadow-2xs border border-rose-200/60"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Belum Dibaca
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus("read")}
                      disabled={isUpdatingStatus}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                        selectedMessage.status === "read"
                          ? "bg-white text-sky-700 shadow-2xs border border-sky-200/60"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Dibaca
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus("replied")}
                      disabled={isUpdatingStatus}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                        selectedMessage.status === "replied"
                          ? "bg-white text-emerald-700 shadow-2xs border border-emerald-200/60"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Dibalas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus("archived")}
                      disabled={isUpdatingStatus}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                        selectedMessage.status === "archived"
                          ? "bg-white text-slate-800 shadow-2xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Arsip
                    </button>
                  </div>
                </div>

                {/* Minimalist Admin Notes */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Catatan Internal Admin
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyNotesInput}
                      onChange={(e) => setReplyNotesInput(e.target.value)}
                      placeholder="Catatan tindak lanjut (misal: Telah direspons lewat WA)..."
                      className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isUpdatingStatus}
                      className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Minimalist Footer */}
            <div className="bg-slate-50/80 px-5 sm:px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMessageToDelete(selectedMessage);
                  setIsDeleteModalOpen(true);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="h-8 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </DialogContent>
        </Dialog>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && messageToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-3xl">
            <DialogHeader className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Hapus Pesan Kontak?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Pesan dari <strong>{messageToDelete.name}</strong> ({messageToDelete.ticketId}) akan dihapus permanen dari sistem dan tidak dapat dikembalikan.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2.5 justify-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setMessageToDelete(null);
                }}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
