import PopupFormPage from "@/modules/admin/pages/PopupFormPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PopupFormPage id={id} />;
}
