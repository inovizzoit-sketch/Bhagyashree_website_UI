export default function SuperAdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-slate-100 flex flex-col justify-center items-center p-4">
      {children}
    </div>
  );
}
