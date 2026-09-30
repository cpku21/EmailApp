import {
  SPECIALIZATIONS,
  SPECIALIZATION_LABELS,
  type Specialization,
} from '@/lib/specializations';
import l from '@/lib/en';
import { EU_COUNTRIES, OTHER_EUROPEAN_COUNTRIES } from '@/utils/regions';

type FilterFormProps = {
  selectedSpecialization?: Specialization;
  selectedRegion?: string;
};

export default function FilterForm({
  selectedSpecialization,
  selectedRegion,
}: FilterFormProps) {
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countries = [...EU_COUNTRIES, ...OTHER_EUROPEAN_COUNTRIES]
    .map((code) => ({
      code,
      name: countryNames.of(code) ?? code,
    }))
    .sort((first, second) => first.name.localeCompare(second.name));

  return (
    <form
      method="get"
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end lg:p-6"
    >
      <div className="min-w-0">
        <label
          htmlFor="specialization"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          {l.filters.specialization}
        </label>
        <select
          id="specialization"
          name="specialization"
          required
          defaultValue={selectedSpecialization ?? ''}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <option value="" disabled>
            {l.filters.chooseSpecialization}
          </option>
          {SPECIALIZATIONS.map((specialization) => (
            <option key={specialization} value={specialization}>
              {SPECIALIZATION_LABELS[specialization]}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label
          htmlFor="region"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          {l.filters.region}
        </label>
        <select
          id="region"
          name="region"
          defaultValue={selectedRegion ?? ''}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <option value="">{l.filters.anyRegion}</option>
          <option value="EU">{l.filters.eu}</option>
          <option value="EUROPE">{l.filters.europe}</option>
          <optgroup label={l.filters.countries}>
            {countries.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <button
        type="submit"
        className="h-11 w-full rounded-lg bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:col-span-2 lg:col-span-1 lg:w-auto"
      >
        {l.filters.submit}
      </button>
    </form>
  );
}
