import type { CompanyListItem } from '@/lib/companies';
import {
  SPECIALIZATION_LABELS,
  type Specialization,
} from '@/lib/specializations';

type CompanyCardProps = {
  company: CompanyListItem;
};

export default function CompanyCard({ company }: CompanyCardProps) {
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryName = countryNames.of(company.country) ?? company.country;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="break-words text-xl font-bold text-white">
          {company.name}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{countryName}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {company.specializations.map((specialization) => (
          <span
            key={specialization}
            className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300"
          >
            {SPECIALIZATION_LABELS[specialization as Specialization] ??
              specialization}
          </span>
        ))}
      </div>

      {company.note ? (
        <p className="mb-5 break-words text-sm leading-6 text-slate-300">
          {company.note}
        </p>
      ) : null}

      <a
        href={`mailto:${company.email}`}
        className="mt-auto break-all text-sm font-semibold text-blue-400 underline decoration-blue-700 underline-offset-4 hover:text-blue-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {company.email}
      </a>
    </article>
  );
}
