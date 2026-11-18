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
  { id: 'other', label: 'Wat willen jullie verder nog toelichten?', type: 'text', unit: '', help: '', required: false },
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

// Independent fictional monthly observations. Budgets follow planned seasons;
// actuals and prior-year values fluctuate without a fixed offset or growth rate.
const kpiMonths = [
  {
    kpi_1: {
      actual: [342.8, 361.2, 438.6, 407.3, 426.8, 389.5, 452.1, 417.6],
      previous: [356.4, 339.8, 371.2, 411.6, 398.7, 437.4, 406.9, 435.2],
      budget: [355, 355, 400, 410, 425, 425, 435, 440],
    },
    kpi_2: {
      actual: [76.8, 73.2, 80.4, 86.1, 82.3, 78.6, 69.4, 75.8],
      previous: [72.4, 75.1, 77.3, 81.5, 84.2, 76.8, 73.6, 70.9],
      budget: [75, 75, 79, 82, 84, 82, 76, 74],
    },
    kpi_3: {
      actual: [116, 94, 108, 87, 102, 119, 111, 96],
      previous: [104, 102, 93, 99, 107, 101, 118, 109],
      budget: [105, 100, 110, 100, 110, 115, 115, 110],
    },
  },
  {
    kpi_1: {
      actual: [278.4, 302.6, 286.1, 325.8, 351.2, 339.7, 294.3, 318.6],
      previous: [291.7, 274.5, 309.8, 301.2, 328.6, 346.1, 312.8, 305.4],
      budget: [290, 290, 305, 320, 335, 345, 310, 315],
    },
    kpi_2: {
      actual: [64.2, 68.7, 66.1, 73.8, 77.6, 71.3, 79.2, 82.4],
      previous: [67.1, 63.8, 69.4, 65.9, 72.3, 75.6, 73.1, 77.8],
      budget: [66, 67, 69, 72, 74, 76, 78, 80],
    },
    kpi_3: {
      actual: [71, 65, 82, 78, 92, 84, 67, 74],
      previous: [68, 73, 71, 85, 80, 89, 75, 69],
      budget: [70, 70, 80, 82, 85, 85, 75, 72],
    },
  },
  {
    kpi_1: {
      actual: [219.6, 207.3, 248.8, 231.4, 226.7, 264.2, 257.9, 239.5],
      previous: [205.1, 221.8, 229.4, 245.6, 218.3, 237.9, 269.1, 251.7],
      budget: [215, 220, 235, 240, 235, 250, 260, 250],
    },
    kpi_2: {
      actual: [88.4, 85.7, 89.2, 81.6, 84.8, 90.1, 87.3, 91.5],
      previous: [84.7, 87.2, 83.6, 86.4, 88.1, 85.9, 89.4, 87.6],
      budget: [87, 87, 88, 87, 88, 89, 90, 90],
    },
    kpi_3: {
      actual: [54, 63, 58, 71, 65, 60, 76, 68],
      previous: [61, 55, 64, 59, 69, 66, 62, 73],
      budget: [58, 58, 62, 65, 68, 65, 70, 70],
    },
  },
];

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
  const values = Object.fromEntries(companyKpiFields.map(field => [field.id,
    String(kpiMonths[index][field.id][variant][m - 1]),
  ]));
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
      budget: budget.figures, kpis: current.kpis, previous_kpis: previous.kpis, budget_kpis: budget.kpis,
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
