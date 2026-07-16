import ProjectForm from "@/modules/admin/components/ProjectForm";

export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          Create New Project
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Publish a new real estate development project to your platform.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
