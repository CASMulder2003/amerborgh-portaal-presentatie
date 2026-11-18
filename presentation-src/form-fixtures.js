import {companies, rows, financialFields, companyKpiFields, qualitativeFields} from './dashboard-fixtures.js';

// Public presentation data only. Labels and shapes mirror the portal source;
// company, figures, answers and dates below are entirely fictional.
export const demoCompany = companies[0];
export const financialSchema = financialFields.filter(field => field.id !== 'ebitda');

// The three provisional questions agreed in the information document.
export const qualitativeSchema = qualitativeFields;
export const kpiSchema = companyKpiFields;
export const demoActual = rows[0].selected.actual;
export const demoQualitativeAnswers = Object.fromEntries(rows[0].selected.qualitative.map(field => [field.id, field.value]));
export const demoKpiAnswers = Object.fromEntries(rows[0].selected.kpis.map(field => [field.id, field.value]));
export const demoTarget = {kind: 'financial', year: 2026, month: 8};
export const formPath = (kind = 'financial', companyIndex = 0) => `companies/${companies[companyIndex].id}/forms/2026/8/${kind}/`;

export function makeDemoForm(kind = 'financial', {empty = false, submitted = false, companyIndex = 0} = {}) {
  const schema = kind === 'financial' ? financialSchema : kind === 'kpi' ? kpiSchema : qualitativeSchema;
  const row = rows[companyIndex];
  const contents = kind === 'financial' ? {actual: {...row.selected.actual}, budget: {}} : {answers: Object.fromEntries((kind === 'kpi' ? row.selected.kpis : row.selected.qualitative).map(field => [field.id, field.value]))};
  if (empty) for (const key of Object.keys(contents)) contents[key] = {};
  return structuredClone({
    company: row.company, year: 2026, month: 8, kind, schema,
    definition_stamp: kind === 'financial' ? 'financial-v4' : `presentation-${kind}-1`,
    data: contents, can_edit: !submitted, can_reopen: submitted,
    progress: {status: submitted ? 'submitted' : empty ? 'not_started' : 'draft', revision: 1, updated_at: empty ? null : '2026-09-04T08:30:00Z'},
    published: submitted ? {submitted_at: '2026-09-04T08:30:00Z', schema, data: contents} : null,
  });
}

export const budgetPath = (year = 2027, companyIndex = 0) => `companies/${companies[companyIndex].id}/budget/${year}/`;
export const budgetSchema = financialSchema.filter(field => field.group === 'pnl');
export function makeDemoBudget(year = 2027, companyIndex = 0) {
  const row = rows[companyIndex];
  return structuredClone({
    company: row.company, year, years: [2026, 2027], schema: budgetSchema,
    data: Object.fromEntries(Array.from({length:12},(_,index)=>[index+1,
      Object.fromEntries(budgetSchema.map(field=>[field.id,row.series[index % row.series.length].budget[field.id]]))])),
    revision: 1, status: 'draft', reason: '', has_published: false,
    can_edit: true, is_demo: true, updated_at: '2026-11-18T08:30:00Z', history: [],
  });
}

// The real import parser reads this ordinary worksheet, not a mocked result.
export const importWorkbook = {
  filename: 'Bedrijf A - augustus 2026 - voorbeeld.xlsx',
  sheets: [{name: 'Bedrijf A', rows: [
    ['Post', 'Augustus 2026'],
    ...financialSchema.map(field => [field.label, Number(demoActual[field.id])]),
  ]}],
};
export const importValues = {8: {}};
export const publishedQualitativeForm = makeDemoForm('qualitative', {submitted: true});
