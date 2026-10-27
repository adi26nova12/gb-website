/* GB Realty · Opus One — interactions */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => n.toLocaleString('en-IN');
  if (reduced) document.documentElement.classList.add('reduced');
  $('#year').textContent = new Date().getFullYear();

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = target => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    e.preventDefault();
    closeMenu(); closePlan();
    scrollToEl(id === '#top' ? document.body : id);
  }));

  /* ---------- Frame sequence on canvas ---------- */
  class Sequence {
    constructor(canvas, dir, count) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d');
      this.dir = dir; this.count = count; this.frames = new Array(count); this.current = -1; this.target = 0;
      this.resize = this.resize.bind(this);
      addEventListener('resize', this.resize);
    }
    src(i) { return `${this.dir}/f${String(i + 1).padStart(3, '0')}.webp`; }
    load(onProgress) {
      let done = 0;
      return Promise.all(Array.from({ length: this.count }, (_, i) => new Promise(res => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = img.onerror = () => {
          this.frames[i] = img; onProgress && onProgress(++done / this.count);
          if (i === 0 || i === this.target) this.draw(this.target, true); // swap in the real frame once it arrives
          res();
        };
        img.src = this.src(i);
      })));
    }
    resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = this.canvas;
      if (!w || !h) return;
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
      this.draw(this.target || 0, true);
    }
    nearest(i) { // fall back to the closest loaded frame
      for (let d = 0; d < this.count; d++) {
        if (this.frames[i - d]?.naturalWidth) return this.frames[i - d];
        if (this.frames[i + d]?.naturalWidth) return this.frames[i + d];
      }
    }
    draw(i, force) {
      i = Math.max(0, Math.min(this.count - 1, Math.round(i)));
      this.target = i;
      if (i === this.current && !force) return;
      const img = this.nearest(i); if (!img) return;
      this.current = img === this.frames[i] ? i : -1; // a stand-in frame doesn't count as drawn
      const { width: cw, height: ch } = this.canvas;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
  }

  const opening = new Sequence($('#openingCanvas'), 'assets/seq/opening', window.SEQ_COUNTS?.opening || 120);
  const entrance = new Sequence($('#entranceCanvas'), 'assets/seq/entrance', window.SEQ_COUNTS?.entrance || 79);
  opening.resize(); entrance.resize();

  /* ---------- Preloader ---------- */
  const bar = $('#loaderBar'), pct = $('#loaderPct');
  const setPct = p => { bar.style.width = `${p * 100}%`; pct.textContent = Math.round(p * 100); };
  const minDelay = new Promise(r => setTimeout(r, 900));
  Promise.all([opening.load(setPct), document.fonts?.ready, minDelay]).then(() => {
    $('#loader').classList.add('is-done');
    document.body.classList.remove('is-loading');
    lenis && lenis.start();
    ScrollTrigger.refresh();
    intro();
    entrance.load(); // continue in the background
  });

  /* ---------- Hero intro ---------- */
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.opening__title .line > span', { y: 0, duration: 1.6, stagger: .12 })
      .to('.opening__hero .rule', { width: 56, opacity: .5, duration: 1.2 }, '-=1.1')
      .to('.opening__tag', { opacity: .9, duration: 1.2 }, '-=1')
      .to(['.opening__scroll', '.opening__dev'], { opacity: 1, duration: 1.2 }, '-=.9');
  }

  /* ---------- 01 Opening scrub ---------- */
  const openState = { f: 0 };
  gsap.timeline({
    scrollTrigger: { trigger: '#opening', start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.6 }
  })
    .to(openState, { f: opening.count - 1, ease: 'none', duration: 1, onUpdate: () => opening.draw(openState.f) }, 0)
    .to('#openingHero', { opacity: 0, y: -60, ease: 'power2.in', duration: .14 }, .02)
    .to(['#openingScroll', '#openingDev'], { opacity: 0, duration: .08 }, .02)
    .to('.opening__shade', { opacity: .35, duration: .3 }, .1)
    .fromTo('#openingOutro', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .1 }, .84)
    .to('.opening__shade', { opacity: 1, duration: .1 }, .84);

  /* ---------- 02 Explore residences ---------- */
  const beams = $('#exploreBeams'), index = $('#exploreIndex'), current = $('#exploreCurrent');
  const minSuper = h => Math.min(...h.units.map(u => u.superA));
  S.houses.forEach((h, i) => {
    const b = document.createElement('button');
    b.className = 'beam'; b.style.left = `${h.x}%`; b.dataset.label = `Open ${h.name}`;
    b.setAttribute('aria-label', `Open ${h.name}`);
    b.addEventListener('mouseenter', () => setHouse(i));
    b.addEventListener('focus', () => setHouse(i));
    b.addEventListener('click', () => openPlan(i));
    beams.appendChild(b);

    const li = document.createElement('li');
    li.innerHTML = `<button type="button">${h.name.replace(' House', '')}</button>`;
    const btn = li.firstChild;
    btn.addEventListener('mouseenter', () => setHouse(i));
    btn.addEventListener('focus', () => setHouse(i));
    btn.addEventListener('click', () => { setHouse(i); openPlan(i); });
    index.appendChild(li);
  });
  let activeHouse = -1;
  function setHouse(i) {
    if (i === activeHouse) return;
    activeHouse = i;
    const h = S.houses[i];
    $$('.beam', beams).forEach((b, j) => b.classList.toggle('is-active', j === i));
    $$('button', index).forEach((b, j) => b.classList.toggle('is-active', j === i));
    current.innerHTML = `<p class="explore__house">${h.name}</p><p class="explore__meta">${h.type} · Super area from ${fmt(minSuper(h))} sq.ft.</p>`;
    current.classList.remove('is-swap'); void current.offsetWidth; current.classList.add('is-swap');
  }
  setHouse(0);

  /* plan overlay */
  const plan = $('#plan'), planImg = $('#planImg'), planTabs = $('#planTabs');
  let planHouse = 0, lastFocus = null;
  function renderUnit(h, u) {
    $$('button', planTabs).forEach(b => b.classList.toggle('is-active', b.dataset.k === String(u)));
    const isPlate = u === 'plate';
    const unit = isPlate ? null : h.units[u];
    $('#planEyebrow').textContent = isPlate ? 'Typical floor plate · Towers 1 & 3' : 'Typical unit plan';
    planImg.src = isPlate ? 'assets/img/floorplate-t1-3.jpg' : `assets/img/${unit.img}.jpg`;
    planImg.alt = isPlate ? 'Typical floor plate with two 5+1 BHK residences' : `${h.name} ${unit.label} floor plan`;
    $('#planCaption').textContent = isPlate ? 'Two residences per floor · lift lobby, stretcher lift & private foyers' : `${h.name} · ${unit.label}`;
    const areas = $('#planAreas');
    areas.innerHTML = isPlate ? '' : [['Carpet', unit.carpet], ['Covered', unit.covered], ['Super', unit.superA]]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${fmt(v)}<small>sq.ft.</small></dd></div>`).join('');
    areas.hidden = isPlate;
    const old = $('.plan__note', plan); old && old.remove();
    if (unit?.note) areas.insertAdjacentHTML('afterend', `<p class="plan__note">${unit.note}</p>`);
  }
  function openPlan(i) {
    planHouse = i; lastFocus = document.activeElement;
    const h = S.houses[i];
    $('#planTitle').textContent = h.name;
    $('#planType').textContent = h.type;
    const tabs = h.units.map((u, k) => `<button type="button" data-k="${k}">${u.label}</button>`);
    if (h.floorplate) tabs.push('<button type="button" data-k="plate">Floor plate</button>');
    planTabs.innerHTML = tabs.length > 1 ? tabs.join('') : '';
    $$('button', planTabs).forEach(b => b.addEventListener('click', () => renderUnit(h, b.dataset.k === 'plate' ? 'plate' : +b.dataset.k)));
    renderUnit(h, 0);
    plan.classList.add('is-open'); plan.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    $('#planBack').focus();
  }
  function closePlan() {
    if (!plan.classList.contains('is-open')) return;
    plan.classList.remove('is-open'); plan.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  }
  $('#planBack').addEventListener('click', closePlan);
  $('#planEnquire').addEventListener('click', () => {
    const t = S.houses[planHouse].type;
    const sel = $('#interestSelect');
    const m = [...sel.options].find(o => t.includes(o.value));
    if (m) sel.value = m.value;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closePlan(); closeMenu(); } });

  gsap.from('.explore__panel > *', {
    opacity: 0, y: 30, stagger: .08, duration: 1.1, ease: 'expo.out',
    scrollTrigger: { trigger: '#explore', start: 'top 60%' }
  });

  /* ---------- 03 Entrance scrub ---------- */
  const entState = { f: 0 };
  gsap.timeline({
    scrollTrigger: { trigger: '#entrance', start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.6 }
  })
    .to(entState, { f: entrance.count - 1, ease: 'none', duration: .82, onUpdate: () => entrance.draw(entState.f) }, 0)
    .to('#entranceCue', { opacity: 0, duration: .08 }, .05)
    .fromTo('#entranceCaption', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .12 }, .8)
    .to({}, { duration: .08 });

  /* ---------- Header theme & visibility ---------- */
  const header = $('#header');
  $$('[data-theme]').forEach(sec => ScrollTrigger.create({
    trigger: sec, start: 'top 40px', end: 'bottom 40px',
    onToggle: self => self.isActive && header.classList.toggle('is-light', sec.dataset.theme === 'light')
  }));
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      header.classList.toggle('is-hidden', y > lastY && y > 600 && !document.body.classList.contains('menu-open'));
      lastY = y;
    }
  });

  /* ---------- Menu ---------- */
  const menu = $('#menu'), menuBtn = $('#menuOpen');
  function openMenu() { menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); lenis && lenis.stop(); }
  function closeMenu() { if (!menu.classList.contains('is-open')) return; menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); lenis && lenis.start(); }
  menuBtn.addEventListener('click', openMenu);
  $('#menuClose').addEventListener('click', closeMenu);

  /* ---------- Word reveals ---------- */
  $$('.reveal-words').forEach(el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el);
    if (reduced) return;
    gsap.to($$('.w > span', el), {
      y: 0, duration: 1.3, ease: 'expo.out', stagger: .05,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  if (!reduced) {
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08 })
    });
    $$('.reveal-img').forEach(el => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } })
        .to(el, { clipPath: 'inset(0% 0 0% 0)', duration: 1.5, ease: 'expo.out' }, 0)
        .to($('img', el), { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
    });
    gsap.to('.arch__bg', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.arch', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------- 05 Inside: horizontal chapters ---------- */
  ScrollTrigger.matchMedia({
    '(min-width: 981px)': () => {
      const track = $('#insideTrack');
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '#inside', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: reduced ? true : 0.8,
          invalidateOnRefresh: true,
          onUpdate: self => { $('#insideBar').style.width = `${self.progress * 100}%`; }
        }
      });
      $$('.chapter', track).forEach(ch => {
        gsap.to($('img', ch), { scale: 1, ease: 'none', scrollTrigger: { trigger: ch, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        gsap.from($('.chapter__title', ch), { xPercent: 30, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: ch, containerAnimation: tween, start: 'left 85%', end: 'left 35%', scrub: true } });
      });
    }
  });

  /* ---------- 06 Amenities sticky list ---------- */
  const amenList = $('#amenList'), amenFrame = $('#amenFrame');
  $('#amenTotal').textContent = String(S.amenities.length).padStart(2, '0');
  S.amenities.forEach((a, i) => {
    const n = String(i + 1).padStart(2, '0');
    amenList.insertAdjacentHTML('beforeend', `<li><span class="n">${n}</span><h3>${a.name}</h3><span class="tag">${a.tag}</span><p>${a.line}</p></li>`);
    const img = new Image(); img.src = `assets/img/${a.img}.jpg`; img.alt = a.name; img.loading = 'lazy';
    amenFrame.appendChild(img);
  });
  const amenItems = $$('li', amenList), amenImgs = $$('img', amenFrame);
  const setAmen = i => {
    amenItems.forEach((li, j) => li.classList.toggle('is-on', j === i));
    amenImgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
    $('#amenNum').textContent = String(i + 1).padStart(2, '0');
  };
  setAmen(0);
  amenItems.forEach((li, i) => {
    ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 55%', onToggle: s => s.isActive && setAmen(i) });
    li.addEventListener('mouseenter', () => setAmen(i));
  });
  $('#amenMore').innerHTML = S.moreAmenities.map(a => `<li>${a}</li>`).join('');

  /* ---------- Legend & specs ---------- */
  $('#legend').innerHTML = S.legend.map((l, i) => `<li><b>${i + 1}</b>${l}</li>`).join('');
  $('#specList').innerHTML = S.specs.map(([k, v]) => `<div class="reveal"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  if (!reduced) ScrollTrigger.batch('#specList .reveal', { start: 'top 92%', onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .05 }) });

  /* ---------- Stats count-up ---------- */
  $$('.stats b').forEach(b => {
    const v = b.dataset.count;
    if (!/^\d+$/.test(v) || reduced) return;
    const o = { n: 0 };
    ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () =>
      gsap.to(o, { n: +v, duration: 2, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.n); } }) });
    b.textContent = '0';
  });

  /* ---------- WhatsApp & form ---------- */
  if (S.whatsapp) {
    const wa = $('#waBtn');
    wa.href = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent('Hello GB Realty, I would like to know more about Opus One.')}`;
    wa.hidden = false;
  }
  $('#enquireForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ['name', 'phone'].forEach(n => {
      const valid = f[n].value.trim().length > 1;
      f[n].closest('.field').classList.toggle('is-invalid', !valid); ok = ok && valid;
    });
    if (!ok) return;
    const body = `Name: ${f.name.value}\nPhone: ${f.phone.value}\nEmail: ${f.email.value}\nInterested in: ${f.interest.value}\n\n${f.message.value}`;
    if (S.enquiryEmail) location.href = `mailto:${S.enquiryEmail}?subject=${encodeURIComponent('Opus One enquiry')}&body=${encodeURIComponent(body)}`;
    else if (S.whatsapp) window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent('Opus One enquiry\n' + body)}`, '_blank', 'noopener');
    $('#formOk').hidden = false; f.reset();
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
