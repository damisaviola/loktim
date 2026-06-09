"use client";

import { useState, useEffect } from "react";
import { getAdminCategoriesAction } from "@/app/actions/job";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/category";
import { 
  Tags, 
  Eye, 
  Edit, 
  Trash2,
  Briefcase,
  X,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Building,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // CRUD States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = () => {
    setIsLoading(true);
    getAdminCategoriesAction().then(data => {
      setDbCategories(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;
    setIsSubmitting(true);
    const res = await createCategoryAction(categoryNameInput.trim());
    setIsSubmitting(false);
    if (res.success) {
      setIsAddModalOpen(false);
      setCategoryNameInput("");
      fetchCategories();
    } else {
      alert("Gagal menambahkan kategori: " + res.error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !categoryNameInput.trim()) return;
    setIsSubmitting(true);
    const res = await updateCategoryAction(editingCategory.id, editingCategory.name, categoryNameInput.trim());
    setIsSubmitting(false);
    if (res.success) {
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setCategoryNameInput("");
      fetchCategories();
    } else {
      alert("Gagal mengubah kategori: " + res.error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    const res = await deleteCategoryAction(editingCategory.id);
    setIsSubmitting(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } else {
      alert("Gagal menghapus kategori: " + res.error);
    }
  };

  const {
    inputValue,
    setInputValue,
    sortKey,
    sortDirection,
    handleSort,
    processedData
  } = useTableSortAndSearch(
    dbCategories,
    (category, query) => 
      category.name.toLowerCase().includes(query)
  );

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity inline-block ml-1" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary inline-block ml-1" /> : <ChevronDown className="w-4 h-4 text-primary inline-block ml-1" />;
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Kategori Pekerjaan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan daftar kategori lowongan dan jumlah lowongan aktif di setiap kategori.
          </p>
        </div>
        <button 
          onClick={() => {
            setCategoryNameInput("");
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          Tambah Kategori
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Toolbar & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {dbCategories.length} Kategori
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kategori..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9 h-9 bg-white border-gray-200 shadow-sm text-sm focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Nama Kategori <SortIcon columnKey="name" />
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 font-medium text-center cursor-pointer select-none group hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('jobCount')}
                >
                  <div className="flex items-center justify-center">
                    Total Lowongan <SortIcon columnKey="jobCount" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Memuat data kategori...
                  </td>
                </tr>
              ) : processedData.length > 0 ? (
                processedData.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                          <Tags className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            ID: {category.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                        <Briefcase className="h-3.5 w-3.5" />
                        {category.jobCount} Lowongan
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setSelectedCategory(category)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/5 p-1.5 rounded-md transition-colors" 
                          title="Lihat Perusahaan"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryNameInput(category.name);
                            setIsEditModalOpen(true);
                          }}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-md transition-colors" 
                          title="Edit Kategori"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCategory(category);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors" 
                          title="Hapus"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-900">Pencarian tidak ditemukan</p>
                      <p className="text-sm mt-1">Tidak ada kategori yang cocok dengan pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>

      {/* Modal Detail Kategori */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detail Kategori</h2>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              {/* Category Info */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <Tags className="w-8 h-8 text-primary" />
                </div>
                <div className="pt-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h1>
                  <div className="mt-2 text-sm text-gray-600 bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block font-medium border border-blue-100">
                    {selectedCategory.jobCount} Lowongan Aktif
                  </div>
                </div>
              </div>

              {/* Companies List */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Perusahaan di Kategori Ini</h3>
                <div className="space-y-3">
                  {selectedCategory.companies && selectedCategory.companies.length > 0 ? (
                    selectedCategory.companies.map((company: any) => (
                      <div 
                        key={company.id} 
                        onClick={() => router.push(`/admin/jobs?search=${encodeURIComponent(company.name)}`)}
                        className="cursor-pointer border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 hover:border-primary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                            {company.logoUrl ? (
                              <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                            ) : (
                              <Building className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{company.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {company.id}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada perusahaan yang membuka lowongan di kategori ini.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={isEditModalOpen ? handleUpdateCategory : handleCreateCategory}>
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditModalOpen ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h2>
                <button 
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
                <Input 
                  required
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="Contoh: IT & Software"
                  className="w-full"
                />
                {isEditModalOpen && (
                  <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded border border-amber-200">
                    Perhatian: Mengubah nama kategori akan secara otomatis memperbarui nama kategori ini di semua lowongan yang terkait.
                  </p>
                )}
              </div>
              <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !categoryNameInput.trim()}
                  className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Kategori?</h2>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus kategori <strong>{editingCategory.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              {editingCategory.jobCount > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Peringatan: Ada {editingCategory.jobCount} lowongan yang masih menggunakan kategori ini!
                </span>
              )}
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteCategory}
                disabled={isSubmitting}
                className="px-5 py-2.5 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
