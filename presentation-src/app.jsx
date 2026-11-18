import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard, { CompanyResults } from '@portal/pages/reporting/overview/Dashboard.jsx';
import TrendChart from '@portal/pages/reporting/charts/TrendChart.jsx';
import { KpiCompanyFigures } from '@portal/pages/reporting/overview/KpiOverview.jsx';
import { FormEditor } from '@portal/pages/reporting/forms/FormEditor.jsx';
import { PublicationContent } from '@portal/pages/reporting/reports/ReportReader.jsx';
import { data, context, selection, rows, year, month } from './dashboard-fixtures.js';
import { makeDemoForm, formPath, financialSchema, demoActual } from './form-fixtures.js';
import { registerDemoForm, getDemoForm } from './local-api.js';
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
// The central example can open every company's published tabs. Each iframe has
// its own memory, so these records cannot change the separate input example.
if (centralDemo) rows.forEach((_, companyIndex) => {
  for (const kind of ['financial','kpi','qualitative']) {
    const form=makeDemoForm(kind,{submitted:true,companyIndex});
    registerDemoForm({...form,can_edit:false,can_reopen:false},formPath(kind,companyIndex));
  }
});
function LocalForm({kind='financial', empty=false, revision=0, supplied}) {
  const initial = useMemo(() => registerDemoForm(supplied||makeDemoForm(kind, {empty})), [kind, empty, revision, supplied]);
  function exampleFile(event) {
    const entry=event.target.closest('.file-import-entry');
    if(!entry || !event.target.closest('button')) return;
    event.preventDefault(); event.stopPropagation();
    const input=event.currentTarget.querySelector('input[type="file"]');
    if(!input)return;
    const actual={...demoActual};
    for(const field of ['revenue','net_result','cash']) actual[field]=(Number(actual[field])+1500).toFixed(2);
    const csv=['Post;Augustus 2026',...financialSchema.map(field=>`${field.label};${actual[field.id].replace('.',',')}`)].join('\r\n');
    const transfer=new DataTransfer();
    transfer.items.add(new File([csv],'Hotel A - augustus 2026.csv',{type:'text/csv'}));
    input.files=transfer.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  return <div onClickCapture={exampleFile}><FormEditor key={`${kind}-${empty}-${revision}`} initial={initial} path={formPath(kind)} reload={() => {}} /></div>;
}
function Demo() {
  const [view,setView]=useState(initialView);
  const [kind,setKind]=useState('financial');
  const [company,setCompany]=useState(0);
  const [tab,setTab]=useState('samenvatting');
  const [basis,setBasis]=useState('ytd');
  const [revision,setRevision]=useState(0);
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
      if(query.has('company')) setCompany(Math.max(0,rows.findIndex(r=>r.company.id===Number(query.get('company')))));
      if(query.has('kind')) {setKind(query.get('kind'));setView(centralDemo?'publication':'form');}
      else if(query.has('company')) {setTab(query.get('view')||'samenvatting');setView('company');}
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
    window.addEventListener('message',receive);
    window.addEventListener('hashchange',hashChanged);
    document.addEventListener('click',links);
    return()=>{observer.disconnect();window.removeEventListener('message',receive);window.removeEventListener('hashchange',hashChanged);document.removeEventListener('click',links);};
  },[]);
  const oneSelection={year,month,company:rows[company].company.id};
  const companyFromCentral=centralDemo && !['central','central-table'].includes(view);
  return <main className="reporting-workspace">
    {companyFromCentral && <>
      <a className="report-back" href="#central" onClick={event=>{event.preventDefault();history.replaceState(null,'','#central');setView(initialView);setBasis('ytd');setTab('samenvatting');window.scrollTo(0,0);}}>← Terug naar bedrijfstabel</a>
      <header className="presentation-heading"><h1>{rows[company].company.name}</h1></header>
    </>}
    {['central','central-table'].includes(view) && <header className="presentation-heading"><h1>Amerborgh</h1><p>Januari t/m augustus 2026</p></header>}
    {view==='company'&&(centralDemo?<Dashboard data={{...data,companies:[rows[company]]}} context={context} selection={oneSelection} view={tab} basis={basis} section="bedrijven" loading={false}/>:<div className="summary-charts company-summary-charts">{[['revenue','Omzet'],['net_result','Nettoresultaat'],['ebitda','EBITDA']].map(([field,title])=><TrendChart key={field} title={title} defaultStyle={field==='ebitda'?'bridge':'line'} bridgeValues={field==='ebitda'?rows[company].cumulative.actual:undefined} bridgePeriod="Januari t/m Augustus 2026" points={rows[company].series.map(point=>({label:point.period,actual:point.actual[field],previous:point.previous[field],budget:point.budget[field]}))} series={[{key:'actual',label:'2026'},{key:'previous',label:'2025'},{key:'budget',label:'Budget'}]}/>)}</div>)}
    {(view==='central'||view==='central-table')&&<CompanyResults data={data} context={context} selection={selection} basis={basis}/>}
    {view==='kpi'&&<KpiCompanyFigures row={rows[company]} year={year} month={month} basis="ytd"/>}
    {view==='qualitative'&&<PublicationContent form={makeDemoForm('qualitative',{submitted:true})} selection={oneSelection} kind="qualitative" central compact/>}
    {view==='publication'&&<PublicationContent form={getDemoForm(formPath(kind,company))} selection={oneSelection} kind={kind} central compact/>}
    {view==='form'&&<LocalForm kind={kind} revision={revision}/>}
  </main>;
}
createRoot(document.getElementById('root')).render(<Demo/>);
