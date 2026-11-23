import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard, { CompanyResults } from '@portal/pages/reporting/overview/Dashboard.jsx';
import TrendChart from '@portal/pages/reporting/charts/TrendChart.jsx';
import { KpiCompanyFigures } from '@portal/pages/reporting/overview/KpiOverview.jsx';
import { MonthlyFinancialFigures } from '@portal/pages/reporting/overview/MonthFigures.jsx';
import { monthlyValues } from '@portal/pages/reporting/overview/monthComparison.js';
import OverviewPeriodTabs from '@portal/pages/reporting/periods/OverviewPeriodTabs.jsx';
import { months } from '@portal/pages/reporting/shared/format.js';
import { FormEditor } from '@portal/pages/reporting/forms/FormEditor.jsx';
import FormHub from '@portal/pages/reporting/forms/FormHub.jsx';
import BudgetPage from '@portal/pages/reporting/budgets/BudgetPage.jsx';
import { PublicationContent } from '@portal/pages/reporting/reports/ReportReader.jsx';
import { data, context, selection, rows, year, month } from './dashboard-fixtures.js';
import { makeDemoForm, formPath, financialSchema, budgetSchema, makeDemoBudget } from './form-fixtures.js';
import { registerDemoForm, getDemoForm, getDemoHub } from './local-api.js';
import '@portal/styles/tokens.css';
import '@portal/styles/global.css';
import '@portal/styles/workspace.css';
import '@portal/pages/management/Management.css';
import '@portal/pages/reporting/styles/Reporting.css';
import '@portal/pages/reporting/styles/ReportingNavigation.css';
import '@portal/pages/reporting/styles/ReportingRefresh.css';
import '@portal/pages/reporting/styles/ReportingMobile.css';
import '@portal/pages/reporting/budgets/BudgetPage.css';
import '@portal/pages/reporting/companies/EntityHierarchy.css';
import './frame.css';

const initialView = new URLSearchParams(location.search).get('view') || 'company';
const centralDemo = ['central','central-table'].includes(initialView);
// Keep two complete KPI examples on the slide, including all comparison series.
const kpiSlideRows = rows.map(row => ({
  ...row,
  series: row.series.map(point => Object.fromEntries(Object.entries(point).map(([key, value]) => [
    key, ['kpis', 'previous_kpis', 'budget_kpis', 'previous_month_kpis'].includes(key)
      ? value.filter(field => ['kpi_1', 'kpi_2'].includes(field.id)) : value,
  ]))),
}));
// The central example can open every company's published tabs. Each iframe has
// its own memory, so these records cannot change the separate input example.
if (centralDemo) rows.forEach((_, companyIndex) => {
  for (const kind of ['financial','kpi','qualitative']) {
    const form=makeDemoForm(kind,{submitted:true,companyIndex});
    registerDemoForm({...form,can_edit:false,can_reopen:false},formPath(kind,companyIndex));
  }
});
function ExampleImport({companyIndex=0,budgetYear,children}) {
  function exampleFile(event) {
    const entry=event.target.closest('.file-import-entry');
    if(!entry || !event.target.closest('button')) return;
    event.preventDefault(); event.stopPropagation();
    const input=event.currentTarget.querySelector('input[type="file"]');
    if(!input)return;
    const company=rows[companyIndex].company;
    let filename,csv;
    if(budgetYear) {
      const budget=makeDemoBudget(budgetYear,companyIndex);
      filename=`${company.name} - jaarbudget ${budgetYear}.csv`;
      csv=[['Post',...Array.from({length:12},(_,i)=>`${String(i+1).padStart(2,'0')}-${budgetYear}`)].join(';'),
        ...budgetSchema.map(field=>[field.label,...Array.from({length:12},(_,i)=>(Number(budget.data[i+1][field.id])+(['revenue','net_result'].includes(field.id)?1500:0)).toFixed(2).replace('.',','))].join(';'))].join('\r\n');
    } else {
      const actual={...rows[companyIndex].selected.actual};
      for(const field of ['revenue','net_result','cash']) actual[field]=(Number(actual[field])+1500).toFixed(2);
      filename=`${company.name} - augustus 2026.csv`;
      csv=['Post;Augustus 2026',...financialSchema.map(field=>`${field.label};${actual[field.id].replace('.',',')}`)].join('\r\n');
    }
    const transfer=new DataTransfer();
    transfer.items.add(new File([csv],filename,{type:'text/csv'}));
    input.files=transfer.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  return <div onClickCapture={exampleFile}>{children}</div>;
}
function LocalForm({kind='financial',companyIndex=0}) {
  const [revision,setRevision]=useState(0);
  const path=formPath(kind,companyIndex);
  const initial=useMemo(()=>getDemoForm(path)||registerDemoForm(makeDemoForm(kind,{companyIndex}),path),[path,revision]);
  return <ExampleImport companyIndex={companyIndex}><FormEditor key={`${path}-${revision}`} initial={initial} path={path} reload={()=>setRevision(value=>value+1)}/></ExampleImport>;
}
function Demo() {
  const [view,setView]=useState(initialView);
  const [kind,setKind]=useState('financial');
  const [company,setCompany]=useState(0);
  const [tab,setTab]=useState('samenvatting');
  const [basis,setBasis]=useState('ytd');
  const [budgetYear,setBudgetYear]=useState(2027);
  useEffect(() => {
    let wasOpen=false;
    const dialogState=()=>{
      const open=Boolean(document.querySelector('dialog[open]'));
      if(open===wasOpen)return;
      wasOpen=open;
      parent.postMessage({type:'portal-dialog',open},location.origin);
    };
    const observer=new MutationObserver(dialogState);
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
    const receive = event => {
      if(event.origin!==location.origin || event.source!==parent || event.data?.type!=='portal-demo') return;
      if(event.data.view) {setView(event.data.view);setTab('samenvatting');setCompany(0);}
      window.scrollTo(0,0);
    };
    const navigate = hash => {
      const query=new URLSearchParams(hash.split('?')[1]||'');
      const section=hash.split('?')[0].split('/').at(-1);
      if(query.has('company')) setCompany(Math.max(0,rows.findIndex(r=>r.company.id===Number(query.get('company')))));
      if(section==='invoer'&&query.get('task')==='budget') {setBudgetYear(Number(query.get('year'))||2027);setView('budget');}
      else if(query.has('kind')) {setKind(query.get('kind'));setView(centralDemo&&section!=='invoer'?'publication':'form');}
      else if(section==='invoer')setView('input');
      else if(query.has('company')) {setTab(query.get('view')||'samenvatting');setView(!centralDemo&&initialView==='kpi'?'kpi':'company');}
      if(query.has('basis')) setBasis(query.get('basis'));
      window.scrollTo(0,0);
    };
    const links = event => {
      const anchor=event.target.closest('a');
      if(!anchor || !anchor.hash.includes('/')) return;
      event.preventDefault();
      history.replaceState(null,'',anchor.hash);
      navigate(anchor.hash);
    };
    const hashChanged=()=>{if(location.hash.includes('/'))navigate(location.hash);};
    const exitPreview=event=>{
      if(event.key==='Escape'&&!event.target.closest('dialog')&&!document.querySelector('dialog[open]'))parent.postMessage({type:'portal-preview-exit'},location.origin);
    };
    window.addEventListener('message',receive);
    window.addEventListener('hashchange',hashChanged);
    document.addEventListener('click',links);
    document.addEventListener('keydown',exitPreview);
    return()=>{observer.disconnect();window.removeEventListener('message',receive);window.removeEventListener('hashchange',hashChanged);document.removeEventListener('click',links);document.removeEventListener('keydown',exitPreview);};
  },[]);
  const oneSelection={year,month,company:rows[company].company.id};
  const companyFromCentral=centralDemo && !['central','central-table'].includes(view);
  return <main className={`reporting-workspace${!centralDemo&&['company','kpi'].includes(view)?' presentation-figures':''}`}>
    {companyFromCentral && <>
      <a className="report-back" href="#central" onClick={event=>{event.preventDefault();history.replaceState(null,'','#central');setView(initialView);setBasis('ytd');setTab('samenvatting');window.scrollTo(0,0);}}>← Terug naar bedrijfstabel</a>
      <header className="presentation-heading"><h1>{rows[company].company.name}</h1></header>
    </>}
    {['central','central-table'].includes(view) && <header className="presentation-heading"><h1>Amerborgh</h1><p>Januari t/m augustus 2026</p></header>}
    {!centralDemo&&['company','kpi'].includes(view)&&<div className="overview-period"><p>{basis==='ytd'?`Januari t/m ${months[month-1].toLowerCase()} ${year}`:`${months[month-1]} ${year}`}</p><OverviewPeriodTabs section="bedrijven" selection={oneSelection} view={view==='kpi'?'kpi':'samenvatting'} basis={basis}/></div>}
    {view==='company'&&(centralDemo?<Dashboard data={{...data,companies:[rows[company]]}} context={context} selection={oneSelection} view={tab} basis={basis} section="bedrijven" loading={false}/>:basis==='month'?<MonthlyFinancialFigures values={monthlyValues(rows[company].series,month)} year={year} month={month}/>:<div className="summary-charts company-summary-charts">{[['revenue','Omzet'],['net_result','Nettoresultaat'],['ebitda','EBITDA']].map(([field,title])=><TrendChart key={field} title={title} defaultStyle={field==='ebitda'?'bridge':'line'} bridgeValues={field==='ebitda'?rows[company].cumulative.actual:undefined} bridgePeriod="Januari t/m Augustus 2026" points={rows[company].series.map(point=>({label:point.period,actual:point.actual[field],previous:point.previous[field],budget:point.budget[field]}))} series={[{key:'actual',label:'2026'},{key:'previous',label:'2025'},{key:'budget',label:'Budget'}]}/>)}</div>)}
    {(view==='central'||view==='central-table')&&<CompanyResults data={data} context={context} selection={selection} basis={basis}/>}
    {view==='kpi'&&<KpiCompanyFigures row={kpiSlideRows[company]} year={year} month={month} basis={basis}/>}
    {view==='qualitative'&&<PublicationContent form={makeDemoForm('qualitative',{submitted:true})} selection={oneSelection} kind="qualitative" central compact/>}
    {view==='publication'&&<PublicationContent form={getDemoForm(formPath(kind,company))} selection={oneSelection} kind={kind} central compact/>}
    {view==='form'&&<LocalForm kind={kind} companyIndex={company}/>}
    {view==='input'&&<FormHub data={getDemoHub(company)} selection={oneSelection} onChange={()=>{}}/>}
    {view==='budget'&&<ExampleImport companyIndex={company} budgetYear={budgetYear}><BudgetPage selection={{company:rows[company].company.id,year:budgetYear}} entry onChange={next=>setBudgetYear(next.year)}/></ExampleImport>}
  </main>;
}
createRoot(document.getElementById('root')).render(<Demo/>);
