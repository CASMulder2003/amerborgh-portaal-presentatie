import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CompanyResults, CompanyDashboard } from '@portal/pages/reporting/overview/Dashboard.jsx';
import TrendChart from '@portal/pages/reporting/charts/TrendChart.jsx';
import { KpiCompanyFigures } from '@portal/pages/reporting/overview/KpiOverview.jsx';
import { FormEditor } from '@portal/pages/reporting/forms/FormEditor.jsx';
import { FileReview } from '@portal/pages/reporting/imports/FileImport.jsx';
import FileDropZone from '@portal/pages/reporting/imports/FileDropZone.jsx';
import { PublicationContent } from '@portal/pages/reporting/reports/ReportReader.jsx';
import Modal from '@portal/components/Modal.jsx';
import { data, context, selection, companyData, rows, year, month } from './dashboard-fixtures.js';
import { makeDemoForm, formPath, financialSchema, importWorkbook, demoTarget, importValues } from './form-fixtures.js';
import { registerDemoForm } from './local-api.js';
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
function LocalForm({kind='financial', empty=false, revision=0, supplied}) {
  const initial = useMemo(() => registerDemoForm(supplied||makeDemoForm(kind, {empty})), [kind, empty, revision, supplied]);
  return <FormEditor key={`${kind}-${empty}-${revision}`} initial={initial} path={formPath(kind)} reload={() => {}} />;
}
function Demo() {
  const [view,setView]=useState(initialView);
  const [kind,setKind]=useState('financial');
  const [company,setCompany]=useState(0);
  const [tab,setTab]=useState('samenvatting');
  const [basis,setBasis]=useState('ytd');
  const [step,setStep]=useState(0);
  const [revision,setRevision]=useState(0);
  const [importedForm,setImportedForm]=useState(null);
  const notifyStep = next => {
    setStep(next);
    parent.postMessage({type:'portal-demo-step', step:next}, location.origin);
    window.scrollTo(0,0);
  };
  useEffect(() => {
    const receive = event => {
      if(event.origin!==location.origin || event.source!==parent || event.data?.type!=='portal-demo') return;
      if(event.data.view) {setView(event.data.view);setTab('samenvatting');setCompany(0);}
      if(Number.isInteger(event.data.step)) {setStep(event.data.step);setRevision(r=>r+1);setImportedForm(null);}
      window.scrollTo(0,0);
    };
    const links = event => {
      const anchor=event.target.closest('a');
      if(!anchor || !anchor.hash.includes('/')) return;
      event.preventDefault();
      const query=new URLSearchParams(anchor.hash.split('?')[1]||'');
      if(query.has('kind')) {setKind(query.get('kind'));setView('form');}
      else if(query.has('view')) {setTab(query.get('view')); if(query.has('company')) {setCompany(Math.max(0,rows.findIndex(r=>r.company.id===Number(query.get('company')))));setView('company');}}
      else if(query.has('company')) {setCompany(Math.max(0,rows.findIndex(r=>r.company.id===Number(query.get('company')))));setView('company');}
      if(query.has('basis')) setBasis(query.get('basis'));
      window.scrollTo(0,0);
    };
    window.addEventListener('message',receive);
    document.addEventListener('click',links);
    return()=>{window.removeEventListener('message',receive);document.removeEventListener('click',links);};
  },[]);
  const oneSelection={year,month,company:rows[company].company.id};
  return <main className="reporting-workspace">
    {['central','central-table'].includes(view) && <header className="presentation-heading"><h1>Amerborgh</h1><p>Januari t/m augustus 2026</p></header>}
    {view==='company'&&<div className="summary-charts company-summary-charts">{[['revenue','Omzet'],['net_result','Nettoresultaat'],['ebitda','EBITDA']].map(([field,title])=><TrendChart key={field} title={title} defaultStyle={field==='ebitda'?'bridge':'line'} bridgeValues={field==='ebitda'?rows[company].cumulative.actual:undefined} bridgePeriod="Januari t/m Augustus 2026" points={rows[company].series.map(point=>({label:point.period,actual:point.actual[field],previous:point.previous[field],budget:point.budget[field]}))} series={[{key:'actual',label:'2026'},{key:'previous',label:'2025'},{key:'budget',label:'Budget'}]}/>)}</div>}
    {(view==='central'||view==='central-table')&&<CompanyResults data={data} context={context} selection={selection} basis={basis}/>}
    {view==='kpi'&&<KpiCompanyFigures row={rows[company]} year={year} month={month} basis="ytd"/>}
    {view==='qualitative'&&<PublicationContent form={makeDemoForm('qualitative',{submitted:true})} selection={oneSelection} kind="qualitative" central compact/>}
    {view==='form'&&<LocalForm kind={kind} revision={revision}/>}
    {view==='import'&&<>
      {step===0&&<><div className="report-company-heading"><div><p className="eyebrow">Hotel A · Augustus 2026</p><h2>Financiële informatie</h2></div></div><div onClickCapture={event=>{if(event.target.closest('button')){event.preventDefault();event.stopPropagation();notifyStep(1);}}}><FileDropZone enabled onFiles={()=>notifyStep(1)} inputDisabled={false} dropDescription="Augustus 2026"/></div></>}
      {step===1&&<Modal title="Bestand importeren" onClose={()=>notifyStep(0)} className="file-import-dialog sheet-dialog"><FileReview data={importWorkbook} schema={financialSchema} target={demoTarget} values={importValues} onClose={()=>notifyStep(0)} onApply={changes=>{const form=makeDemoForm('financial',{empty:true});form.data.actual=Object.fromEntries(changes.map(change=>[change.field,change.value]));setImportedForm(form);notifyStep(2);}}/></Modal>}
      {step===2&&<LocalForm revision={revision} supplied={importedForm}/>}
    </>}
  </main>;
}
createRoot(document.getElementById('root')).render(<Demo/>);
