/* Static presentation with the original portal React components and synthetic data. */
(() => {
  'use strict';
  const state={pillar:0,delivery:0};
  const mount=(id,html)=>{document.getElementById(id).innerHTML=html;};
  const button=(label,action,value,pressed=false,cls='')=>`<button type="button" data-action="${action}" data-value="${value}" aria-pressed="${pressed}" class="${cls}">${label}</button>`;
  const frame=(view,id)=>`<iframe id="${id}" class="real-portal" title="Rapportageportaal: ${view}" src="assets/portal/index.html?view=${view}" loading="eager" sandbox="allow-scripts allow-same-origin"></iframe>`;
  function renderPillars() {
    const items=[
      {title:'Financiële informatie',sub:'De belangrijkste financiële posten',heading:'Resultaat en financiële positie',text:'Een vaste selectie financiële posten om de ontwikkeling te volgen en verschillen met eerdere perioden en het budget te bespreken.',examples:['<strong>Winst en verlies</strong><span>Omzet, kosten, nettoresultaat en EBITDA.</span>','<strong>Balans</strong><span>Vaste activa, debiteuren, liquide middelen en crediteuren.</span>','<strong>Jaarbudget</strong><span>De verwachte financiële cijfers voor het komende jaar.</span>']},
      {title:'KPI’s',sub:'De ontwikkeling van de activiteiten',heading:'De ontwikkeling van de activiteiten',text:'KPI’s helpen volgen wat er commercieel en operationeel verandert. We kiezen per onderneming een beperkt aantal relevante indicatoren.',examples:['<strong>Gebruik en opbrengst</strong><span>Bij een hotel: bezetting en gemiddelde kamerprijs.</span>','<strong>Vraag en klanten</strong><span>Bijvoorbeeld orderintake, nieuwe klanten en klantbehoud.</span>','<strong>Inzet en prestaties</strong><span>Bijvoorbeeld productiviteit en omzet per FTE.</span>']},
      {title:'Kwalitatieve toelichting',sub:'De context en ondersteuning',heading:'Context en benodigde ondersteuning',text:'Korte antwoorden geven context bij de cijfers en maken duidelijk welke onderwerpen in de bespreking aandacht vragen.',examples:['<strong>Ontwikkelingen</strong><span>Welke marktontwikkelingen beïnvloeden het bedrijf?</span>','<strong>Vooruitkijken</strong><span>Welke kansen of risico’s vragen de komende maand aandacht?</span>','<strong>Ondersteuning</strong><span>Waar kan Amerborgh bij helpen?</span>']}
    ];
    const p=items[state.pillar];
    mount('pillars',`<div class="pillars">${items.map((p,i)=>button(`<span class="index">0${i+1}</span><strong>${p.title}</strong>`,'pillar',i,i===state.pillar,'pillar')).join('')}</div><div class="pillar-detail" aria-live="polite"><div><h3>${p.heading}</h3><p class="muted">${p.text}</p></div><ul>${p.examples.map(e=>`<li>${e}</li>`).join('')}</ul></div>`);
  }

  function renderScreens(){
    mount('overview',frame('company','overview-screen'));
    mount('kpi-example',frame('kpi','kpi-screen'));
    mount('qualitative',frame('qualitative','qualitative-screen'));
    mount('central-overview',frame('central','central-screen'));
    mount('delivery',`<div class="screen-tabs">${button('Zelf invullen','deliverymode','manual',true)}${button('Bestand gebruiken','deliverymode','file')}</div><div id="manual-demo">${frame('form','entry-screen')}</div><div id="file-demo" hidden><div class="step-guide"><span>Klik op 2 of 3 om direct verder te kijken.</span></div><div class="steps">${['Bestand','Controleren','Indienen'].map((label,i)=>button(`<span>${i+1}</span> ${label}`,'step',i,i===0,'step')).join('')}</div>${frame('import','import-screen')}</div>`);
  }
  function deliveryText(step){document.querySelectorAll('[data-action="step"]').forEach(el=>el.setAttribute('aria-pressed',+el.dataset.value===step));}
  function send(id,message){document.getElementById(id).contentWindow.postMessage({type:'portal-demo',...message},location.origin);}
  document.addEventListener('click',event=>{
    const el=event.target.closest('button[data-action]');if(!el)return;
    const action=el.dataset.action;
    if(action==='pillar'){state.pillar=+el.dataset.value;renderPillars();}
    if(action==='perspective'){send('overview-screen',{view:el.dataset.value});document.querySelectorAll('[data-action="perspective"]').forEach(b=>b.setAttribute('aria-pressed',b===el));}
    if(action==='deliverymode'){document.getElementById('manual-demo').hidden=el.dataset.value!=='manual';document.getElementById('file-demo').hidden=el.dataset.value!=='file';document.querySelectorAll('[data-action="deliverymode"]').forEach(b=>b.setAttribute('aria-pressed',b===el));}
    if(action==='step'){state.delivery=+el.dataset.value;send('import-screen',{step:state.delivery});deliveryText(state.delivery);}
  });
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===document.getElementById('import-screen')?.contentWindow&&event.data?.type==='portal-demo-step')deliveryText(event.data.step);});
  function init(){renderPillars();renderScreens();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
