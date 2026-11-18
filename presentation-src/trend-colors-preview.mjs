// Keep the portal palette, with consistent series colors when a comparison is absent.
// Applied to the presentation bundle only; the production chart remains unchanged.
export function withTrendColorsPreview(source) {
  const replaceOnce = (before, after) => {
    if (source.split(before).length !== 2) throw new Error(`Trend colors preview: expected one source match for ${before}`);
    source = source.replace(before, after);
  };
  replaceOnce(
    "const colors = ['#835348', '#8a9299', '#b28f56', '#547365']",
    "const colors = ['#835348', '#8a9299', '#b28f56', '#547365']\nconst presentationSeriesColor = (series, index) => colors[({ actual: 0, previous: 1, budget: 2 }[series.key] ?? index) % colors.length]",
  );
  replaceOnce('background: colors[i % colors.length]', 'background: presentationSeriesColor(s, i)');
  replaceOnce('stroke={colors[i % colors.length]}', 'stroke={presentationSeriesColor(s, i)}');
  replaceOnce('color = colors[series.indexOf(s) % colors.length]', 'color = presentationSeriesColor(s, series.indexOf(s))');
  return source;
}
