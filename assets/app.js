const $=s=>document.querySelector(s);
const fmt=d=>new Date(d).toLocaleString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
const card=(e,old)=>`<article class="ev" data-el="${e.element}"><h3>${e.title}</h3>
<p class="meta">${e.dateLabel||fmt(e.date)}</p>${e.place?`<p class="meta">${e.place}</p>`:''}${e.summary?`<p>${e.summary}</p>`:''}
${e.price?`<p class="meta">Quota: ${e.price}</p>`:''}
${old?'':`<a class="btn" href="iscrizioni.html?evento=${e.id}">Iscriviti</a>`}${e.link?`<a class="btn" href="${e.link}" target="_blank" rel="noopener">Pagina Facebook</a>`:''}</article>`;
const empty='<p>Nessun evento in programma. Gli annunci escono su <a href="https://www.instagram.com/land_of_ancient">Instagram</a>.</p>';

fetch('data/events.json').then(r=>r.json()).then(({site,events})=>{
  events.sort((a,b)=>new Date(a.date)-new Date(b.date));
  const now=new Date(),up=events.filter(e=>new Date(e.date)>=now),past=events.filter(e=>new Date(e.date)<now).reverse();
  if($('#prossimi')){
    $('#prossimi').innerHTML=up.map(e=>card(e)).join('')||empty;
    $('#passati').innerHTML=past.map(e=>card(e,1)).join('');
    if(!past.length)$('#passati-box').hidden=true;
  }
  if($('#scelta')){
    const sel=$('#scelta'),opts=up.map(e=>[e.id,e.title,e.formUrl]);
    opts.push(['generale','Altro / informazioni generali',site.generalFormUrl]);
    sel.innerHTML=opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('');
    const want=new URLSearchParams(location.search).get('evento');
    if(opts.some(o=>o[0]===want))sel.value=want;
    const show=()=>{
      const url=(opts.find(o=>o[0]===sel.value)||[])[2]||'';
      const box=$('#modulo');
      if(!url||url.includes('INCOLLA')){
        box.innerHTML='<p>Il modulo di questo evento non è ancora disponibile. Scrivici su <a href="https://www.instagram.com/land_of_ancient">Instagram</a>.</p>';return;}
      const emb=url.includes('embedded=true')?url:url+(url.includes('?')?'&':'?')+'embedded=true';
      box.innerHTML=`<iframe src="${emb}" title="Modulo di iscrizione">Caricamento…</iframe>
      <a class="btn" href="${url}" target="_blank" rel="noopener">Apri il modulo in una nuova scheda</a>`;
    };
    sel.onchange=show;show();
  }
}).catch(()=>{const t=$('#prossimi')||$('#modulo');if(t)t.innerHTML='<p>Impossibile caricare i dati. Se apri il file dal computer, avvia un server locale (vedi README).</p>'});

if($('#galleria'))fetch('data/photos.json').then(r=>r.json()).then(al=>{
  const d=s=>s?new Date(s).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}):'';
  $('#galleria').innerHTML=al.length?al.map(a=>`<section class="album"><h2>${a.title}</h2>${a.date?`<p class="meta">${d(a.date)}</p>`:''}<div class="grid">${a.photos.map((p,i)=>`<button class="th" data-src="${p}" data-alt="${a.title}, foto ${i+1}"><img src="${p}" alt="${a.title}, foto ${i+1}" loading="lazy"></button>`).join('')}</div></section>`).join(''):'<p>Le foto arriveranno presto. Intanto trovi gli scatti più recenti su <a href="https://www.instagram.com/land_of_ancient">Instagram</a>.</p>';
  const lb=$('#lb'),im=lb.querySelector('img'),all=[...document.querySelectorAll('.th')];let n=0;
  const open=i=>{n=(i+all.length)%all.length;im.src=all[n].dataset.src;im.alt=all[n].dataset.alt;if(!lb.open)lb.showModal()};
  all.forEach((b,i)=>b.onclick=()=>open(i));$('#lbx').onclick=()=>lb.close();
  lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
  lb.addEventListener('keydown',e=>{if(e.key==='ArrowRight')open(n+1);if(e.key==='ArrowLeft')open(n-1)});
}).catch(()=>{$('#galleria').innerHTML='<p>Impossibile caricare le foto. Se apri il file dal computer, avvia un server locale (vedi README).</p>'});
