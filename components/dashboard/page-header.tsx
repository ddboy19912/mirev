interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header>
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
          {description}
        </p>
      ) : null}
    </header>
  );
}
