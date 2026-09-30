import CompanyCard from '@/components/CompanyCard';
import type { CompanyListItem } from '@/lib/companies';
import l from '@/lib/en';

type CompanyListProps = {
  companies: CompanyListItem[];
};

export default function CompanyList({ companies }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-10 text-center text-slate-300">
        {l.companies.empty}
      </p>
    );
  }

  return (
    <section
      aria-label={l.companies.sectionLabel}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {companies.map((company) => (
        <CompanyCard key={company.email} company={company} />
      ))}
    </section>
  );
}
