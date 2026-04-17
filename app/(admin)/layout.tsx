import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--hl-beige)" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto w-full p-6 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}
