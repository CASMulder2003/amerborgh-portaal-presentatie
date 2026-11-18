// Preview of the proposed KPI-budget comparison, using the genuine portal chart.
// Applied to the presentation bundle only; no production schema or source edits.
export function withKpiBudgetPreview(source) {
  const replaceOnce = (before, after) => {
    if (source.split(before).length !== 2) throw new Error(`KPI budget preview: expected one source match for ${before}`);
    source=source.replace(before,after);
  };
  replaceOnce('periodIndex, periodLabel }', 'periodIndex, periodLabel, sameKpi }');
  replaceOnce('points={points} valueRange={scoreRange(field)}', 'points={presentationKpiBudgetPoints(row, field, points)} valueRange={scoreRange(field)}');
  replaceOnce("series={[{ key: 'actual', label: String(year) }, { key: 'previous', label: String(year-1) }]}", 'series={presentationKpiBudgetSeries(row, field, points, year)}');
  return source + `
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
