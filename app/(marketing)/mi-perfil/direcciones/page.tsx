"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Star, Pencil, Trash2, X, CheckCircle } from "lucide-react";

interface Direccion {
  id:            string;
  label:         string;
  calle:         string;
  numero:        string;
  apartamento?:  string;
  ciudad:        string;
  estado:        string;
  codigo_postal: string;
  pais:          string;
  is_default:    boolean;
}

const EMPTY: Omit<Direccion, "id" | "is_default" | "pais"> = {
  label: "", calle: "", numero: "", apartamento: "", ciudad: "", estado: "", codigo_postal: "",
};

const ESTADOS_MX = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua",
  "Ciudad de México","Coahuila","Colima","Durango","Estado de México","Guanajuato","Guerrero",
  "Hidalgo","Jalisco","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
  "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala",
  "Veracruz","Yucatán","Zacatecas",
];

export default function DireccionesPage() {
  const [direcciones,  setDirecciones]  = useState<Direccion[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState<"add" | "edit" | null>(null);
  const [editTarget,   setEditTarget]   = useState<Direccion | null>(null);
  const [form,         setForm]         = useState({ ...EMPTY });
  const [saving,       setSaving]       = useState(false);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [confirmId,    setConfirmId]    = useState<string | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [formError,    setFormError]    = useState("");

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const cargar = async () => {
    try {
      const res = await fetch("/api/mi-perfil/direcciones");
      const d   = await res.json();
      setDirecciones(d.direcciones ?? []);
    } catch {
      showToast("Error al cargar direcciones", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const openAdd  = () => { setForm({ ...EMPTY }); setFormError(""); setModal("add"); };
  const openEdit = (d: Direccion) => { setEditTarget(d); setForm({ label: d.label, calle: d.calle, numero: d.numero, apartamento: d.apartamento ?? "", ciudad: d.ciudad, estado: d.estado, codigo_postal: d.codigo_postal }); setFormError(""); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSave = async () => {
    if (!form.label.trim() || !form.calle.trim() || !form.numero.trim() || !form.ciudad.trim() || !form.estado.trim() || !form.codigo_postal.trim()) {
      setFormError("Todos los campos obligatorios deben estar completos");
      return;
    }
    if (!/^\d{5}$/.test(form.codigo_postal.trim())) {
      setFormError("El código postal debe tener exactamente 5 dígitos");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const url    = modal === "edit" ? `/api/mi-perfil/direcciones/${editTarget!.id}` : "/api/mi-perfil/direcciones";
      const method = modal === "edit" ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      showToast(modal === "edit" ? "Dirección actualizada" : "Dirección agregada", true);
      closeModal();
      cargar();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res  = await fetch(`/api/mi-perfil/direcciones/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al eliminar");
      showToast("Dirección eliminada", true);
      setConfirmId(null);
      cargar();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al eliminar", false);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res  = await fetch(`/api/mi-perfil/direcciones/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_default: true }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      cargar();
    } catch {
      showToast("Error al actualizar dirección predeterminada", false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5CB996]/40 bg-white";
  const labelCls = "block text-xs font-sans font-medium text-gray-500 mb-1.5";

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-sans font-medium"
          style={{ background: toast.ok ? "#EBF8F2" : "#FEE2E2", color: toast.ok ? "#1A6840" : "#B91C1C" }}>
          {toast.ok && <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-sans font-semibold text-base" style={{ color: "#0D1A0F" }}>
          Mis direcciones
        </h2>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-sans font-semibold text-white" style={{ background: "#5CB996" }}>
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} /></div>
      ) : direcciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-gray-400 text-sm font-sans">No tienes direcciones guardadas.</p>
          <button onClick={openAdd} className="mt-4 text-sm font-sans font-semibold underline" style={{ color: "#5CB996" }}>Agregar la primera</button>
        </div>
      ) : (
        <div className="space-y-3">
          {direcciones.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
              {d.is_default && <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5CB996" }} fill="#5CB996" />}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-sm" style={{ color: "#0D1A0F" }}>{d.label}</p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  {d.calle} {d.numero}{d.apartamento ? `, ${d.apartamento}` : ""}, {d.ciudad}, {d.estado} {d.codigo_postal}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!d.is_default && (
                  <button onClick={() => handleSetDefault(d.id)} className="text-xs font-sans text-gray-400 hover:text-gray-600">
                    Predeterminar
                  </button>
                )}
                <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-gray-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirmId(d.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal agregar/editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-base" style={{ color: "#0D1A0F" }}>
                {modal === "edit" ? "Editar dirección" : "Nueva dirección"}
              </h3>
              <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div>
              <label className={labelCls}>Etiqueta *</label>
              <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Casa, Oficina…" maxLength={50} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Calle *</label>
                <input value={form.calle} onChange={(e) => setForm((f) => ({ ...f, calle: e.target.value }))} placeholder="Av. Principal" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Número *</label>
                <input value={form.numero} onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))} placeholder="123" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Apartamento / Interior</label>
              <input value={form.apartamento} onChange={(e) => setForm((f) => ({ ...f, apartamento: e.target.value }))} placeholder="Depto. 4B (opcional)" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ciudad *</label>
                <input value={form.ciudad} onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))} placeholder="Ciudad" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Estado *</label>
                <select value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                  <option value="">Selecciona</option>
                  {ESTADOS_MX.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Código postal * (5 dígitos)</label>
              <input value={form.codigo_postal} onChange={(e) => setForm((f) => ({ ...f, codigo_postal: e.target.value.replace(/\D/g, "").slice(0, 5) }))} placeholder="06600" maxLength={5} className={inputCls} />
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-sans font-medium text-gray-600">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-sans font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "#5CB996" }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</> : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-sans font-bold text-base" style={{ color: "#0D1A0F" }}>¿Eliminar dirección?</h3>
            <p className="text-sm font-sans text-gray-500">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-sans font-medium text-gray-600">Cancelar</button>
              <button onClick={() => handleDelete(confirmId)} disabled={!!deletingId} className="flex-1 py-2.5 rounded-xl text-sm font-sans font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "#EF4444" }}>
                {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
