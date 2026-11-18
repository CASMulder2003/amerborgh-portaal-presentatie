// Preview of the proposed KPI-budget comparison, using the genuine portal chart.
// Applied to the presentation bundle only; no production schema or source edits.
export function withKpiBudgetPreview(source) {
  const replaceOnce = (before, after) => {
    if (source.split(before).length !== 2) throw new Error(`KPI budget preview: expected one source match for ${before}`);
    source=source.replace(before,after);
  };
  replaceOnce('periodIndex, periodLabel }', 'periodIndex, periodLabel, sameKpi, kpiDifference }');
  replaceOnce('<MonthlyKpiFigure field={field} previousMonth={previousMonth}', '<MonthlyKpiFigure field={field} budget={presentationKpiBudgetField(row, field, year, month)}');
  replaceOnce('points={points} valueRange={scoreRange(field)}', 'points={presentationKpiBudgetPoints(row, field, points)} valueRange={scoreRange(field)}');
  replaceOnce(`summary={<div className="kpi-chart-summary">
      <div className="kpi-current-value"><span>{periodLabel(selected)}</span><strong>{kpiValue(field)}</strong></div>
      {(lastMonth !== '—' || lastYear !== '—') && <dl className="kpi-value-changes">
        {lastMonth !== '—' && <div><dt>T.o.v. {periodLabel(indexPeriod(periodIndex(selected)-1)).toLowerCase()}</dt><dd>{lastMonth}</dd></div>}
        {lastYear !== '—' && <div><dt>T.o.v. {periodLabel(periodId(year-1, month)).toLowerCase()}</dt><dd>{lastYear}</dd></div>}
      </dl>}
    </div>}`, 'summary={<PresentationKpiSummary field={field} budget={presentationKpiBudgetField(row, field, year, month)} previousYear={previousYear} year={year} month={month} />}');
  replaceOnce("series={[{ key: 'actual', label: String(year) }, { key: 'previous', label: String(year-1) }]}", 'series={presentationKpiBudgetSeries(row, field, points, year)}');
  return source + `
function PresentationKpiSummary({ field, budget, previousYear, year, month }) {
  const budgetValue = budget ? kpiValue(budget) : '—';
  const budgetDifference = kpiDifference(field, budget);
  const yearDifference = kpiDifference(field, previousYear);
  return <div className="kpi-chart-summary presentation-kpi-summary">
    <div className="kpi-current-value"><span>{periodLabel(periodId(year, month))}</span><strong>{kpiValue(field)}</strong></div>
    {budgetValue !== '—' && <div className="kpi-current-value"><span>Budget {periodLabel(periodId(year, month)).toLowerCase()}</span><strong>{budgetValue}</strong></div>}
    {(budgetDifference !== '—' || yearDifference !== '—') && <dl className="kpi-value-changes">
      {budgetDifference !== '—' && <div><dt>T.o.v. budget</dt><dd>{budgetDifference}</dd></div>}
      {yearDifference !== '—' && <div><dt>T.o.v. {periodLabel(periodId(year-1, month)).toLowerCase()}</dt><dd>{yearDifference}</dd></div>}
    </dl>}
  </div>;
}
function presentationKpiBudgetField(row, field, year, month) {
  return row.series.find(point => point.period === periodId(year, month))?.budget_kpis?.find(item => sameKpi(item, field));
}
function presentationKpiBudgetPoints(row, field, points) {
  const budgets = new Map(row.series.map(point => [point.period, point.budget_kpis?.find(item => sameKpi(item, field))?.value ?? null]));
  return points.map(point => ({...point, budget: budgets.get(point.label) ?? null}));
}
function presentationKpiBudgetSeries(row, field, points, year) {
  const series = [{key:'actual',label:String(year)}];
  if (points.some(point => point.previous !== null && point.previous !== undefined)) series.push({key:'previous',label:String(year-1)});
  if (presentationKpiBudgetPoints(row,field,points).some(point => point.budget !== null)) series.push({key:'budget',label:'Budget'});
  return series;
}
`;
}

// Reuse the portal's monthly KPI comparison, with an additional budget reference.
export function withMonthlyKpiBudgetPreview(source) {
  const replaceOnce = (before, after) => {
    if (source.split(before).length !== 2) throw new Error(`Monthly KPI budget preview: expected one source match for ${before}`);
    source=source.replace(before,after);
  };
  replaceOnce(
    "export function MonthlyKpiFigure({ field, previousMonth, previousYear, year, month }) {\n  const labels = monthReferences(year, month)",
    "export function MonthlyKpiFigure({ field, budget, previousMonth, previousYear, year, month }) {\n  const labels = { ...monthReferences(year, month), budget: 'Budget' }",
  );
  replaceOnce(
    "[{ key: 'lastMonth', field: previousMonth }, { key: 'lastYear', field: previousYear }]",
    "[{ key: 'budget', field: budget }, { key: 'lastYear', field: previousYear }]",
  );
  replaceOnce(
    "{reference.key === 'lastMonth' ? 'Vorige maand' : 'Dezelfde maand vorig jaar'} · {labels[reference.key].toLowerCase()}",
    "{reference.key === 'budget' ? 'Budget' : reference.key === 'lastMonth' ? 'Vorige maand' : 'Dezelfde maand vorig jaar'}{reference.key !== 'budget' && <> · {labels[reference.key].toLowerCase()}</>}",
  );
  return source;
}
