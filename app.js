(() => {
  'use strict';
  const {
    I18N, SYS_PAGES, CONFLICTS, PRM_SECTIONS, SYS_PRESETS, PRM_PRESETS,
    IMG_PAGES, IMG_PRESETS, VER_PAGES, VER_PRESETS,
  } = window.PROMPT_DATA;

  /* ------------------------------------------------------------------ helpers */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function h(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  }

  const ICONS = {
    x: '<path d="M4 4l8 8M12 4l-8 8"/>',
    dots: '<circle cx="3.5" cy="8" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="12.5" cy="8" r="1.2"/>',
    chev: '<path d="M4 10l4-4 4 4"/>',
    plus: '<path d="M8 3v10M3 8h10"/>',
    copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.8"/><path d="M10.5 3.6A1.6 1.6 0 0 0 8.9 2H3.6A1.6 1.6 0 0 0 2 3.6v5.3A1.6 1.6 0 0 0 3.6 10.5"/>',
  };
  function icon(name, size = 16) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 16 16');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('class', 'ico');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICONS[name];
    return s;
  }
  const CHECK_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 6.4l2.5 2.5 5-5.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* -------------------------------------------------------------------- state */
  const KEY = 'promptly.v1';

  const defaults = () => ({
    lang: 'ro',
    mode: 'system',
    fmt: 'md',
    imgFmt: 'prose',
    verFmt: 'list',
    sys: {
      role: '', custom: '',
      picks: { nopre: 1, nosum: 1, blunt: 1, nofluff: 1 },
      single: { emoji: 'none' },
    },
    prm: {
      on: { role: 1, context: 1, task: 1, format: 1, done: 1 },
      text: {}, chips: {}, examples: [],
    },
    img: { subject: '', labels: '', data: '', title: '', brand: '', avoid: '', single: {}, picks: {} },
    ver: { picks: {} },
  });

  const b64 = {
    enc(o) {
      const bytes = new TextEncoder().encode(JSON.stringify(o));
      let s = '';
      bytes.forEach(b => (s += String.fromCharCode(b)));
      return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    dec(t) {
      const s = atob(t.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0))));
    },
  };

  function load() {
    const d = defaults();
    let raw = null;
    if (location.hash.startsWith('#v1.')) {
      try { raw = b64.dec(location.hash.slice(4)); } catch { /* link invalid */ }
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!raw) { try { raw = JSON.parse(localStorage.getItem(KEY)); } catch { /* storage unavailable */ } }
    if (!raw || typeof raw !== 'object') return d;
    const s = { ...d, ...raw, sys: { ...d.sys, ...raw.sys }, prm: { ...d.prm, ...raw.prm }, img: { ...d.img, ...raw.img }, ver: { ...d.ver, ...raw.ver } };
    if (!['system', 'prompt', 'image', 'verify'].includes(s.mode)) s.mode = 'system';
    return s;
  }

  let S = load();
  let active = null;
  let snapshot = null;
  let saveTimer;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ } }, 150);
  };

  const ui = k => I18N[S.lang][k];
  const T = o => (o && o[S.lang]) || '';

  const PAGES = { system: SYS_PAGES, image: IMG_PAGES, verify: VER_PAGES };
  const store = (m = S.mode) => ({ system: S.sys, image: S.img, verify: S.ver })[m];
  const pagesNow = () => PAGES[S.mode];

  /* ------------------------------------------------------------ prompt output */
  const lines = txt => (txt || '').split('\n').map(x => x.trim().replace(/^[-*•]\s+/, '')).filter(Boolean);
  const bullets = arr => arr.map(x => '- ' + x).join('\n');
  const clean = s => (s || '').trim().replace(/[.\s]+$/, '');

  function roleSentence(v) {
    v = (v || '').trim();
    if (!v) return '';
    if (/^(ești|esti|you are|act as|acționează|actioneaza)(?![\p{L}])/iu.test(v)) return /[.!?]$/.test(v) ? v : v + '.';
    return (S.lang === 'ro' ? 'Ești ' : 'You are ') + v.replace(/\.+$/, '') + '.';
  }

  function assemble(secs) {
    const fmt = S.fmt;
    return secs.filter(s => s.body).map(s => {
      if (fmt === 'xml') return `<${s.tag}>\n${s.body}\n</${s.tag}>`;
      if (s.bare) return s.body;
      if (fmt === 'md') return `## ${s.title}\n${s.body}`;
      return `${s.title}:\n${s.body}`;
    }).join('\n\n');
  }

  /* linii de text alese dintr-un grup (multi / single / phrases) */
  function gLines(g, st) {
    if (g.kind === 'multi') return g.items.filter(it => st.picks[it.id]).map(it => T(it.line));
    if (g.kind === 'single') {
      const it = g.items.find(i => i.id === st.single[g.field || g.id]);
      return it ? [T(it.line)] : [];
    }
    if (g.kind === 'phrases' && !g.copy) return g.items.filter(it => st.picks[it.id]).map(it => T(it.text));
    return [];
  }

  function buildSystem() {
    return assemble(SYS_PAGES.map(p => {
      const ls = p.groups.flatMap(g => (g.kind === 'lines' ? lines(S.sys.custom) : gLines(g, S.sys)));
      if (p.id === 'role') {
        const r = roleSentence(S.sys.role);
        if (r) ls.unshift(r);
        return { tag: p.tag, title: T(p.out), body: ls.join(' '), bare: true };
      }
      return { tag: p.tag, title: T(p.out), body: bullets(ls) };
    }));
  }

  function chipLines(sec) {
    const picked = S.prm.chips[sec.id] || [];
    return sec.chips.filter(c => picked.includes(c.id)).map(c => T(c.line));
  }

  function promptBody(sec) {
    const p = S.prm, txt = (p.text[sec.id] || '').trim();
    if (sec.kind === 'line') return roleSentence(txt);
    if (sec.kind === 'area') return txt;
    if (sec.kind === 'examples') {
      const ex = p.examples.filter(e => e.i.trim() || e.o.trim());
      if (S.fmt === 'xml') return ex.map(e => `<example>\n<input>${e.i.trim()}</input>\n<output>${e.o.trim()}</output>\n</example>`).join('\n');
      const b = S.fmt === 'md' ? '**' : '';
      return ex.map((e, n) => `${b}${ui('example')} ${n + 1}${b}\n${ui('inLabel')}: ${e.i.trim()}\n${ui('outLabel')}: ${e.o.trim()}`).join('\n\n');
    }
    const out = [];
    if (sec.audience) {
      const aud = (p.text.audience || '').trim();
      if (aud) out.push(`${ui('audience')}: ${aud}`);
      const words = chipLines(sec);
      if (words.length) out.push(`${ui('toneWord')}: ${words.join(', ')}`);
    } else out.push(...chipLines(sec));
    out.push(...lines(txt));
    return bullets(out);
  }

  function buildPrompt() {
    const secs = [];
    for (const sec of PRM_SECTIONS) {
      if (!S.prm.on[sec.id]) continue;
      secs.push({ tag: sec.tag, title: T(sec.out), body: promptBody(sec), bare: sec.id === 'role' });
    }
    return assemble(secs);
  }

  function buildImage() {
    const m = S.img, by = {};
    for (const p of IMG_PAGES) for (const g of p.groups) {
      const k = g.field || g.id;
      (by[k] = by[k] || []).push(...gLines(g, m));
    }
    const v = k => by[k] || [];
    const subject = clean(m.subject), type = v('vtype')[0];
    let main = '';
    if (S.lang === 'ro') main = type || subject ? `Creează ${type || 'un vizual de business'}${subject ? ' care arată ' + subject : ''}.` : '';
    else main = type || subject ? `Create ${type || 'a business visual'}${subject ? ' showing ' + subject : ''}.` : '';

    const e = [];
    const add = (label, arr, sep = ', ') => { arr = arr.filter(Boolean); if (arr.length) e.push([label, arr.join(sep)]); };
    if (m.title.trim()) e.push([ui('lbTitle'), `"${m.title.trim()}"`]);
    add(ui('lbLabels'), lines(m.labels), '; ');
    add(ui('lbData'), lines(m.data), '; ');
    add(ui('lbLayout'), [...v('flow'), ...v('density'), ...v('elements')]);
    add(ui('lbStyle'), v('vstyle'));
    add(ui('lbPalette'), [...v('vpalette'), m.brand.trim() && `${ui('lbBrand')}: ${m.brand.trim()}`]);
    add(ui('lbTextRules'), v('txtrules'), '; ');
    add(ui('lbRatio'), v('ratio'));
    add(ui('lbUse'), v('use'));
    add(ui('lbBg'), v('bg'));
    add(ui('lbDeliv'), v('deliv'));
    add(ui('lbAvoid'), [...v('avoid'), ...lines(m.avoid).map(clean)]);

    if (S.imgFmt === 'list') return [main, bullets(e.map(([l, x]) => `${l}: ${x}`))].filter(Boolean).join('\n');
    return [main, ...e.map(([l, x]) => `${l}: ${x.replace(/[.\s]+$/, '')}.`)].filter(Boolean).join(' ');
  }

  function buildVerify() {
    const ls = VER_PAGES.flatMap(p => p.groups.flatMap(g => gLines(g, S.ver)));
    if (!ls.length) return '';
    if (S.verFmt === 'text') return ls.join(' ');
    if (S.verFmt === 'xml') return `<verification_rules>\n${bullets(ls)}\n</verification_rules>`;
    return bullets(ls);
  }

  const currentText = () => ({ system: buildSystem, prompt: buildPrompt, image: buildImage, verify: buildVerify })[S.mode]();

  /* -------------------------------------------------------------------- hints */
  function refOn(ref) {
    if (ref.includes('=')) { const [g, id] = ref.split('='); return S.sys.single[g] === id; }
    return !!S.sys.picks[ref];
  }
  function refLabel(ref) {
    const id = ref.includes('=') ? ref.split('=')[1] : ref;
    for (const p of SYS_PAGES) for (const g of p.groups) for (const it of g.items || []) if (it.id === id) return T(it.label);
    return id;
  }

  function currentHint() {
    if (S.mode === 'system') {
      for (const [a, b] of CONFLICTS) if (refOn(a) && refOn(b)) return { warn: true, text: `${ui('conflict')}: ${refLabel(a)} ${ui('and')} ${refLabel(b)}` };
      return null;
    }
    if (S.mode === 'image') {
      if (!S.img.subject.trim()) return { warn: false, text: ui('hintImgSubject') };
      if (!S.img.single.vtype) return { warn: false, text: ui('hintImgStyle') };
      return { warn: false, text: ui('hintImgTip') };
    }
    if (S.mode === 'verify') return { warn: false, text: ui('hintVerify') };
    const p = S.prm, filled = id => {
      const sec = PRM_SECTIONS.find(s => s.id === id);
      return p.on[id] && !!promptBody(sec);
    };
    if (!filled('task')) return { warn: false, text: ui('hintTask') };
    if (!filled('done')) return { warn: false, text: ui('hintDone') };
    if (!filled('delivery')) return { warn: false, text: ui('hintDelivery') };
    return null;
  }

  /* ----------------------------------------------------------------- preview */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function highlight(t) {
    let o = esc(t)
      .replace(/^(&lt;\/?[a-z_]+&gt;)$/gm, '<span class="tg">$1</span>')
      .replace(/^(## .*)$/gm, '<span class="hd">$1</span>')
      .replace(/(\{\{[^}\n]+\}\})/g, '<span class="vr">$1</span>');
    if (S.mode === 'verify') o = o.replace(/(\[[^\]\n]+\])/g, '<span class="vr">$1</span>');
    return o;
  }

  function updatePreview() {
    const text = currentText();
    const pv = $('#preview');
    $('#out').innerHTML = highlight(text);
    pv.classList.toggle('has-text', !!text);
    $('#copy').disabled = !text;
    $('#count').textContent = text ? `${text.length} ${ui('chars')} · ~${Math.ceil(text.length / 3.7)} ${ui('tokens')}` : '';
    const hint = text ? currentHint() : null;
    const hn = $('#hint');
    hn.textContent = hint ? hint.text : '';
    hn.classList.toggle('warn', !!(hint && hint.warn));
  }

  /* --------------------------------------------------------------------- nav */
  function pageCount(p, st) {
    let n = 0;
    for (const g of p.groups) {
      if (g.kind === 'multi') g.items.forEach(i => { if (st.picks[i.id]) n++; });
      else if (g.kind === 'single') { if (g.items.some(i => i.id === st.single[g.field || g.id])) n++; }
      else if (g.kind === 'phrases') { if (!g.copy) g.items.forEach(i => { if (st.picks[i.id]) n++; }); }
      else if ((st[g.key] || '').trim()) n++;
    }
    return n;
  }

  function renderNav() {
    const nav = $('#nav');
    nav.replaceChildren();
    $('#sidecap').textContent = ui('components');
    if (S.mode !== 'prompt') {
      pagesNow().forEach(p => nav.append(h('div', { class: 'nav-item', 'data-id': p.id },
        h('button', { class: 'nl', type: 'button', onclick: () => { active = p.id; goTo(p.id); updateNav(); } }, T(p.label)),
        h('span', { class: 'nb' }))));
    } else {
      PRM_SECTIONS.forEach(sec => {
        const chk = h('button', { class: 'check', type: 'button', 'aria-label': T(sec.label), onclick: () => toggleSection(sec.id) });
        chk.innerHTML = CHECK_SVG;
        nav.append(h('div', { class: 'nav-item prm', 'data-id': sec.id },
          chk,
          h('button', { class: 'nl', type: 'button', onclick: () => (S.prm.on[sec.id] ? goTo(sec.id) : toggleSection(sec.id, true)) }, T(sec.label))));
      });
    }
    updateNav();
  }

  function updateNav() {
    $$('.nav-item').forEach(n => {
      const id = n.dataset.id;
      if (S.mode !== 'prompt') {
        const c = pageCount(pagesNow().find(p => p.id === id), store());
        $('.nb', n).textContent = c || '';
        n.classList.toggle('active', id === active);
      } else {
        const on = !!S.prm.on[id];
        n.classList.toggle('on', on);
        n.classList.toggle('active', on && id === active);
        $('.check', n).setAttribute('aria-pressed', String(on));
      }
    });
  }

  function goTo(id) {
    const m = $('#main'), t = $('#sec-' + id);
    if (!t) return;
    m.scrollTo({ top: m.scrollTop + t.getBoundingClientRect().top - m.getBoundingClientRect().top - 16 });
  }

  let spyQueued = false;
  function spy() {
    if (spyQueued) return;
    spyQueued = true;
    requestAnimationFrame(() => {
      spyQueued = false;
      const m = $('#main'), els = $$('[data-id].sec, [data-id].card', m);
      if (!els.length) return;
      const top = m.getBoundingClientRect().top + 48;
      let cur = els[0].dataset.id;
      for (const e of els) if (e.getBoundingClientRect().top <= top) cur = e.dataset.id;
      if (m.scrollTop + m.clientHeight >= m.scrollHeight - 4) cur = els[els.length - 1].dataset.id;
      if (cur !== active) { active = cur; updateNav(); }
    });
  }

  /* ------------------------------------------------------------- field blocks */
  function refresh() { updatePreview(); updateNav(); save(); }

  function autosize(t) {
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 2 + 'px';
  }

  function bind(el, obj, key) {
    el.value = obj[key] || '';
    el.addEventListener('input', () => { obj[key] = el.value; if (el.tagName === 'TEXTAREA') autosize(el); refresh(); });
    return el;
  }

  const input = (obj, key, ph) => bind(h('input', { class: 'field', type: 'text', placeholder: ph, autocomplete: 'off' }), obj, key);
  const area = (obj, key, ph, rows = 2) => bind(h('textarea', { class: 'field', placeholder: ph, rows }), obj, key);

  function chip(label, pressed, onClick, cls = '', data = null) {
    const b = h('button', { type: 'button', class: ('chip ' + cls).trim(), 'aria-pressed': pressed == null ? null : String(!!pressed) }, label);
    if (data) Object.assign(b.dataset, data);
    b.addEventListener('click', () => onClick(b));
    return b;
  }

  function suggestChips(items, el, obj, key) {
    return h('div', { class: 'chips tight' }, items.map(x => chip(x, null, () => {
      el.value = x; obj[key] = x;
      if (el.tagName === 'TEXTAREA') autosize(el);
      refresh(); el.focus({ preventScroll: true });
    }, 'soft')));
  }

  /* --------------------------------------------- pagini cu grupuri (3 tab-uri) */
  async function copyPhrase(txt) {
    await copyText(txt);
    toast(ui('copied'));
  }

  function phraseRows(g, st) {
    const rows = h('div', { class: 'rows' });
    g.items.forEach(it => {
      const txt = T(it.text);
      if (g.copy) {
        rows.append(h('div', { class: 'row' },
          h('button', { class: 'rowmain', type: 'button', onclick: () => copyPhrase(txt) },
            h('span', { class: 'rt' }, txt),
            h('span', { class: 'rc', 'aria-hidden': 'true' }, icon('copy', 15)))));
        return;
      }
      const chk = h('span', { class: 'check' });
      chk.innerHTML = CHECK_SVG;
      const main = h('button', { class: 'rowmain', type: 'button', 'aria-pressed': String(!!st.picks[it.id]) }, chk, h('span', { class: 'rt' }, txt));
      const row = h('div', { class: 'row' + (st.picks[it.id] ? ' on' : '') }, main,
        h('button', { class: 'icon-btn sm rcopy', type: 'button', title: ui('copyOne'), 'aria-label': ui('copyOne'), onclick: () => copyPhrase(txt) }, icon('copy', 15)));
      main.addEventListener('click', () => {
        st.picks[it.id] = st.picks[it.id] ? 0 : 1;
        row.classList.toggle('on', !!st.picks[it.id]);
        main.setAttribute('aria-pressed', String(!!st.picks[it.id]));
        refresh();
      });
      rows.append(row);
    });
    return rows;
  }

  function pageGroup(g, st) {
    const box = h('div', { class: 'group' });
    if (g.caption) box.append(h('div', { class: 'cap' }, T(g.caption)));
    if (g.kind === 'multi') {
      box.append(h('div', { class: 'chips' }, g.items.map(it => chip(T(it.label), st.picks[it.id], b => {
        st.picks[it.id] = st.picks[it.id] ? 0 : 1;
        b.setAttribute('aria-pressed', String(!!st.picks[it.id]));
        refresh();
      }))));
    } else if (g.kind === 'single') {
      const key = g.field || g.id;
      box.append(h('div', { class: 'chips' }, g.items.map(it => chip(T(it.label), st.single[key] === it.id, () => {
        st.single[key] = st.single[key] === it.id ? null : it.id;
        $$(`.chip[data-sk="${key}"]`, $('#content')).forEach(c => c.setAttribute('aria-pressed', String(st.single[key] === c.dataset.id)));
        refresh();
      }, '', { sk: key, id: it.id }))));
    } else if (g.kind === 'text') {
      const inp = input(st, g.key, T(g.ph));
      box.append(inp);
      if (g.suggest) box.append(suggestChips(T(g.suggest), inp, st, g.key));
    } else if (g.kind === 'area' || g.kind === 'lines') {
      const ta = area(st, g.key, T(g.ph), g.rows || (g.kind === 'lines' ? 4 : 3));
      box.append(ta);
      if (g.suggest) box.append(suggestChips(T(g.suggest), ta, st, g.key));
    } else if (g.kind === 'phrases') {
      box.append(phraseRows(g, st));
    }
    return box;
  }

  function renderPagesMain(root) {
    const st = store();
    pagesNow().forEach(p => {
      const sec = h('section', { class: 'sec', id: 'sec-' + p.id, 'data-id': p.id }, h('h2', {}, T(p.label)));
      p.groups.forEach(g => sec.append(pageGroup(g, st)));
      root.append(sec);
    });
  }

  /* ------------------------------------------------------------ prompt editor */
  function insertVar(el, key) {
    const v = `{{${ui('varName')}}}`;
    const start = el.selectionStart ?? el.value.length, end = el.selectionEnd ?? start;
    el.setRangeText(v, start, end, 'end');
    el.setSelectionRange(start + 2, start + 2 + ui('varName').length);
    S.prm.text[key] = el.value;
    autosize(el);
    refresh();
    el.focus({ preventScroll: true });
  }

  function exampleRow(ex, idx, total, redraw) {
    const mk = (label, key) => {
      const t = bind(h('textarea', { class: 'field', rows: 1 }), ex, key);
      return [h('div', { class: 'lbl' }, label), t];
    };
    return h('div', { class: 'ex' },
      h('div', { class: 'ex-head' }, h('span', {}, `${ui('example')} ${idx + 1}`),
        total > 1 && h('button', { class: 'link', type: 'button', onclick: () => { S.prm.examples.splice(idx, 1); redraw(); refresh(); } }, ui('remove'))),
      mk(ui('inLabel'), 'i'), mk(ui('outLabel'), 'o'));
  }

  function card(sec) {
    const p = S.prm, id = sec.id;
    const c = h('section', { class: 'card', id: 'sec-' + id, 'data-id': id },
      h('header', {}, h('h3', {}, T(sec.label)),
        h('button', { class: 'icon-btn sm', type: 'button', title: ui('remove'), 'aria-label': ui('remove'), onclick: () => toggleSection(id, false) }, icon('x', 14))));

    if (sec.kind === 'line') {
      const inp = input(p.text, id, T(sec.ph));
      c.append(inp, suggestChips(T(sec.suggest), inp, p.text, id));
    } else if (sec.kind === 'area') {
      const ta = area(p.text, id, T(sec.ph), 3);
      c.append(ta);
      if (sec.vars) c.append(h('div', { class: 'card-tools' }, h('button', { class: 'chip soft', type: 'button', onclick: () => insertVar(ta, id) }, `{{${ui('varName')}}}`)));
    } else if (sec.kind === 'examples') {
      if (!p.examples.length) p.examples.push({ i: '', o: '' });
      const list = h('div', { class: 'ex-list' });
      const redraw = () => {
        list.replaceChildren(...p.examples.map((ex, n) => exampleRow(ex, n, p.examples.length, redraw)));
        $$('textarea', list).forEach(autosize);
      };
      redraw();
      c.append(list, h('button', { class: 'btn soft', type: 'button', onclick: () => { p.examples.push({ i: '', o: '' }); redraw(); refresh(); } }, icon('plus', 14), ui('addExample')));
    } else {
      if (sec.audience) c.append(input(p.text, 'audience', T(sec.audiencePh)));
      const picked = (p.chips[id] = p.chips[id] || []);
      c.append(h('div', { class: 'chips' }, sec.chips.map(ch => chip(T(ch.label), picked.includes(ch.id), b => {
        const i = picked.indexOf(ch.id);
        if (i >= 0) picked.splice(i, 1); else picked.push(ch.id);
        b.setAttribute('aria-pressed', String(i < 0));
        refresh();
      }))));
      c.append(area(p.text, id, T(sec.ph), 1));
    }
    return c;
  }

  function renderPromptMain(root) {
    const on = PRM_SECTIONS.filter(s => S.prm.on[s.id]);
    if (!on.length) root.append(h('div', { class: 'empty-main' }, ui('emptyMain')));
    on.forEach(sec => root.append(card(sec)));
  }

  function toggleSection(id, force) {
    const on = force === undefined ? !S.prm.on[id] : !!force;
    S.prm.on[id] = on ? 1 : 0;
    renderMain();
    refresh();
    if (on) {
      goTo(id);
      active = id;
      updateNav();
      const f = $('#sec-' + id + ' input, #sec-' + id + ' textarea');
      if (f && !matchMedia('(pointer: coarse)').matches) f.focus({ preventScroll: true });
    }
  }

  function renderMain() {
    const m = $('#main'), keep = m.scrollTop, root = $('#content');
    root.replaceChildren();
    if (S.mode === 'prompt') renderPromptMain(root); else renderPagesMain(root);
    $$('textarea', root).forEach(autosize);
    m.style.scrollBehavior = 'auto';
    m.scrollTop = keep;
    m.style.scrollBehavior = '';
    spy();
  }

  /* ------------------------------------------------------------------- chrome */
  function seg(opts, value, onPick, cls = '') {
    return h('div', { class: ('seg ' + cls).trim(), role: 'radiogroup' },
      opts.map(([v, label]) => h('button', { type: 'button', role: 'radio', 'aria-checked': String(v === value), onclick: () => onPick(v) }, label)));
  }

  /* La schimbarea limbii, textele venite din presetări/sugestii se traduc; ce a scris userul rămâne. */
  function translateTexts(from, to) {
    const pairs = new Map();
    const addList = (a, b) => a.forEach((x, i) => pairs.set(x, b[i]));
    PRM_PRESETS.forEach(pr => Object.keys(pr.text[from]).forEach(k => pairs.set(pr.text[from][k], pr.text[to][k])));
    IMG_PRESETS.forEach(pr => Object.keys(pr.text[from]).forEach(k => pairs.set(pr.text[from][k], pr.text[to][k])));
    PRM_SECTIONS.forEach(s => s.suggest && addList(s.suggest[from], s.suggest[to]));
    SYS_PRESETS.forEach(pr => pairs.set(pr.role[from], pr.role[to]));
    [...SYS_PAGES, ...IMG_PAGES].forEach(p => p.groups.forEach(g => g.suggest && addList(g.suggest[from], g.suggest[to])));
    pairs.delete('');
    const sw = v => (pairs.has(v) ? pairs.get(v) : v);
    Object.keys(S.prm.text).forEach(k => { S.prm.text[k] = sw(S.prm.text[k]); });
    S.sys.role = sw(S.sys.role);
    ['subject', 'labels', 'data', 'title'].forEach(k => { S.img[k] = sw(S.img[k] || ''); });
  }

  function renderChrome() {
    document.documentElement.lang = S.lang;
    $('#modeseg').replaceChildren(seg(
      [['system', ui('system')], ['prompt', ui('prompt')], ['image', ui('image')], ['verify', ui('verify')]],
      S.mode,
      v => { S.mode = v; active = null; render(); $('#main').scrollTop = 0; }));
    const cur = $('#modeseg [aria-checked="true"]');
    if (cur) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
    $('#langseg').replaceChildren(seg([['ro', 'RO'], ['en', 'EN']], S.lang, v => { if (v === S.lang) return; translateTexts(S.lang, v); S.lang = v; render(); }, 'sm'));

    let opts, key;
    if (S.mode === 'image') { opts = [['prose', ui('prose')], ['list', ui('list')]]; key = 'imgFmt'; }
    else if (S.mode === 'verify') { opts = [['list', ui('list')], ['text', ui('para')], ['xml', ui('xml')]]; key = 'verFmt'; }
    else { opts = [['plain', ui('plain')], ['md', ui('md')], ['xml', ui('xml')]]; key = 'fmt'; }
    $('#fmtseg').replaceChildren(seg(opts, S[key], v => { S[key] = v; renderChrome(); refresh(); }, 'sm'));

    $('#presetsbtn').textContent = ui('presets');
    const mb = $('#morebtn'); mb.replaceChildren(icon('dots')); mb.title = ui('menu'); mb.setAttribute('aria-label', ui('menu'));
    $('#copy').textContent = ui('copy');
    const ex = $('#expand'); ex.replaceChildren(h('span', {}, ui('preview')), icon('chev', 14));
    ex.setAttribute('aria-label', ui('preview'));
    $('#empty').textContent = ui({ system: 'emptySys', prompt: 'emptyPrm', image: 'emptyImg', verify: 'emptyVer' }[S.mode]);
  }

  function render() {
    renderChrome();
    renderNav();
    renderMain();
    refresh();
  }

  /* ---------------------------------------------------------- toast / popover */
  let toastTimer;
  function toast(msg, action) {
    const t = $('#toast');
    t.replaceChildren(h('span', {}, msg));
    if (action) t.append(h('button', { type: 'button', onclick: () => { action.run(); t.classList.remove('show'); } }, action.label));
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), action ? 6000 : 1800);
  }

  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openPop(anchor, items) {
    if (pop && pop._a === anchor) return closePop();
    closePop();
    pop = h('div', { class: 'pop', role: 'menu' }, items.map(it => it === '-' ? h('hr') :
      h('button', { class: 'pop-item', type: 'button', role: 'menuitem', onclick: () => { closePop(); it.run(); } }, it.label)));
    pop._a = anchor;
    document.body.append(pop);
    const r = anchor.getBoundingClientRect();
    pop.style.top = r.bottom + 6 + 'px';
    pop.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
  }
  document.addEventListener('pointerdown', e => { if (pop && !pop.contains(e.target) && !e.target.closest('[data-pop]')) closePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });

  /* ------------------------------------------------------------------ actions */
  function takeSnapshot() { snapshot = JSON.stringify(S); }
  function undo() {
    if (!snapshot) return;
    S = JSON.parse(snapshot);
    snapshot = null;
    render();
  }

  const PRESETS = { system: SYS_PRESETS, prompt: PRM_PRESETS, image: IMG_PRESETS, verify: VER_PRESETS };
  const toPicks = list => Object.fromEntries((list || []).map(i => [i, 1]));

  function applyPreset(pr) {
    takeSnapshot();
    if (S.mode === 'system') {
      S.sys = { role: T(pr.role), custom: '', picks: toPicks(pr.picks), single: { ...pr.single } };
    } else if (S.mode === 'prompt') {
      S.prm = {
        on: toPicks(pr.on),
        text: { ...pr.text[S.lang] },
        chips: JSON.parse(JSON.stringify(pr.chips)),
        examples: [],
      };
    } else if (S.mode === 'image') {
      const t = pr.text[S.lang];
      S.img = { subject: t.subject || '', labels: t.labels || '', data: t.data || '', title: t.title || '', brand: '', avoid: '', single: { ...pr.single }, picks: toPicks(pr.picks) };
    } else {
      S.ver = { picks: toPicks(pr.picks) };
    }
    active = null;
    render();
    $('#main').scrollTo({ top: 0 });
    toast(ui('presetDone'), { label: ui('undo'), run: undo });
  }

  function resetCurrent() {
    takeSnapshot();
    const d = defaults();
    if (S.mode === 'system') S.sys = d.sys;
    else if (S.mode === 'prompt') S.prm = d.prm;
    else if (S.mode === 'image') S.img = d.img;
    else S.ver = d.ver;
    render();
    toast(ui('resetDone'), { label: ui('undo'), run: undo });
  }

  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch { /* fall through */ }
    const ta = h('textarea', { style: 'position:fixed;opacity:0' });
    ta.value = t;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* ignore */ }
    ta.remove();
    return ok;
  }

  let copyTimer;
  async function doCopy() {
    const text = currentText();
    if (!text) return;
    await copyText(text);
    const b = $('#copy');
    b.textContent = ui('copied');
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (b.textContent = ui('copy')), 1600);
  }

  function shareLink() {
    const url = location.href.split('#')[0] + '#v1.' + b64.enc(S);
    copyText(url).then(() => toast(ui('linkCopied')));
  }

  function download() {
    const blob = new Blob([currentText() + '\n'], { type: 'text/markdown' });
    const name = { system: 'system-prompt.md', prompt: 'prompt.md', image: 'diagram-prompt.md', verify: 'verification.md' }[S.mode];
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* --------------------------------------------------------------------- init */
  $('#copy').addEventListener('click', doCopy);
  $('#presetsbtn').addEventListener('click', e => {
    openPop(e.currentTarget, PRESETS[S.mode].map(pr => ({ label: T(pr.name), run: () => applyPreset(pr) })));
  });
  $('#morebtn').addEventListener('click', e => openPop(e.currentTarget, [
    { label: ui('copyLink'), run: shareLink },
    { label: ui('download'), run: download },
    '-',
    { label: ui('reset'), run: resetCurrent },
  ]));
  $('#expand').addEventListener('click', () => {
    const pv = $('#preview'), open = pv.classList.toggle('open');
    $('#expand').setAttribute('aria-expanded', String(open));
  });
  $('#main').addEventListener('scroll', spy, { passive: true });

  render();
})();
