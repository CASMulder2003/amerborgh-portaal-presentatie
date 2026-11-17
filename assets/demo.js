/* Fictieve voorbeelden. Geen verbinding met het portaal, geen uploads, opslag of AI-aanroepen. */
(() => {
  'use strict';
  const months = ['Juni', 'Juli', 'Augustus'];
  const companies = [
    { name:'Hotel Duin', revenue:[180000,200000,220000], net:24000, budget:25000, occupancy:[72,78,84] },
    { name:'Hotel Haven', revenue:[150000,155000,160000], net:8000, budget:14000 },
    { name:'Studio Linde', revenue:[90000,98000,110000], net:12000, budget:10000 }
  ];
  const state = {pillar:0, topic:0, delivery:0, form:0, entryReview:false, entryNotice:'', fields:{revenue:'230.000', personnel:'-85.000', net:'26.000', occupancy:'86', rate:'135', nights:'1.450', market:'De zakelijke vraag trekt aan. Er zijn meer aanvragen voor vergaderingen.', support:'We vragen ondersteuning bij het laatste gesprek met de kandidaat voor salesmanager.'}};
  const currency = new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0});
  const integer = new Intl.NumberFormat('nl-NL',{maximumFractionDigits:0});
  const money = n => currency.format(n);
  const mount = (id,html) => {document.getElementById(id).innerHTML=html;};
  const button = (label,action,value,pressed=false,cls='') => `<button type="button" data-action="${action}" data-value="${value}" ${action==='pillar'||action==='topic'||action==='step'||action==='form'?`aria-pressed="${pressed}"`:''} class="${cls}">${label}</button>`;
  function chart(values,formatter,label,height=200) {
    const max=Math.max(...values)*1.25;
    const pts=values.map((v,i)=>({x:90+i*235,y:height-32-v/max*(height-62),v}));
    return `<svg class="chart" viewBox="0 0 650 ${height}" role="img" aria-label="${label}"><line class="grid" x1="45" x2="625" y1="${height-32}" y2="${height-32}"/><path class="series" d="${pts.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' ')}"/>${pts.map((p,i)=>`<circle class="point" cx="${p.x}" cy="${p.y}" r="6"/><text class="value" x="${p.x}" y="${p.y-17}" text-anchor="middle">${formatter(p.v)}</text><text x="${p.x}" y="${height-5}" text-anchor="middle">${months[i]}</text>`).join('')}</svg>`;
  }
  function renderPillars() {
    const items=[
      {title:'Financiële informatie',sub:'De belangrijkste financiële posten',heading:'Resultaat en financiële positie',text:'Een vaste selectie financiële posten om de ontwikkeling te volgen en verschillen met eerdere perioden en het budget te bespreken.',examples:['<strong>Winst en verlies</strong><span>Omzet, kosten, nettoresultaat en EBITDA.</span>','<strong>Balans</strong><span>Vaste activa, debiteuren, liquide middelen en crediteuren.</span>','<strong>Jaarbudget</strong><span>De verwachte financiële cijfers voor het komende jaar.</span>']},
      {title:'KPI’s',sub:'De ontwikkeling van de activiteiten',heading:'De ontwikkeling van de activiteiten',text:'KPI’s helpen volgen wat er commercieel en operationeel verandert. We kiezen per onderneming een beperkt aantal relevante indicatoren.',examples:['<strong>Gebruik en opbrengst</strong><span>Bij een hotel: bezetting en gemiddelde kamerprijs.</span>','<strong>Vraag en klanten</strong><span>Bijvoorbeeld orderintake, nieuwe klanten en klantbehoud.</span>','<strong>Inzet en prestaties</strong><span>Bijvoorbeeld productiviteit en omzet per FTE.</span>']},
      {title:'Kwalitatieve toelichting',sub:'De context en ondersteuning',heading:'Context en benodigde ondersteuning',text:'Korte antwoorden geven context bij de cijfers en maken duidelijk welke onderwerpen in de bespreking aandacht vragen.',examples:['<strong>Ontwikkelingen</strong><span>Wat is er veranderd in de onderneming of de markt?</span>','<strong>Vooruitkijken</strong><span>Welke kansen, risico’s en prioriteiten zijn belangrijk?</span>','<strong>Ondersteuning</strong><span>Waar kan Amerborgh helpen of een besluit nemen?</span>']}
    ];
    const p=items[state.pillar];
    mount('pillars',`<div class="pillars">${items.map((p,i)=>button(`<span class="index">0${i+1}</span><strong>${p.title}</strong><span>${p.sub}</span>`,'pillar',i,i===state.pillar,'pillar')).join('')}</div><div class="pillar-detail" aria-live="polite"><div><h3>${p.heading}</h3><p class="muted">${p.text}</p></div><ul>${p.examples.map(e=>`<li>${e}</li>`).join('')}</ul></div>`);
  }
  function renderOverview() {
    const c=companies[0], total=companies.reduce((t,c)=>t+c.net,0), budget=companies.reduce((t,c)=>t+c.budget,0);
    mount('overview',`<div class="perspectives"><div><div class="perspective-label">De onderneming <span>Eigen resultaten</span></div><div class="portal-frame"><div class="portal-bar"><span>AMERBORGH</span><small>Hotel Duin</small></div><div class="portal-content"><div class="panel-head"><h3>Overzicht</h3><span class="small muted">Augustus 2026</span></div><div class="metric-pair"><div class="metric"><span>Omzet</span><b>${money(c.revenue[2])}</b><small class="good">+10% ten opzichte van juli</small></div><div class="metric"><span>Nettoresultaat</span><b>${money(c.net)}</b><small class="bad">€ 1.000 onder budget</small></div></div><h4>Omzet · juni – augustus</h4>${chart(c.revenue.map(v=>v/1000),v=>'€ '+v+'k','Omzet Hotel Duin: juni 180.000, juli 200.000, augustus 220.000 euro',185)}</div></div></div><div><div class="perspective-label">Amerborgh <span>Bedrijven in samenhang</span></div><div class="portal-frame"><div class="portal-bar"><span>AMERBORGH</span><small>Alle actieve bedrijven</small></div><div class="portal-content"><div class="panel-head"><h3>Resultaten per bedrijf</h3><span class="small muted">Augustus 2026</span></div><table aria-label="Nettoresultaten actieve voorbeeldbedrijven"><thead><tr><th>Bedrijf</th><th>Resultaat</th><th>Budget</th></tr></thead><tbody>${companies.map(c=>`<tr><td>${c.name}</td><td>${integer.format(c.net)}</td><td>${integer.format(c.budget)}</td></tr>`).join('')}<tr class="sum-row"><td>Totaal</td><td>${integer.format(total)}</td><td>${integer.format(budget)}</td></tr></tbody></table><div class="portfolio-callout"><strong>${money(total-budget)}</strong><span>Verschil met budget voor deze drie bedrijven samen</span></div></div></div></div></div><p class="footnote">Voorbeeldcijfers in euro’s</p>`);
  }
  function renderKpis() {
    const c=companies[0];
    mount('kpi-example',`<div class="kpi-layout"><div class="panel"><div class="panel-head"><h3>Hotel Duin</h3><span class="small muted">Juni – augustus 2026</span></div><div class="chart-label">Bezetting</div>${chart(c.occupancy,v=>v+'%','Bezetting Hotel Duin: 72, 78 en 84 procent',160)}<div class="chart-label">Omzet <span>× € 1.000</span></div>${chart(c.revenue.map(v=>v/1000),integer.format.bind(integer),'Omzet Hotel Duin: 180, 200 en 220 duizend euro',160)}</div><div class="kpi-examples"><h3>Andere voorbeelden</h3><div><strong>Commercieel</strong><p>Orderintake, nieuwe klanten en klantbehoud.</p></div><div><strong>Operationeel</strong><p>Bezetting, productiviteit en gemiddelde orderwaarde.</p></div><div><strong>Organisatie</strong><p>FTE en omzet per FTE.</p></div><p class="kpi-principle">Kies wat het bedrijf helpt volgen.</p></div></div><div class="evidence-note">Lees de ontwikkeling samen met de toelichting van de onderneming.</div>`);
  }
  function renderQualitative() {
    const topics=[
      {label:'Ontwikkelingen',question:'Wat zijn de belangrijkste ontwikkelingen?',july:'De opening van de vergaderruimte is uitgesteld. De eerste boekingen verschuiven naar augustus.',august:'De vergaderruimte is op 5 augustus geopend. De uitgestelde boekingen hebben deze maand plaatsgevonden.',change:'De opening is gerealiseerd en de boekingen zijn uitgevoerd.'},
      {label:'Aandachtspunten',question:'Welke risico’s of aandachtspunten spelen er?',july:'De afhankelijkheid van één leverancier voor de wasserij blijft een aandachtspunt.',august:'We hebben een offerte van een tweede wasserij ontvangen. Er is nog geen besluit genomen.',change:'Een alternatief is onderzocht; het besluit staat nog open.'},
      {label:'Ondersteuning',question:'Waar kan Amerborgh ondersteunen?',july:'Voor de werving van een salesmanager vragen we hulp bij de selectie van kandidaten.',august:'Er zijn twee kandidaten gesproken. We vragen Amerborgh om aan te sluiten bij het laatste gesprek.',change:'De vraag verschuift van kandidaten selecteren naar het laatste gesprek.'}
    ];
    const t=topics[state.topic];
    mount('qualitative',`<div class="topbar"><strong>Hotel Duin</strong><div class="group">${topics.map((t,i)=>button(t.label,'topic',i,state.topic===i)).join('')}</div></div><h3 class="question-title">${t.question}</h3><div class="qual-grid"><div class="quote"><span class="month">Juli 2026</span><p>“${t.july}”</p></div><div class="quote"><span class="month">Augustus 2026</span><p>“${t.august}”</p></div></div><div class="qual-change"><strong>Wat verandert?</strong><p>${t.change}</p></div>`);
  }
  const rows=[['Turnover','Omzet',230000],['Net result','Nettoresultaat',26000],['Personnel costs','Personeelskosten',-85000]];
  const importTable=()=>`<table aria-label="Herkenning van het voorbeeldbestand"><thead><tr><th>In het bestand</th><th>In het formulier</th><th>September 2026</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${money(r[2])}</td></tr>`).join('')}</tbody></table>`;
  function renderDelivery() {
    const s=state.delivery,steps=['Bestand','Controleren','Indienen'];
    const explanations=[
      ['Een bestaand bestand gebruiken','Financiële cijfers kunnen handmatig worden ingevuld of uit een Excel- of CSV-bestand worden overgenomen.'],
      ['Herkenning controleren','Het portaal herkent bekende termen en verschillende indelingen. De gebruiker controleert of de juiste bedragen bij de juiste posten staan.'],
      ['Eerst controleren, dan indienen','De import vult het formulier. Pas na de bevestiging wordt de maand ingediend en beschikbaar in het overzicht.'],
      ['De maand is aangeleverd','Amerborgh kan de ingediende informatie meenemen in het overzicht en de bespreking.']
    ];
    let body='',actions='';
    if(s===0){body=`<div class="drop"><h3>Bestand importeren</h3><p>Sleep je bestand hierheen</p>${button('Bestand kiezen','delivery',1,false,'primary')}<span class="small muted file-types">Excel of CSV</span></div>`;}
    if(s===1){body=`<h3>Bestand importeren</h3>${importTable()}`;actions=`${button('Terug','delivery',0)}${button('In het formulier plaatsen','delivery',2,false,'primary')}`;}
    if(s===2){body=`<div class="form-fields">${rows.map(r=>`<div><label>${r[1]}</label><span>${money(r[2])}</span></div>`).join('')}</div><p class="small muted form-status">Concept · nog niet ingediend</p>`;actions=`${button('Terug','delivery',1)}${button('Indienen bevestigen','delivery',3,false,'primary')}`;}
    if(s===3){body='<div class="success"><span class="success-mark">✓</span><h3>Voorbeeld ingediend</h3><p>De financiële informatie voor september staat klaar.</p><p class="small muted">Dit voorbeeld verstuurt of bewaart niets.</p></div>';actions=`<span></span>${button('Opnieuw bekijken','delivery',0)}`;}
    const e=explanations[s];
    mount('delivery',`<div class="step-guide"><span>Bekijk de stappen</span><span>Klik op 2 of 3 om direct verder te kijken.</span></div><div class="delivery-layout"><div><div class="steps">${steps.map((l,i)=>button(`<span>${i+1}</span> ${l}`,'step',i,i===Math.min(s,2),'step')).join('')}</div><div class="portal-frame delivery-frame"><div class="portal-bar"><span>AMERBORGH</span><small>Hotel Duin</small></div><div class="delivery-heading"><h3>Financiële informatie</h3><span>September 2026</span></div><div class="demo-panel" aria-live="polite">${body}${actions?`<div class="demo-actions">${actions}</div>`:''}</div></div></div><div class="delivery-aside"><h3>${e[0]}</h3><p>${e[1]}</p><div class="delivery-context"><strong>Centraal vanuit LucaNet</strong><p>Amerborgh kan meerdere bedrijven tegelijk inladen vanuit het afgesproken exportbestand.</p><small>Met participaties stemmen we hun eigen bestandsstructuur af.</small></div></div></div>`);
  }
  const escapeText = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderEntry() {
    const names=['Financiële informatie','KPI’s','Kwalitatieve toelichting'];
    const definitions=[
      [['Omzet','revenue',''],['Personeelskosten','personnel',''],['Nettoresultaat','net','']],
      [['Bezettingsgraad','occupancy','%'],['Gemiddelde kamerprijs','rate','€'],['Aantal overnachtingen','nights','overnachtingen']],
      [['Welke marktontwikkelingen beïnvloeden het bedrijf?','market',''],['Waar kan Amerborgh bij helpen?','support','']]
    ];
    const explanations=[['Financiële informatie','De onderneming vult de maandcijfers in of controleert geïmporteerde bedragen. Na het indienen gebruikt het portaal deze in het overzicht en de rapportages.'],['KPI’s per bedrijf','De KPI’s worden per onderneming ingesteld. De maandelijkse waarden maken de operationele en commerciële ontwikkeling zichtbaar.'],['De eigen toelichting','De onderneming beschrijft ontwikkelingen en benodigde ondersteuning in eigen woorden. Deze antwoorden geven context voor de bespreking.']];
    const f=state.form,disabled=state.entryReview?'disabled':'';
    const fields=definitions[f].map(([label,key,unit])=>f===2?`<label class="entry-question"><span>${label}</span><textarea data-entry="${key}" rows="2" ${disabled}>${escapeText(state.fields[key])}</textarea></label>`:`<label class="entry-field"><span>${label}</span><div><input type="text" inputmode="decimal" data-entry="${key}" value="${escapeText(state.fields[key])}" ${disabled} aria-label="${label}"><small>${unit}</small></div></label>`).join('');
    mount('entry-demo',`<div class="entry-tabs">${names.map((n,i)=>button(`0${i+1} ${n}`,'form',i,i===f)).join('')}</div><div class="entry-layout"><div class="portal-frame"><div class="portal-bar"><span>AMERBORGH</span><small>Hotel Duin · september 2026</small></div><div class="entry-main"><div class="panel-head"><h3>${names[f]}</h3><span class="entry-badge">${state.entryNotice==='Voorbeeld ingediend'?'Ingediend':state.entryReview?'Controle vóór indienen':'In bewerking'}</span></div>${f===0?'<p class="small muted">Bedragen in euro’s</p>':''}<div class="entry-fields">${fields}</div><div class="entry-actions"><span role="status" class="small muted">${state.entryNotice}</span><div>${state.entryReview?button('Terug naar invullen','entryBack',0)+button('Indienen bevestigen','entryConfirm',0,false,'primary'):button('Opslaan en sluiten','entrySave',0)+button('Formulier indienen','entrySubmit',0,false,'primary')}</div></div></div></div><div class="entry-aside"><h3>${explanations[f][0]}</h3><p>${explanations[f][1]}</p><p class="small muted">Selectie van voorbeeldvelden. De volledige formulieren staan in het portaal.</p></div></div>`);
  }
  document.addEventListener('input',event=>{const key=event.target.dataset.entry;if(key)state.fields[key]=event.target.value;});
  document.addEventListener('keydown',event=>{if(event.target.matches('input,textarea'))event.stopPropagation();},true);
  document.addEventListener('click',event=>{
    const t=event.target.closest('button[data-action]');if(!t)return;
    const a=t.dataset.action;
    if(a==='form'){state.form=+t.dataset.value;state.entryReview=false;state.entryNotice='';renderEntry();}
    if(a==='entrySave'){state.entryNotice='Voorbeeld bewaard';renderEntry();}
    if(a==='entrySubmit'){state.entryReview=true;state.entryNotice='Controleer de ingevulde informatie';renderEntry();}
    if(a==='entryBack'){state.entryReview=false;state.entryNotice='';renderEntry();}
    if(a==='entryConfirm'){state.entryReview=false;state.entryNotice='Voorbeeld ingediend';renderEntry();}
  });
  document.addEventListener('click',event=>{const t=event.target.closest('button[data-action]');if(!t)return;event.preventDefault();const a=t.dataset.action;state[a==='step'?'delivery':a]=Number(t.dataset.value);if(a==='pillar')renderPillars();if(a==='topic')renderQualitative();if(a==='delivery'||a==='step')renderDelivery();});
  function init(){renderPillars();renderOverview();renderKpis();renderQualitative();renderEntry();renderDelivery();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

