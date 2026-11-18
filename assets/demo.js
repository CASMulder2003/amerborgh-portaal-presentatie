/* Static presentation with the original portal React components and synthetic data. */
(() => {
  'use strict';
  const state={pillar:0};
  const mount=(id,html)=>{document.getElementById(id).innerHTML=html;};
  const button=(label,action,value,pressed=false,cls='')=>`<button type="button" data-action="${action}" data-value="${value}" aria-pressed="${pressed}" class="${cls}">${label}</button>`;
  const frame=(view,id)=>`<div class="portal-viewport" popover="manual"><iframe id="${id}" class="real-portal" title="Rapportageportaal: ${view}" src="assets/portal/index.html?view=${view}" loading="eager" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
  function renderPillars() {
    const items=[
      {title:'Financiële cijfers'},
      {title:'KPI’s',heading:'Circa drie tot vijf KPI’s per bedrijf',text:'We kiezen indicatoren die passen bij de activiteiten van de onderneming. Met een vaste definitie en eenheid kunnen we hun ontwikkeling over meerdere maanden volgen.',examples:[
        '<strong>Klanten</strong><span>Nieuwe klanten, klantbehoud of omzet per klant.</span>',
        '<strong>Verkoop</strong><span>Orderintake, sales pipeline of conversie.</span>',
        '<strong>Bedrijfsvoering</strong><span>Bezettingsgraad, productiviteit of omzet per FTE.</span>'
      ]},
      {title:'Kwalitatieve toelichting',heading:'Ontwikkelingen en ondersteuning',text:'De onderneming beschrijft belangrijke veranderingen en de ondersteuning die zij nodig heeft. Dit zijn voorbeeldvragen. De definitieve vragen bespreken we nog per onderneming.',examples:[
        '<strong>Welke marktontwikkelingen beïnvloeden het bedrijf?</strong><span>Wat merk je bij klanten, concurrenten of leveranciers?</span>',
        '<strong>Welke kansen of risico’s vragen de komende maand aandacht?</strong>',
        '<strong>Waar kan Amerborgh bij helpen?</strong><span>Noem eventuele ondersteuning of een besluit dat nodig is.</span>'
      ]}
    ];
    const p=items[state.pillar];
    const list=labels=>`<ul>${labels.map(label=>`<li>${label}</li>`).join('')}</ul>`;
    const financial=`<div class="financial-detail" aria-live="polite">
      <div class="financial-columns">
        <div class="financial-section pnl-section">
          <h3>Winst-en-verliesrekening</h3><p class="section-caption">Opbrengsten, kosten en resultaat over de gekozen periode.</p>
          <div class="pnl-columns">
            ${list(['Omzet','Kostprijs van de omzet','Personeelskosten','Huur','Afschrijvingen'])}
            ${list(['Financiële baten en lasten<ul class="financial-subitems"><li>Extern</li><li>Intercompany</li></ul>','Nettoresultaat','EBITDA'])}
          </div>
        </div>
        <div class="financial-section balance-section">
          <h3>Balans</h3><p class="section-caption">De stand aan het einde van de periode.</p>
          ${list(['Materiële vaste activa','Debiteuren','Liquide middelen','Crediteuren'])}
        </div>
      </div>
      <div class="financial-context">
        <div><h4>Vergelijkingen</h4><p>Realisatie tegenover dezelfde periode vorig jaar en, waar beschikbaar, het budget.</p></div>
        <div><h4>Jaarbudget</h4><p>De begrote financiële cijfers voor het komende jaar, verdeeld over de maanden.</p></div>
      </div>
    </div>`;
    mount('pillars',`<div class="pillars">${items.map((p,i)=>button(`<strong>${p.title}</strong>`,'pillar',i,i===state.pillar,'pillar')).join('')}</div>${state.pillar===0?financial:`<div class="pillar-detail" aria-live="polite"><div><h3>${p.heading}</h3><p>${p.text}</p></div><ul>${p.examples.map(e=>`<li>${e}</li>`).join('')}</ul></div>`}`);
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
