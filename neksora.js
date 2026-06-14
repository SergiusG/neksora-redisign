(function(){
  var ACCENT='#2b7fff';

  function getLang(){
    try{return localStorage.getItem('nx_lang')||'ru';}catch(e){return 'ru';}
  }
  function setLang(lang){
    try{localStorage.setItem('nx_lang',lang);}catch(e){}
    applyLang(lang);
  }
  function applyLang(lang){
    var t=window.NX_COPY&&window.NX_COPY[lang];
    if(!t)return;
    // Text content
    document.querySelectorAll('[data-k]').forEach(function(el){
      var v=el.getAttribute('data-k').split('.').reduce(function(o,k){return o&&o[k];},t);
      if(v!=null&&typeof v==='string')el.textContent=v;
    });
    // HTML content (for SVG/HTML strings)
    document.querySelectorAll('[data-kh]').forEach(function(el){
      var v=el.getAttribute('data-kh').split('.').reduce(function(o,k){return o&&o[k];},t);
      if(v!=null)el.innerHTML=v;
    });
    // Placeholders
    document.querySelectorAll('[data-kp]').forEach(function(el){
      var v=el.getAttribute('data-kp').split('.').reduce(function(o,k){return o&&o[k];},t);
      if(v!=null)el.setAttribute('placeholder',v);
    });
    // Lang toggle button styles
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      var active=btn.getAttribute('data-lang')===lang;
      btn.style.background=active?ACCENT:'transparent';
      btn.style.color=active?'#fff':'#b2b6bd';
    });
    // Page title
    if(t.pageTitle)document.title=t.pageTitle;
    // Page-specific callback
    if(window.NX_ON_LANG)window.NX_ON_LANG(lang,t);
  }

  // Burger menu
  var menuOpen=false;
  function initBurger(){
    var btn=document.getElementById('nx-burger');
    var menu=document.getElementById('nx-mobile-menu');
    var iconBurger=document.getElementById('nx-burger-icon');
    var iconClose=document.getElementById('nx-burger-close');
    if(!btn||!menu)return;
    btn.addEventListener('click',function(){
      menuOpen=!menuOpen;
      menu.style.display=menuOpen?'block':'none';
      menu.classList.toggle('is-open',menuOpen);
      btn.setAttribute('aria-expanded',String(menuOpen));
      if(iconBurger)iconBurger.style.display=menuOpen?'none':'block';
      if(iconClose)iconClose.style.display=menuOpen?'block':'none';
    });
    menu.querySelectorAll('[data-close-menu]').forEach(function(el){
      el.addEventListener('click',function(){
        menuOpen=false;
        menu.style.display='none';
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded','false');
        if(iconBurger)iconBurger.style.display='block';
        if(iconClose)iconClose.style.display='none';
      });
    });
  }

  function initReveal(){
    var els=[].slice.call(document.querySelectorAll('.nx-reveal'));
    if(!els.length)return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce||!('IntersectionObserver' in window)){
      els.forEach(function(el){el.classList.add('is-visible');});
      return;
    }
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){obs.observe(el);});
  }

  function initLangBtns(){
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.addEventListener('click',function(){
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    initBurger();
    initLangBtns();
    applyLang(getLang());
    initReveal();
  });

  window.NX={getLang:getLang,setLang:setLang,applyLang:applyLang};
})();