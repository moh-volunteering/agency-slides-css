/* محرر عروض الوكالة: ترتيب الشرائح، تغيير القالب أو الشكل، تحريك العناصر. يعمل خارج معاينة معرفة (تبويب جديد أو ملف محفوظ). */
(function () {
  if (window.__agEd) return; window.__agEd = 1;
  var D = document;
  var GROUPS = [["section","section2"],["circles3","icons3"],["cards4","target4"],["timeline5","steps5"],["path6","wave6","puzzle6","arrows6","rows6","white6"],["icons4","quad4","bars4","rings4","puzzle4","monitor4","blocks4","curve4","numcards4","ribbons4","flags4","layers4","mountain4","chevrons4","funnel4","stack4","levels4"],["circles5","checks5","dots5","hex5","stairs5","colordots5","bars5"],["ring4","petals4"],["zigzag4","hexline4","pyramid4"],["venn3","bullseye3"],["matrix4","cycle4","orbit4"]];
  var SHAPES = {bcols:"أعمدة بنقاط", list:"قائمة مرقمة", chips:"بطاقات", cols:"أعمدة مرقمة", grid:"شبكة", points:"نقاط", nbcols:"مراحل بنقاط"};
  var NAMES = {"section":"فاصل","section2":"فاصل 2","circles3":"دوائر","icons3":"أيقونات","cards4":"بطاقات","target4":"هدف","timeline5":"خط زمني","steps5":"خطوات"};

  var css = D.createElement('style'); css.setAttribute('data-ed', '');
  css.textContent =
    '.ed-bar{position:absolute;top:7.8cqw;left:.8cqw;z-index:30;display:flex;gap:.4cqw;font:600 1.1cqw "MOMAH","Dubai",sans-serif;direction:rtl}' +
    '.ed-bar button,.ed-tool button{border:0;border-radius:.5cqw;padding:.45cqw .8cqw;background:#035C5F;color:#fff;cursor:pointer;font:inherit}' +
    '.ed-bar button:hover{background:#179995}.ed-bar .ed-del{background:#C0562F}' +
    '.ed-menu{position:absolute;top:10.6cqw;left:.8cqw;z-index:31;background:#fff;border:1px solid #CFE3E0;border-radius:.6cqw;box-shadow:0 .4cqw 1.6cqw rgba(0,0,0,.18);padding:.4cqw;display:grid;grid-template-columns:repeat(3,auto);gap:.3cqw;font:600 1.1cqw "MOMAH","Dubai",sans-serif;direction:rtl}' +
    '.ed-menu button{border:0;background:#F2F2F2;border-radius:.4cqw;padding:.45cqw .8cqw;cursor:pointer;font:inherit;color:#054947}.ed-menu button:hover{background:#CFE3E0}' +
    '.ed-tool{position:fixed;bottom:12px;left:12px;z-index:40;display:flex;gap:6px;font:600 14px "MOMAH","Dubai",sans-serif;direction:rtl}' +
    '.ed-tool button{font-size:14px;padding:8px 14px;border-radius:8px}.ed-tool .on{background:#E5A93D;color:#1A3C3A}' +
    'body.ed-move .slide *{cursor:move!important}body.ed-move .ed-hot{outline:.2cqw dashed #E5A93D;outline-offset:.2cqw}' +
    '.ed-sel{outline:.25cqw solid #E5A93D!important;outline-offset:.2cqw}' +
    '.ed-h{position:absolute;z-index:32;width:1.6cqw;height:1.6cqw;margin:-.8cqw;background:#E5A93D;border:.25cqw solid #fff;border-radius:50%;box-shadow:0 0 .4cqw rgba(0,0,0,.3)}' +
    '@media print{.ed-bar,.ed-menu,.ed-tool{display:none!important}}';
  D.head.appendChild(css);

  function slides() { return [].slice.call(D.querySelectorAll('section.slide')); }
  function tplOf(s) { var c = s.className.split(/\s+/); return c.filter(function (x) { return x && x !== 'slide'; })[0] || ''; }
  function shapeOf(s) { var a = s.querySelector('.a>*'); if (!a) return null; for (var k in SHAPES) if (a.classList.contains(k)) return a; return null; }
  function txt(e) { return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* استخراج العناصر من أي شكل أو قالب: [{t:عنوان, p:[نقاط]}] */
  function items(s) {
    var sh = shapeOf(s), out = [];
    if (sh) {
      if (sh.classList.contains('points')) { [].forEach.call(sh.children, function (c) { out.push({t: '', p: [txt(c)]}); }); return out; }
      [].forEach.call(sh.children, function (c) {
        var b = c.querySelector('b'); var t = txt(b);
        var ps = [].slice.call(c.querySelectorAll('p,span')).map(txt).filter(Boolean);
        if (!ps.length) { var cl = c.cloneNode(true); [].forEach.call(cl.querySelectorAll('i,b'), function (x) { x.remove(); }); var rest = txt(cl); ps = rest ? [rest] : []; }
        out.push({t: t, p: ps});
      });
      return out;
    }
    for (var i = 1; i <= 9; i++) {
      var tt = s.querySelector('.i' + i + '_title'), bb = s.querySelector('.i' + i + '_body');
      if (!tt && !bb) break; out.push({t: txt(tt), p: bb && txt(bb) ? [txt(bb)] : []});
    }
    return out;
  }
  function render(kind, its) {
    var h = '';
    its.forEach(function (it, n) {
      var t = esc(it.t), ps = it.p.map(esc);
      if (kind === 'bcols' || kind === 'nbcols') h += '<div' + (kind === 'nbcols' ? ' data-n="' + (n + 1) + '"' : '') + '>' + (t ? '<b>' + t + '</b>' : '') + ps.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>';
      else if (kind === 'list') h += '<div><i>' + (n + 1) + '</i><b>' + t + '</b><span>' + ps.join('، ') + '</span></div>';
      else if (kind === 'chips') h += '<div><b>' + t + '</b>' + ps.join('، ') + '</div>';
      else if (kind === 'cols') h += '<div data-n="' + (n + 1) + '"><b>' + t + '</b><span>' + ps.join('، ') + '</span></div>';
      else if (kind === 'grid') h += '<div><b>' + t + '</b><span>' + ps.join('، ') + '</span></div>';
      else if (kind === 'points') h += '<p>' + (t ? t + (ps.length ? ': ' : '') : '') + ps.join('، ') + '</p>';
    });
    return '<div class="' + kind + '">' + h + '</div>';
  }
  function toShape(s, kind) {
    var its = items(s); if (!its.length) return;
    var sh = shapeOf(s), tmp = D.createElement('div'); tmp.innerHTML = render(kind, its); var nw = tmp.firstChild;
    if (sh) { sh.replaceWith(nw); return; }
    var title = s.querySelector('.title'); var tHTML = title ? title.outerHTML : '<div class="title"></div>';
    s.className = 'slide blank';
    s.innerHTML = tHTML + '<div class="a"></div>'; s.querySelector('.a').appendChild(nw);
  }

  /* شريط كل شريحة */
  var menu = null;
  function closeMenu() { if (menu) { menu.remove(); menu = null; } }
  function bar(s) {
    var b = D.createElement('div'); b.className = 'ed-bar'; b.setAttribute('data-ed', ''); b.contentEditable = 'false';
    function btn(label, fn, cls) { var x = D.createElement('button'); x.textContent = label; if (cls) x.className = cls; x.onclick = function (e) { e.stopPropagation(); fn(x); }; b.appendChild(x); }
    btn('▲ رفع', function () { var p = s.previousElementSibling; while (p && !p.matches('section.slide')) p = p.previousElementSibling; if (p) p.before(s); s.scrollIntoView({block: 'center'}); });
    btn('▼ إنزال', function () { var n = s.nextElementSibling; while (n && !n.matches('section.slide')) n = n.nextElementSibling; if (n) n.after(s); s.scrollIntoView({block: 'center'}); });
    btn('⧉ نسخ', function () { var c = s.cloneNode(true); [].forEach.call(c.querySelectorAll('[data-ed]'), function (e) { e.remove(); }); s.after(c); });
    btn('الشكل ▾', function () {
      closeMenu(); menu = D.createElement('div'); menu.className = 'ed-menu'; menu.setAttribute('data-ed', ''); menu.contentEditable = 'false';
      var t = tplOf(s), opts = [];
      GROUPS.forEach(function (g) { if (g.indexOf(t) > -1) g.forEach(function (x) { if (x !== t) opts.push(['t', x]); }); });
      if (items(s).length) for (var k in SHAPES) { var cur = shapeOf(s); if (!cur || !cur.classList.contains(k)) opts.push(['s', k]); }
      if (!opts.length) { var no = D.createElement('button'); no.textContent = 'لا بدائل لهذه الشريحة'; menu.appendChild(no); }
      opts.forEach(function (o) {
        var x = D.createElement('button'); x.textContent = o[0] === 't' ? 'قالب ' + (NAMES[o[1]] || o[1]) : SHAPES[o[1]];
        x.onclick = function (e) { e.stopPropagation(); if (o[0] === 't') { s.classList.remove(t); s.classList.add(o[1]); } else toShape(s, o[1]); closeMenu(); };
        menu.appendChild(x);
      });
      s.appendChild(menu);
    });
    btn('✕ حذف', function () { if (confirm('حذف هذه الشريحة؟')) s.remove(); }, 'ed-del');
    return b;
  }
  D.addEventListener('mouseover', function (e) {
    var s = e.target.closest && e.target.closest('section.slide'); if (!s || s.querySelector(':scope>.ed-bar')) return;
    [].forEach.call(D.querySelectorAll('.ed-bar'), function (x) { if (x.parentNode !== s) x.remove(); });
    if (!s.contains(menu)) closeMenu();
    s.appendChild(bar(s));
  });
  D.addEventListener('click', function (e) { if (menu && !menu.contains(e.target)) closeMenu(); });

  /* وضع التحريك */
  var move = false, sel = null, drag = null;
  var tool = D.createElement('div'); tool.className = 'ed-tool'; tool.setAttribute('data-ed', ''); tool.contentEditable = 'false';
  var mb = D.createElement('button'); mb.textContent = '✥ تحريك العناصر'; tool.appendChild(mb);
  var zi = D.createElement('button'); zi.textContent = '＋ تكبير'; tool.appendChild(zi);
  var zo = D.createElement('button'); zo.textContent = '－ تصغير'; tool.appendChild(zo);
  var rb = D.createElement('button'); rb.textContent = '↺ إرجاع'; tool.appendChild(rb);
  D.body.appendChild(tool);
  function target(el, deep) {
    var s = el.closest('section.slide'); if (!s || el.closest('[data-ed]')) return null;
    if (deep) { var it = el.closest('.a>*>*'); if (it && s.contains(it)) return it; }
    var blk = el.closest('.a>*') || el.closest('.slide>div'); return blk && s.contains(blk) ? blk : null;
  }
  var hd = D.createElement('div'); hd.className = 'ed-h'; hd.setAttribute('data-ed', ''); hd.contentEditable = 'false';
  function absOf(el) { return getComputedStyle(el).position === 'absolute'; }
  function placeH() {
    if (!sel || !move) { hd.remove(); return; }
    var s = sel.closest('section.slide'), r = s.getBoundingClientRect(), q = sel.getBoundingClientRect();
    hd.style.top = (q.bottom - r.top) + 'px'; hd.style.left = ((absOf(sel) ? q.right : q.left) - r.left) + 'px';
    hd.style.cursor = absOf(sel) ? 'nwse-resize' : 'nesw-resize'; if (hd.parentNode !== s) s.appendChild(hd);
  }
  function setSel(x) { if (sel) sel.classList.remove('ed-sel'); sel = x; if (sel) sel.classList.add('ed-sel'); placeH(); }
  function scl(el) { return parseFloat(el.style.scale) || 1; }
  zi.onclick = function () { if (sel) { sel.style.scale = Math.min(2, scl(sel) + 0.05).toFixed(2); placeH(); } };
  zo.onclick = function () { if (sel) { sel.style.scale = Math.max(0.4, scl(sel) - 0.05).toFixed(2); placeH(); } };
  mb.onclick = function () {
    move = !move; mb.classList.toggle('on', move); D.body.classList.toggle('ed-move', move);
    D.body.contentEditable = move ? 'false' : 'true'; if (!move) setSel(null); placeH();
  };
  rb.onclick = function () { if (sel) { ['translate', 'scale', 'width', 'height', 'flex', 'minHeight', 'maxWidth'].forEach(function (k) { sel.style[k] = ''; }); if (!sel.getAttribute('style')) sel.removeAttribute('style'); placeH(); } };
  function cq(el) { return el.closest('section.slide').getBoundingClientRect().width / 100; }
  function cur(el) { var m = (el.style.translate || '').match(/(-?[\d.]+)cqw\s+(-?[\d.]+)cqw/); return m ? [+m[1], +m[2]] : [0, 0]; }
  D.addEventListener('mouseover', function (e) {
    if (!move) return; [].forEach.call(D.querySelectorAll('.ed-hot'), function (x) { x.classList.remove('ed-hot'); });
    var t = target(e.target, e.shiftKey); if (t) t.classList.add('ed-hot');
  });
  var rs = null;
  D.addEventListener('pointerdown', function (e) {
    if (move && e.target === hd && sel) {
      e.preventDefault(); var q = sel.getBoundingClientRect(), u = cq(sel), k = scl(sel);
      rs = {el: sel, x: e.clientX, y: e.clientY, w: q.width / k / u, h: q.height / k / u, u: u, k: k, dir: absOf(sel) ? 1 : -1}; return;
    }
    if (!move || e.button !== 0) return; var t = target(e.target, e.shiftKey); if (!t) return;
    e.preventDefault(); setSel(t); var c = cur(t); drag = {el: t, x: e.clientX, y: e.clientY, ox: c[0], oy: c[1], u: cq(t)};
  });
  D.addEventListener('pointermove', function (e) {
    if (rs) {
      var w = Math.max(4, rs.w + rs.dir * (e.clientX - rs.x) / rs.u / rs.k), h = Math.max(2, rs.h + (e.clientY - rs.y) / rs.u / rs.k);
      rs.el.style.width = w.toFixed(2) + 'cqw'; rs.el.style.height = h.toFixed(2) + 'cqw';
      rs.el.style.flex = '0 0 auto'; rs.el.style.minHeight = '0'; rs.el.style.maxWidth = 'none'; placeH(); return;
    }
    if (!drag) return; var dx = (e.clientX - drag.x) / drag.u, dy = (e.clientY - drag.y) / drag.u;
    drag.el.style.translate = (drag.ox + dx).toFixed(2) + 'cqw ' + (drag.oy + dy).toFixed(2) + 'cqw'; placeH();
  });
  D.addEventListener('pointerup', function () { drag = null; rs = null; });
  window.addEventListener('scroll', placeH, true); window.addEventListener('resize', placeH);
  D.addEventListener('keydown', function (e) {
    if (!move || !sel) return; var k = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[e.key]; if (!k) return;
    e.preventDefault(); var c = cur(sel), st = e.shiftKey ? 2 : 0.3;
    sel.style.translate = (c[0] + k[0] * st).toFixed(2) + 'cqw ' + (c[1] + k[1] * st).toFixed(2) + 'cqw'; placeH();
  });

  /* قبل الحفظ: إزالة أدوات المحرر من الملف المحفوظ */
  D.addEventListener('click', function (e) {
    if (!e.target.closest('.sv')) return;
    closeMenu(); setSel(null);
    var held = [].slice.call(D.querySelectorAll('[data-ed]')).filter(function (x) { return x !== css; });
    held.forEach(function (x) { x.remove(); }); css.remove();
    [].forEach.call(D.querySelectorAll('.ed-hot'), function (x) { x.classList.remove('ed-hot'); });
    var wasMove = move; if (move) mb.onclick();
    setTimeout(function () { D.head.appendChild(css); D.body.appendChild(tool); if (wasMove) mb.onclick(); }, 0);
  }, true);
})();
