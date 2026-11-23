/* Static presentation with the original portal React components and synthetic data. */
(() => {
  'use strict';
  const mount=(id,html)=>{document.getElementById(id).innerHTML=html;};
  const frame=(view,id,title)=>`<div class="portal-viewport" popover="manual"><div class="portal-preview-bar"><button type="button" class="portal-expand" data-action="expand" aria-expanded="false" aria-controls="${id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg><span>Vergroten</span></button></div><iframe id="${id}" class="real-portal" title="Rapportageportaal: ${title}" src="assets/portal/index.html?view=${view}&amp;v=${window.portalDemoRevision}" loading="eager" sandbox="allow-scripts allow-same-origin"></iframe></div>`;
  function setExpanded(viewport,expanded){
    viewport.dataset.expanded=String(expanded);
    const control=viewport.querySelector('.portal-expand');
    control.setAttribute('aria-expanded',String(expanded));
    control.querySelector('span').textContent=expanded?'Terug naar presentatie':'Vergroten';
    if(expanded&&!viewport.matches(':popover-open'))viewport.showPopover();
    if(!expanded&&viewport.dataset.dialogOpen!=='true'&&viewport.matches(':popover-open'))viewport.hidePopover();
    if(!expanded)control.focus({preventScroll:true});
  }
  function renderScreens(){
    mount('overview',frame('company','overview-screen','financiële cijfers'));
    mount('kpi-example',frame('kpi','kpi-screen','KPI’s'));
    mount('qualitative',frame('qualitative','qualitative-screen','kwalitatieve toelichtingen'));
    mount('delivery',frame('form','entry-screen','informatie aanleveren'));
  }
  document.addEventListener('click',event=>{
    const el=event.target.closest('button[data-action]');if(!el)return;
    const action=el.dataset.action;
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
  function init(){renderScreens();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
