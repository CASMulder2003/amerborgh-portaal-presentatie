import {makeDemoForm, formPath} from './form-fixtures.js';

// Presentation-only in-memory adapter: no fetch, cookies, localStorage or backend.
const forms = new Map();
const clone = value => structuredClone(value);
const normalizePath = path => String(path).replace(/^\/?(?:api\/portal\/)?reporting\//, '').replace(/^\//, '');
function failure(message, status = 400, fields) {
  return Object.assign(new Error(message), {status, fields});
}

export function registerDemoForm(form, path = formPath(form.kind)) {
  forms.set(normalizePath(path), clone(form));
  return clone(form);
}
export function resetDemoForms() {
  forms.clear();
  for (const kind of ['financial', 'kpi', 'qualitative']) registerDemoForm(makeDemoForm(kind));
}
export function getDemoForm(path = formPath()) {
  const form = forms.get(normalizePath(path));
  return form ? clone(form) : null;
}
resetDemoForms();

export async function apiRequest(path, request, {signal} = {}) {
  if (signal?.aborted) throw new DOMException('Aanvraag geannuleerd.', 'AbortError');
  const key = normalizePath(path);
  const stored = forms.get(key);
  if (!stored) throw failure('Dit onderdeel is niet beschikbaar in deze demonstratie.', 404);
  if (request === undefined) return clone(stored);
  if (!['save', 'submit', 'reopen'].includes(request?.action)) throw failure('Deze handeling is niet beschikbaar in deze demonstratie.');
  if (request.revision !== stored.progress.revision) throw failure('De demonstratie is gewijzigd. Open het formulier opnieuw.', 409);
  if (request.action !== 'reopen' && !stored.can_edit) throw failure('Open het formulier eerst voor een correctie.', 403);
  if (request.action === 'reopen' && !String(request.reason || '').trim()) throw failure('Geef een reden voor de wijziging.');
  const next = clone(stored);
  if (request.action !== 'reopen') {
    const group = next.kind === 'financial' ? 'actual' : 'answers';
    const supplied = request.data?.[group] || {};
    const fields = {};
    for (const field of next.schema) {
      const value = supplied[field.id];
      if (request.action === 'submit' && field.required && (value == null || String(value).trim() === '')) fields[`${group}.${field.id}`] = ['Vul dit veld in.'];
      if (field.type === 'number' && value != null && value !== '' && !/^[+-]?\d+(?:\.\d+)?$/.test(String(value))) fields[`${group}.${field.id}`] = ['Vul een geldig getal in.'];
    }
    if (Object.keys(fields).length) throw failure('Controleer de ingevulde gegevens.', 400, fields);
    next.data = {...next.data, [group]: Object.fromEntries(next.schema.map(field => [field.id, supplied[field.id] ?? null]))};
  }
  const now = new Date().toISOString();
  const submitted = request.action === 'submit';
  next.progress = {...next.progress, revision: next.progress.revision + 1, updated_at: now, status: submitted ? 'submitted' : 'draft'};
  next.can_edit = !submitted;
  next.can_reopen = submitted;
  if (submitted) next.published = {submitted_at: now, schema: clone(next.schema), data: clone(next.data)};
  forms.set(key, next);
  return clone(next);
}

export async function apiResponse(path, data, options) {
  return new Response(JSON.stringify(await apiRequest(path, data, options)), {status: 200, headers: {'Content-Type': 'application/json'}});
}
