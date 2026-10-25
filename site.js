(() => {
 'use strict';
 const ar=document.documentElement.lang==='ar';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const select=(selector,root=document)=>root.querySelector(selector);
 const all=(selector,root=document)=>[...root.querySelectorAll(selector)];
 const header=select('.site-header');
 const menu=select('.menu-toggle');
 const nav=select('#site-nav');
 const closeMenu=()=>{menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');document.body.classList.remove('menu-open');};
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);if(open)select('a',nav)?.focus();});
 all('a',nav).forEach(link=>link.addEventListener('click',closeMenu));
 matchMedia('(max-width:700px)').addEventListener('change',event=>{if(!event.matches)closeMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape' && nav?.classList.contains('open')){closeMenu();menu.focus();}if(event.key==='Tab' && nav?.classList.contains('open')){const focusable=[menu,...all('a',nav),...all('.header-actions a',header)].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
 let ticking=false;
 const onScroll=()=>{header?.classList.toggle('scrolled',scrollY>30);select('.back-top')?.classList.toggle('visible',scrollY>600);const max=document.documentElement.scrollHeight-innerHeight;const progress=max>0?Math.min(1,scrollY/max):0;const bar=select('.reading-progress');if(bar)bar.style.transform=`scaleX(${progress})`;ticking=false;};
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});onScroll();
 if(window.gsap && window.ScrollTrigger && !reduce){
  gsap.registerPlugin(ScrollTrigger);
  all('[data-reveal]').forEach(element=>gsap.from(element,{y:28,duration:.75,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 92%',once:true},clearProps:'transform'}));
  const hero=select('.hero-image');if(hero)gsap.from(hero,{scale:1.035,duration:1.8,ease:'power2.out',clearProps:'transform'});
  all('.hero-photo,.interior-hero-image').forEach(element=>gsap.to(select('img',element),{yPercent:4,ease:'none',scrollTrigger:{trigger:element,start:'top top',end:'bottom top',scrub:1}}));
 }
 all('.service-detail').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)all('.service-detail').filter(other=>other!==detail).forEach(other=>other.open=false);}));
 const base=new URL(document.body.dataset.assetRoot,location.href).href.replace(/\/$/,'');
 const imagePath=(name,width='')=>`${base}/assets/images/${name}${width?'-'+width:''}.webp`;
 const images=JSON.parse(select('#image-manifest').textContent);
 const imageSources=name=>images[name].variants.map(variant=>`${base}/assets/images/${variant.file} ${variant.width}w`).join(', ');
 const journey=all('[data-journey-step]');
 const showStage=index=>{journey.forEach((button,i)=>{const active=i===index;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});all('[data-journey-panel]').forEach((panel,i)=>{panel.classList.toggle('active',i===index);panel.hidden=i!==index;});};
 journey.forEach((button,index)=>{button.addEventListener('click',()=>showStage(index));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+(ar?-1:1)+journey.length)%journey.length;if(event.key==='ArrowLeft')next=(index+(ar?1:-1)+journey.length)%journey.length;if(event.key==='Home')next=0;if(event.key==='End')next=journey.length-1;if(next!==undefined){event.preventDefault();showStage(next);journey[next].focus();}});});
 if(journey.length)showStage(0);
 const depth=select('[data-depth]');
 if(depth && !reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){let frame=null,point;const observer=new IntersectionObserver(([entry])=>depth.dataset.inView=String(entry.isIntersecting));observer.observe(depth);depth.addEventListener('pointermove',event=>{if(depth.dataset.inView!=='true')return;point={x:event.clientX,y:event.clientY};if(frame)return;frame=requestAnimationFrame(()=>{const rect=depth.getBoundingClientRect();depth.style.setProperty('--tilt-x',`${((point.y-rect.top)/rect.height-.5)*-2}deg`);depth.style.setProperty('--tilt-y',`${((point.x-rect.left)/rect.width-.5)*2}deg`);frame=null;});},{passive:true});depth.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=null;depth.style.removeProperty('--tilt-x');depth.style.removeProperty('--tilt-y');});}
 const perspectives=[
  {img:'process',title:ar?'من رؤية<br>طموحة إلى<br><em>أثر يدوم.</em>':'From Vision<br>to Lasting<br><em>Impact.</em>',text:ar?'نمنح الطموح خطة واضحة، ونحوّل الأفكار إلى مساحات تصنع فرقًا.':'We bring structure to ambition. And turn what’s possible into places that matter.',alt:ar?'مخططات معمارية وعينات مواد — صورة تصورية':'Architectural plans and material samples — concept image'},
  {img:'atrium',title:ar?'كل تفصيلة<br>تصنع<br><em>فرقًا.</em>':'Every Detail.<br>One Clear<br><em>Direction.</em>',text:ar?'تخطيط دقيق، وتنسيق مستمر، وتنفيذ يربط التفاصيل بالهدف.':'Precision in the plan. Clarity in the process. Purpose in every space.',alt:ar?'بهو حجري وسلم منحني — صورة تصورية':'Stone atrium and curved staircase — concept image'},
  {img:'hero',title:ar?'الفكرة بداية.<br>الخطة تصنع<br><em>الطريق.</em>':'Big Ideas.<br>Grounded<br><em>Thinking.</em>',text:ar?'نحدد الأولويات، ونربط الموارد والكوادر بالخطوة المناسبة.':'We connect the vision to the resources, the people and the next right move.',alt:ar?'عمارة حجرية معاصرة — صورة تصورية':'Contemporary stone architecture — concept image'}
 ];
 let perspective=0;
 const preload=(src)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=src;});
 let heroBusy=false;
 all('[data-hero-step]').forEach(button=>button.addEventListener('click',async()=>{if(heroBusy)return;heroBusy=true;const next=(perspective+Number(button.dataset.heroStep)+perspectives.length)%perspectives.length;const data=perspectives[next];const img=select('.hero-photo img');try{await preload(imagePath(data.img,1280));perspective=next;const update=()=>{img.src=imagePath(data.img);img.srcset=imageSources(data.img);img.alt=data.alt;select('#hero-title').innerHTML=data.title;select('.hero-copy>p:not(.eyebrow)').textContent=data.text;select('.hero-index').innerHTML=`0${next+1} <small>/ 03</small>`;};if(window.gsap&&!reduce){gsap.to(img,{opacity:.3,duration:.18,onComplete:()=>{update();gsap.to(img,{opacity:1,duration:.45,clearProps:'opacity'});heroBusy=false;}});}else{update();heroBusy=false;}}catch{heroBusy=false;}}));
 all('[data-featured-image]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.featuredImage;const img=select('.featured-main img');img.src=imagePath(name);img.srcset=imageSources(name);img.alt=select('img',button).alt;all('[data-featured-image]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));select('[data-featured-count]').textContent=`0${name.slice(-1)} / 03`;}));
 const search=select('[data-project-search]');let filter='all';
 const applyFilter=()=>{const term=(search?.value||'').trim().toLocaleLowerCase();let count=0;all('[data-project]').forEach(card=>{const visible=(filter==='all'||card.dataset.sector.split(' ').includes(filter))&&card.dataset.search.toLocaleLowerCase().includes(term);card.hidden=!visible;if(visible)count++;});const countNode=select('[data-result-count]');if(countNode)countNode.textContent=ar?`${count} ${count>=3&&count<=10?'مشاريع':'مشروع'}`:`${count} ${count===1?'project':'projects'}`;const empty=select('[data-empty]');if(empty)empty.hidden=count>0;};
 all('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;all('[data-filter]').forEach(other=>{other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));});applyFilter();}));search?.addEventListener('input',applyFilter);
 select('[data-reset-filters]')?.addEventListener('click',()=>{search.value='';filter='all';all('[data-filter]').forEach(button=>{const active=button.dataset.filter==='all';button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});applyFilter();search.focus();});
 const gallery=all('[data-gallery-index]');const lightbox=select('.lightbox');let galleryIndex=0;let opener=null;
 const showPhoto=(index)=>{galleryIndex=(index+gallery.length)%gallery.length;const item=gallery[galleryIndex];const img=select('[data-lightbox-image]');img.src=item.dataset.gallerySrc;img.alt=select('img',item).alt;select('[data-lightbox-count]').textContent=`${String(galleryIndex+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;};
 gallery.forEach(button=>button.addEventListener('click',()=>{opener=button;showPhoto(Number(button.dataset.galleryIndex));lightbox.showModal();}));
 all('[data-lightbox-step]').forEach(button=>button.addEventListener('click',()=>showPhoto(galleryIndex+Number(button.dataset.lightboxStep))));select('[data-lightbox-close]')?.addEventListener('click',()=>lightbox.close());
 lightbox?.addEventListener('close',()=>opener?.focus());lightbox?.addEventListener('click',event=>{if(event.target===lightbox){const rect=lightbox.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)lightbox.close();}});
 document.addEventListener('keydown',event=>{if(!lightbox?.open)return;if(event.key==='ArrowRight'){event.preventDefault();showPhoto(galleryIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(galleryIndex-1);}});
 const form=select('[data-contact-form]');
 form?.addEventListener('submit',async event=>{event.preventDefault();if(document.body.dataset.presentation==='true'){const status=select('[data-form-status]');status.textContent=ar?'اكتملت تجربة النموذج. هذه نسخة عرض؛ لم يتم حفظ أو إرسال أي بيانات.':'Form preview complete. This presentation does not save or send any data.';status.className='form-status';status.focus();return;}const button=select('button[type=submit]',form);const status=select('[data-form-status]');button.disabled=true;button.textContent=button.dataset.busy;status.textContent='';status.className='form-status';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},credentials:'same-origin'});const result=await response.json();status.textContent=result.message;status.classList.add(result.ok?'success':'error');if(result.ok){all('input:not([type=hidden]),textarea',form).forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value='';});button.hidden=true;}status.focus();}catch{status.classList.add('error');status.textContent=ar?'تعذر الاتصال. حاول مجددًا أو راسلنا عبر البريد.':'Connection failed. Please retry or email us directly.';status.focus();}finally{button.disabled=false;button.textContent=button.dataset.idle;}});
})();
