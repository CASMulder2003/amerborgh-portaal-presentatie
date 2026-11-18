/* Static presentation with the original portal React components and synthetic data. */
(() => {
  'use strict';
  const state={pillar:0};
  const mount=(id,html)=>{document.getElementById(id).innerHTML=html;};
  const button=(label,action,value,pressed=false,cls='')=>`<button type="button" data-action="${action}" data-value="${value}" aria-pressed="${pressed}" class="${cls}">${label}</button>`;
  const frame=(view,id)=>`<div class="portal-viewport" popover="manual"><iframe id="${id}" class="real-portal" title="Rapportageportaal: ${view}" src="assets/portal/index.html?view=${view}" loading="eager" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
  function renderPillars() {
    const items=[
      {title:'Financiële informatie'},
      {title:'KPI’s',sub:'De ontwikkeling van de activiteiten',heading:'De ontwikkeling van de activiteiten',text:'KPI’s helpen volgen wat er commercieel en operationeel verandert. We kiezen per onderneming een beperkt aantal relevante indicatoren.',examples:['<strong>Gebruik en opbrengst</strong><span>Bij een hotel: bezetting en gemiddelde kamerprijs.</span>','<strong>Vraag en klanten</strong><span>Bijvoorbeeld orderintake, nieuwe klanten en klantbehoud.</span>','<strong>Inzet en prestaties</strong><span>Bijvoorbeeld productiviteit en omzet per FTE.</span>']},
      {title:'Kwalitatieve toelichting',sub:'De context en ondersteuning',heading:'Context en benodigde ondersteuning',text:'Korte antwoorden geven context bij de cijfers en maken duidelijk welke onderwerpen in de bespreking aandacht vragen.',examples:['<strong>Ontwikkelingen</strong><span>Welke marktontwikkelingen beïnvloeden het bedrijf?</span>','<strong>Vooruitkijken</strong><span>Welke kansen of risico’s vragen de komende maand aandacht?</span>','<strong>Ondersteuning</strong><span>Waar kan Amerborgh bij helpen?</span>']}
    ];
    const p=items[state.pillar];
    const financial=`<div class="financial-pillar-detail" aria-live="polite"><div><h3>Winst-en-verliesrekening</h3><ul>${['Omzet','Kostprijs van de omzet','Personeelskosten','Huur','Afschrijvingen','Financiële baten en lasten · extern','Financiële baten en lasten · intercompany','Nettoresultaat','EBITDA'].map(label=>`<li>${label}</li>`).join('')}</ul></div><div><h3>Balans</h3><ul>${['Materiële vaste activa','Debiteuren','Liquide middelen','Crediteuren'].map(label=>`<li>${label}</li>`).join('')}</ul><h3 class="budget-heading">Jaarbudget</h3><p>De verwachte financiële cijfers voor het komende jaar.</p><p class="calculation-note">EBITDA wordt bij handmatige invoer berekend en bij LucaNet uit het bestand overgenomen.</p></div></div>`;
    mount('pillars',`<div class="pillars">${items.map((p,i)=>button(`<span class="index">0${i+1}</span><strong>${p.title}</strong>`,'pillar',i,i===state.pillar,'pillar')).join('')}</div>${state.pillar===0?financial:`<div class="pillar-detail" aria-live="polite"><div><h3>${p.heading}</h3><p class="muted">${p.text}</p></div><ul>${p.examples.map(e=>`<li>${e}</li>`).join('')}</ul></div>`}`);
  }

  function renderScreens(){
    mount('overview',frame('company','overview-screen'));
    mount('kpi-example',frame('kpi','kpi-screen'));
    mount('qualitative',frame('qualitative','qualitative-screen'));
    mount('central-overview',frame('central','central-screen'));
    mount('delivery',frame('form','entry-screen'));
  }
  document.addEventListener('click',event=>{
    const el=event.target.closest('button[data-action]');if(!el)return;
    const action=el.dataset.action;
    if(action==='pillar'){state.pillar=+el.dataset.value;renderPillars();}

  });
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin || event.data?.type!=='portal-dialog') return;
    const iframe=[...document.querySelectorAll('iframe.real-portal')].find(frame=>frame.contentWindow===event.source);
    if(!iframe)return;
    const viewport=iframe.parentElement;
    if(event.data.open && !viewport.matches(':popover-open')) viewport.showPopover();
    if(!event.data.open && viewport.matches(':popover-open')) viewport.hidePopover();
  });
  function init(){renderPillars();renderScreens();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
