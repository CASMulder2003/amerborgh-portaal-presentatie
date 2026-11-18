import {makeDemoForm, formPath, makeDemoBudget, budgetPath} from './form-fixtures.js';
import {companies} from './dashboard-fixtures.js';

// Presentation-only in-memory adapter: no fetch, cookies, localStorage or backend.
const forms = new Map();
const budgets = new Map();
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
  budgets.clear();
  for (const kind of ['financial', 'kpi', 'qualitative']) registerDemoForm(makeDemoForm(kind));
}
export function getDemoBudget(year = 2027, companyIndex = 0) {
  const key=budgetPath(year,companyIndex);
  if(!budgets.has(key)) budgets.set(key,makeDemoBudget(year,companyIndex));
  return clone(budgets.get(key));
}
export function getDemoHub(companyIndex = 0) {
  const states=Object.fromEntries(['financial','kpi','qualitative'].map(kind=>{
    const form=getDemoForm(formPath(kind,companyIndex))||makeDemoForm(kind,{companyIndex});
    const values=kind==='financial'?form.data.actual:form.data.answers;
    return [kind,{...form.progress,total:form.schema.length,completed:form.schema.filter(field=>values[field.id]!==null&&values[field.id]!==undefined&&String(values[field.id]).trim()!=='').length}];
  }));
  const budget=getDemoBudget(2027,companyIndex);
  return {period_options:['2026-08'],preparation_period:null,budget_year:2027,
    budget_tasks:[{year:2027,status:budget.status,preparation:false,overdue:false}],
    companies:[{company:companies[companyIndex],can_edit:true,can_edit_budget:true,
      months:[{year:2026,month:8,forms:states}]}]};
}
export function getDemoForm(path = formPath()) {
  const form = forms.get(normalizePath(path));
  return form ? clone(form) : null;
}
resetDemoForms();

export async function apiRequest(path, request, {signal} = {}) {
  if (signal?.aborted) throw new DOMException('Aanvraag geannuleerd.', 'AbortError');
  const key = normalizePath(path);
  // The presentation supplies a built-in CSV; workbook decoding stays local.
  if (key === 'import-file/' && request instanceof FormData) {
    const file = request.get('file');
    if (!(file instanceof File) || !/^Bedrijf [ABC] - (?:augustus 2026|jaarbudget \d{4})\.csv$/.test(file.name)) {
      throw failure('Gebruik het voorbeeldbestand in deze presentatie.');
    }
    const rows = (await file.text()).split(/\r?\n/).filter(Boolean).map(line => line.split(';'));
    return {filename: file.name, sheets: [{name: file.name.split(' - ')[0], rows}]};
  }
  const budgetMatch=key.match(/^companies\/(\d+)\/budget\/(\d{4})\/(?:\?.*)?$/);
  if(budgetMatch) {
    const companyIndex=companies.findIndex(company=>company.id===Number(budgetMatch[1]));
    if(companyIndex<0) throw failure('Deze onderneming is niet beschikbaar in de presentatie.',404);
    const year=Number(budgetMatch[2]),stored=getDemoBudget(year,companyIndex);
    if(request===undefined)return stored;
    if(!['save_draft','submit'].includes(request.action))throw failure('Kies concept opslaan of budget indienen.');
    if(request.revision!==stored.revision)throw failure('Het budget is gewijzigd. Open het opnieuw.',409);
    const data={},fields={};
    for(let month=1;month<=12;month++) {
      data[month]={};
      for(const field of stored.schema) {
        const value=request.data?.[month]?.[field.id]??null;
        if(value!==null&&value!==''&&!/^[+-]?\d+(?:\.\d+)?$/.test(String(value)))fields[`${month}.${field.id}`]=['Vul een geldig getal in.'];
        data[month][field.id]=value;
      }
    }
    if(Object.keys(fields).length)throw failure('Controleer de ingevulde bedragen.',400,fields);
    const submitted=request.action==='submit',next={...stored,data,revision:stored.revision+1,status:submitted?'submitted':'draft',has_published:submitted||stored.has_published,reason:request.reason||'',updated_at:new Date().toISOString()};
    budgets.set(budgetPath(year,companyIndex),next);
    return clone(next);
  }
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
