function PageHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="page-header animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-2xl text-white shadow-lg">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Campus Placement</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
