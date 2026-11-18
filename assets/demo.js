/* Static presentation with the original portal React components and synthetic data. */
(() => {
  'use strict';
  const state={pillar:0};
  const mount=(id,html)=>{document.getElementById(id).innerHTML=html;};
  const button=(label,action,value,pressed=false,cls='')=>`<button type="button" data-action="${action}" data-value="${value}" aria-pressed="${pressed}" class="${cls}">${label}</button>`;
  const frame=(view,id)=>`<div class="portal-viewport" popover="manual"><div class="portal-preview-bar"><button type="button" class="portal-expand" data-action="expand" aria-expanded="false" aria-controls="${id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg><span>Vergroten</span></button></div><iframe id="${id}" class="real-portal" title="Rapportageportaal: ${view}" src="assets/portal/index.html?view=${view}" loading="eager" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
  function setExpanded(viewport,expanded){
    viewport.dataset.expanded=String(expanded);
    const control=viewport.querySelector('.portal-expand');
    control.setAttribute('aria-expanded',String(expanded));
    control.querySelector('span').textContent=expanded?'Terug naar presentatie':'Vergroten';
    if(expanded&&!viewport.matches(':popover-open'))viewport.showPopover();
    if(!expanded&&viewport.dataset.dialogOpen!=='true'&&viewport.matches(':popover-open'))viewport.hidePopover();
    if(!expanded)control.focus({preventScroll:true});
  }
  function renderPillars() {
    const items=[
      {title:'Financiële cijfers'},
      {title:'KPI’s',heading:'De directie kiest de eigen KPI’s',text:'Welke drie tot vijf indicatoren zijn bepalend voor het succes van de onderneming? De keuze sluit aan op de eigen activiteiten en doelstellingen.',examples:[
        '<strong>Relevant voor de onderneming</strong><span>De indicatoren maken de operationele en commerciële ontwikkeling zichtbaar.</span>',
        '<strong>Duidelijk te vergelijken</strong><span>Iedere KPI krijgt een duidelijke naam, definitie en eenheid.</span>',
        '<strong>Resultaat en ontwikkeling</strong><span>Vergelijk met het budget en, zodra beschikbaar, dezelfde periode vorig jaar. Volg daarnaast de trend over meerdere maanden.</span>'
      ]},
      {title:'Kwalitatieve toelichting',heading:'Drie voorlopige vragen',text:'De toelichting geeft context bij de cijfers en helpt de bespreking voor te bereiden. Er blijft ruimte voor andere onderwerpen die voor de onderneming van belang zijn.',examples:[
        '<strong>Geef een korte toelichting op de resultaten ten opzichte van budget en vorig jaar.</strong>',
        '<strong>Welke ontwikkelingen in- of extern (positief of negatief) hebben er invloed op de resultaten?</strong>',
        '<strong>Wat zijn de prioriteiten, en hoe kan Amerborgh jullie hierbij ondersteunen?</strong>'
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
    if(action==='expand'){const viewport=el.closest('.portal-viewport');setExpanded(viewport,viewport.dataset.expanded!=='true');}

  });
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin || !['portal-dialog','portal-preview-exit'].includes(event.data?.type)) return;
    const iframe=[...document.querySelectorAll('iframe.real-portal')].find(frame=>frame.contentWindow===event.source);
    if(!iframe)return;
    const viewport=iframe.parentElement;
    if(event.data.type==='portal-preview-exit'){if(viewport.dataset.expanded==='true'&&viewport.dataset.dialogOpen!=='true')setExpanded(viewport,false);return;}
    viewport.dataset.dialogOpen=String(Boolean(event.data.open));
    if(event.data.open && !viewport.matches(':popover-open')) viewport.showPopover();
    if(!event.data.open && viewport.dataset.expanded!=='true' && viewport.matches(':popover-open')) viewport.hidePopover();
  });
  document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const viewport=document.querySelector('.portal-viewport[data-expanded="true"]');if(viewport&&viewport.dataset.dialogOpen!=='true'){event.preventDefault();event.stopPropagation();setExpanded(viewport,false);}},true);
  function init(){renderPillars();renderScreens();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
