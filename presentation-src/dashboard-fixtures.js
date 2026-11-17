// Presentation-only synthetic fixtures for unmodified portal React components.
// No live requests, real companies, source workbook values or persisted records.
export const year = 2026;
export const month = 8;
export const selection = { year, month, company: '' };

export const financialFields = [
  ['revenue', 'Omzet', 'pnl'], ['cost_of_sales', 'Kostprijs van de omzet', 'pnl'],
  ['personnel', 'Personeelskosten', 'pnl'], ['rent', 'Huur', 'pnl'],
  ['depreciation', 'Afschrijvingen', 'pnl'],
  ['financial_external', 'Financiële baten en lasten · extern', 'pnl'],
  ['financial_internal', 'Financiële baten en lasten · intercompany', 'pnl'],
  ['net_result', 'Nettoresultaat', 'pnl'], ['ebitda', 'EBITDA', 'pnl'],
  ['fixed_assets', 'Materiële vaste activa', 'balance'], ['receivables', 'Debiteuren', 'balance'],
  ['cash', 'Liquide middelen', 'balance'], ['payables', 'Crediteuren', 'balance'],
].map(([id, label, group]) => ({ id, label, group, type: 'number', unit: 'EUR', required: false }));

// Exact existing portal hotel definitions: backend/reporting/demo/hotels.py.
export const hotelKpiFields = [
  { id: 'occupancy', label: 'Bezettingsgraad', type: 'number', unit: '%', number_format: 'percentage', help: 'Verkochte kamernachten als percentage van de beschikbare kamernachten.', required: true },
  { id: 'room_nights', label: 'Verkochte kamernachten', type: 'number', unit: 'nachten', number_format: 'number', help: '', required: true },
  { id: 'average_room_rate', label: 'Gemiddelde kamerprijs', type: 'number', unit: '€', number_format: 'currency', help: 'Kameromzet gedeeld door verkochte kamernachten.', required: true },
];
export const qualitativeFields = [
  { id: 'results', label: 'Welke marktontwikkelingen beïnvloeden het bedrijf?', type: 'text', unit: '', help: 'Wat merk je bij klanten, concurrenten of leveranciers?', required: true },
  { id: 'attention', label: 'Waar kan Amerborgh bij helpen?', type: 'text', unit: '', help: 'Noem eventuele ondersteuning of een besluit dat nodig is.', required: true },
  { id: 'next', label: 'Welke kansen of risico’s vragen de komende maand aandacht?', type: 'text', unit: '', help: '', required: false },
];
export const companies = ['Hotel A', 'Hotel B', 'Hotel C'].map((name, index) => ({
  id: 901 + index, name, category: 'operating', parent_id: null, has_children: false,
  financial_source: 'manual', is_demo: true, archived: false, is_dormant: false,
  available: true, ownership_percentage: '100.00',
}));
export const rawCompanyList = companies;
const money = value => Number(value).toFixed(2);
const periods = Array.from({ length: month }, (_, n) => `${year}-${String(n + 1).padStart(2, '0')}`);
const forms = Object.fromEntries(['financial', 'kpi', 'qualitative'].map(kind => [kind, { status: 'submitted' }]));

function hotelMonth(index, m, variant = 'actual') {
  const capacity = [100, 80, 60][index];
  const days = new Date(year, m, 0).getDate();
  const offset = variant === 'previous' ? -3 : variant === 'budget' ? 2 : 0;
  const occupancy = 66 + m * 2 + [0, -4, 3][index] + offset;
  const roomNights = Math.round(capacity * days * occupancy / 100);
  const roomRate = 155 + m * 3 + [20, 0, -12][index] + offset;
  const roomRevenue = roomNights * roomRate;
  const revenue = Math.round(roomRevenue * 1.12);
  const cost_of_sales = -Math.round(revenue * .23);
  const personnel = -Math.round(revenue * [.34, .38, .32][index]);
  const rent = -[29000, 25000, 18000][index];
  const depreciation = -[4500, 3800, 3000][index];
  const financial_external = -[1200, 950, 700][index];
  const financial_internal = 0;
  const ebitda = revenue + cost_of_sales + personnel + rent;
  const net_result = ebitda + depreciation + financial_external;
  const figures = Object.fromEntries(Object.entries({ revenue, cost_of_sales, personnel, rent,
    depreciation, financial_external, financial_internal, ebitda, net_result,
    fixed_assets: [970000, 760000, 540000][index],
    receivables: Math.round(revenue * .1), cash: [110000, 80000, 65000][index] + m * 3500,
    payables: Math.round(revenue * .07),
  }).map(([key, value]) => [key, money(value)]));
  const values = { occupancy: (roomNights / (capacity * days) * 100).toFixed(2),
    room_nights: String(roomNights), average_room_rate: money(roomRevenue / roomNights) };
  return { figures, kpis: hotelKpiFields.map(field => ({ ...field, value: values[field.id] })) };
}
const cumulative = (series, kind) => Object.fromEntries(financialFields.map(field => [field.id,
  field.group === 'balance' ? series[month - 1][kind][field.id]
    : money(series.reduce((total, point) => total + Number(point[kind][field.id]), 0)),
]));

export const rows = companies.map((company, index) => {
  const series = Array.from({ length: month }, (_, n) => {
    const m = n + 1;
    const current = hotelMonth(index, m), previous = hotelMonth(index, m, 'previous'), budget = hotelMonth(index, m, 'budget');
    const previousMonth = hotelMonth(index, m === 1 ? 12 : m - 1, m === 1 ? 'previous' : 'actual');
    return { month: m, period: periods[n], actual: current.figures, previous: previous.figures,
      budget: budget.figures, kpis: current.kpis, previous_kpis: previous.kpis,
      previous_month_kpis: previousMonth.kpis, correction_pending: false, forms,
      qualitative: qualitativeFields.map((field, i) => ({ ...field, value: [
        'We ontvingen deze maand meer weekendgasten. De vraag naar zakelijke overnachtingen bleef vergelijkbaar met de vorige maand.',
        'We vragen ondersteuning bij de planning van onderhoud buiten de drukke weekenden.',
        'Voor de komende maand volgen we de zakelijke boekingen en de personeelsplanning.',
      ][i] })),
    };
  });
  return { company, series, selected: series[month - 1],
    cumulative: Object.fromEntries(['actual', 'previous', 'budget'].map(kind => [kind, cumulative(series, kind)])),
    weighted: { percentage: 100 }, months: series.map(point => ({ month: point.month, forms })),
  };
});
export const companyRows = rows;
const summed = values => Object.fromEntries(financialFields.map(field => [field.id,
  values.length ? money(values.reduce((total, value) => total + Number(value[field.id]), 0)) : null,
]));
const wrapped = values => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value }]));
function portfolioFor(basis, groupRows = rows) {
  const records = groupRows.map(row => basis === 'month' ? row.selected : row.cumulative);
  const actual = summed(records.map(row => row.actual)), previous = summed(records.map(row => row.previous)), budget = summed(records.map(row => row.budget));
  const comparison = base => Object.fromEntries(financialFields.map(field => [field.id,
    { comparison_actual: actual[field.id], comparison_base: base[field.id] },
  ]));
  return { actual: wrapped(actual), previous: wrapped(previous), budget: wrapped(budget),
    difference: comparison(budget), difference_year: comparison(previous) };
}
const portfolioSeriesFor = groupRows => Array.from({ length: month }, (_, index) => Object.fromEntries(
  ['actual', 'previous', 'budget'].map(kind => [kind, wrapped(summed(groupRows.map(row => row.series[index][kind])))]),
));
// Exact category keys/labels from backend/reporting/categories.py. All three
// demonstration hotels belong to operating; the other categories remain empty.
export const categories = {
  groups: [
    ['operating', 'Operationele bedrijven'], ['real_estate', 'Vastgoed'],
    ['participation', 'Participaties'], ['investments', 'Investments'],
  ].map(([key, label]) => {
    const groupRows = rows.filter(row => row.company.category === key);
    return { key, label, companies: groupRows, current_ids: groupRows.map(row => row.company.id),
      portfolio: { month: portfolioFor('month', groupRows), ytd: portfolioFor('ytd', groupRows) },
      portfolio_series: portfolioSeriesFor(groupRows) };
  }),
  reconciliation: Object.fromEntries(['month', 'ytd'].map(basis => [basis,
    Object.fromEntries(['revenue', 'net_result', 'ebitda', 'cash'].map(key => [key, '0.00'])),
  ])),
};
export const context = { is_central: true, companies, aggregate_company_ids: companies.map(company => company.id),
  financial_fields: financialFields,
  available_periods: Object.fromEntries(companies.map(company => [company.id,
    Object.fromEntries(['financial', 'kpi', 'qualitative'].map(kind => [kind, periods])),
  ])),
};
export const data = { year, month, weighting: 'ownership', companies: rows,
  portfolio: { month: portfolioFor('month'), ytd: portfolioFor('ytd') },
  portfolio_series: portfolioSeriesFor(rows), categories,
};
export const overview = data;
export const centralData = data;
export const companyData = (index = 0) => ({ ...data, companies: [rows[index]] });
