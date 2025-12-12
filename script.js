
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const floatArea = document.getElementById('floatArea');

  // apply theme by timezone
  function applyTheme(name){
    if(name === 'dark') root.setAttribute('data-theme','dark');
    else root.removeAttribute('data-theme');
  }
  try{
    const hour = new Date().getHours();
    const autoTheme = (hour>=6 && hour<18)? 'dark':'dark';
    applyTheme(autoTheme);
    //toggle.textContent = autoTheme === 'light' ? '☼' : '☾';
  }catch(e){ applyTheme('dark') }

  toggle.addEventListener('click', ()=>{
    const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'dark';
    applyTheme(cur);
    //toggle.textContent = cur === 'light' ? '☼' : '☾';
  });

  // create floating blobs (researcher-friendly palette)
  const colors = ['#34c1ff','#21a6c1','#7be0ff'];
  function makeBlobs(){
    const count = 4;
    for(let i=0;i<count;i++){
      const b = document.createElement('div');
      b.className = 'blob';
      b.style.width = (180 + Math.random()*160) + 'px';
      b.style.height = b.style.width;
      b.style.left = (20 + Math.random()*60) + '%';
      b.style.top = (10 + Math.random()*60) + '%';
      b.style.background = colors[i % colors.length];
      b.style.animationDelay = (i*1.3) + 's';
      floatArea.appendChild(b);
    }
  }
  makeBlobs();




  
  // simple icon builder: inject svg paths based on data-name
  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5L12 4l9 7.5"/><path d="M9 21V12h6v9"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>',
    research: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4.35-4.35"/></svg>',
    pub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8l6 6v8a2 2 0 0 1-2 2z"/></svg>',
    project: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10V6a2 2 0 0 0-2-2h-4"/><path d="M3 14v4a2 2 0 0 0 2 2h4"/><circle cx="12" cy="12" r="3"/></svg>',
    services: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2v20"/><path d="M2 12h20"/></svg>',
    contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10a8.38 8.38 0 0 1 .1 1 8.5 8.5 0 1 1-7.9-8.49"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8l9 6 9-6"/><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.5 3l-5 2-5-2-6 2v15l6-2 5 2 5-2 5 2V5z"/></svg>',
    links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 14a5 5 0 0 0 7.07 0l1.41-1.41"/><path d="M14 10a5 5 0 0 0-7.07 0L5.52 11.41"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 11v6"/><circle cx="8" cy="8" r="1.5"/><path d="M16 11v3a2 2 0 0 1 2 2v3"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 19c-5 1-5-2-7-3"/><path d="M20 19c0 2-2 3-5 3"/><path d="M12 2C9 2 7 4 7 7c0 4 5 7 5 7s5-3 5-7c0-3-2-5-5-5z"/></svg>'
  };

  document.querySelectorAll('.icon').forEach(node=>{
    const name = node.dataset.name;
    if(icons[name]){
      node.innerHTML = icons[name];
      node.classList.add('glow');
    }
  });

  // render publications
  fetch('publications.json').then(r=>r.json()).then(data=>{
    const container = document.getElementById('pubList');
    data.sort((a,b)=>b.year-a.year);
    const ul = document.createElement('ul');
    ul.className = 'pubs';
    data.forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${p.year}</strong> — ${p.title} <span class="venue">(${p.venue})</span>`;
      ul.appendChild(li);
    });
    container.innerHTML=''; container.appendChild(ul);
  }).catch(e=>{ console.warn(e) });

  // make social icons glow subtly when visible
  function glowOnScroll(){
    document.querySelectorAll('.icon.glow').forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight && r.bottom > 0){
        el.style.opacity = 1;
      } else {
        el.style.opacity = 0.7;
      }
    });
  }
  glowOnScroll();
  window.addEventListener('scroll', glowOnScroll);
})();


document.addEventListener("mousemove", (e)=>{
  document.body.style.setProperty("--mx", e.clientX+"px");
  document.body.style.setProperty("--my", e.clientY+"px");
});

// Smooth scroll motion
window.addEventListener("scroll", ()=>{
  document.body.style.backgroundPositionY = -(window.scrollY * 0.2) + "px";
});
