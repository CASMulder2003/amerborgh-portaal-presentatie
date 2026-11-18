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

// Illustrative definitions for this demo only. Each enterprise selects its own KPIs.
export const companyKpiFields = [
  { id: 'kpi_1', label: 'KPI 1', type: 'number', unit: '€', number_format: 'currency', help: '', required: true },
  { id: 'kpi_2', label: 'KPI 2', type: 'number', unit: '%', number_format: 'percentage', help: '', required: true },
  { id: 'kpi_3', label: 'KPI 3', type: 'number', unit: 'aantal', number_format: 'number', help: '', required: true },
];
export const qualitativeFields = [
  { id: 'results', label: 'Geef een korte toelichting op de resultaten ten opzichte van budget en vorig jaar.', type: 'text', unit: '', help: '', required: true },
  { id: 'developments', label: 'Welke ontwikkelingen in- of extern (positief of negatief) hebben er invloed op de resultaten?', type: 'text', unit: '', help: '', required: true },
  { id: 'priorities', label: 'Wat zijn de prioriteiten, en hoe kan Amerborgh jullie hierbij ondersteunen?', type: 'text', unit: '', help: '', required: true },
  { id: 'other', label: 'Zijn er andere onderwerpen die jullie graag willen toelichten of bespreken?', type: 'text', unit: '', help: '', required: false },
];
export const companies = ['Bedrijf A', 'Bedrijf B', 'Bedrijf C'].map((name, index) => ({
  id: 901 + index, name, category: 'operating', parent_id: null, has_children: false,
  financial_source: 'manual', is_demo: true, archived: false, is_dormant: false,
  available: true, ownership_percentage: '100.00',
}));
export const rawCompanyList = companies;
const money = value => Number(value).toFixed(2);
const periods = Array.from({ length: month }, (_, n) => `${year}-${String(n + 1).padStart(2, '0')}`);
const forms = Object.fromEntries(['financial', 'kpi', 'qualitative'].map(kind => [kind, { status: 'submitted' }]));

function companyMonth(index, m, variant = 'actual') {
  const baseRevenue = [320000,220000,170000][index] + m * [18000,14000,11000][index]
    + [0,-7000,12000,5000,16000,8000,-6000,0,10000,14000,22000,5000][m-1];
  const revenue = Math.round(baseRevenue * (variant === 'previous' ? .94 : variant === 'budget' ? 1.04 : 1));
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
  const values = {
    kpi_1: money(revenue * (variant === 'budget' ? 1.08 : 1.05) / 1000),
    kpi_2: money(90 + m * .3 + [0,-1,1][index] + (variant === 'budget' ? .8 : 0)),
    kpi_3: String([85,62,48][index] + m * 3 + (variant === 'budget' ? 5 : 0)),
  };
  return { figures, kpis: companyKpiFields.map(field => ({ ...field, value: values[field.id] })) };
}
const cumulative = (series, kind) => Object.fromEntries(financialFields.map(field => [field.id,
  field.group === 'balance' ? series[month - 1][kind][field.id]
    : money(series.reduce((total, point) => total + Number(point[kind][field.id]), 0)),
]));

export const rows = companies.map((company, index) => {
  const series = Array.from({ length: month }, (_, n) => {
    const m = n + 1;
    const current = companyMonth(index, m), previous = companyMonth(index, m, 'previous'), budget = companyMonth(index, m, 'budget');
    const previousMonth = m === 1 ? null : companyMonth(index, m - 1);
    return { month: m, period: periods[n], actual: current.figures, previous: previous.figures,
      budget: budget.figures, kpis: current.kpis, previous_kpis: [], budget_kpis: budget.kpis,
      previous_month_kpis: previousMonth?.kpis || [], correction_pending: false, forms,
      qualitative: qualitativeFields.map(field => ({ ...field, value: '…' })),
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
// demonstration enterprises belong to operating; the other categories remain empty.
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
