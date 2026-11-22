/* Bab 10 · Keadilan Sosial — navigasi dan elemen interaktif
   JavaScript murni, tanpa library. */
(function () {
  "use strict";

  /* Bagian presentasi dan alokasi waktunya (menit) */
  var SECTIONS = [
    { id: "0",    label: "Pembukaan",                           who: "Keindi",          min: 2 },
    { id: "10.1", label: "Pendahuluan dan Asal-Usul",           who: "Keindi & Angel",  min: 8 },
    { id: "10.2", label: "Hakikat Keadilan",                    who: "Clarissa",        min: 4 },
    { id: "10.3", label: "Jenis-Jenis Keadilan",                who: "Hilery & Razka",  min: 9 },
    { id: "10.4", label: "Keadilan Distributif pada Khususnya", who: "Hajjid",          min: 6 },
    { id: "10.5", label: "Keadilan Sosial",                     who: "Rama",            min: 6 },
    { id: "10.6", label: "Penutup",                             who: "Yoel",            min: 3 }
  ];
  var TOTAL_MIN = 40;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var slides = $$(".slide");
  var current = 0;
  var isPresenter = new URLSearchParams(location.search).has("presenter");
  if (isPresenter) document.body.classList.add("presenter");

  /* ---------- data per slide ---------- */
  function toSec(t) {
    if (!t) return 0;
    var p = t.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10);
  }
  function fmt(s) {
    var m = Math.floor(s / 60), r = Math.round(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function sectionOf(id) {
    for (var k = 0; k < SECTIONS.length; k++) if (SECTIONS[k].id === id) return SECTIONS[k];
    return SECTIONS[0];
  }

  var meta = slides.map(function (el, i) {
    var notes = el.querySelector(".notes");
    return {
      el: el,
      index: i,
      sec: el.dataset.sec || "0",
      sub: el.dataset.sub || "",
      who: el.dataset.who || "",
      title: el.dataset.title || ("Slide " + (i + 1)),
      src: el.dataset.src || "",
      dur: notes ? toSec(notes.dataset.dur) : 0,
      notesHTML: notes ? (notes.querySelector("ul") || notes).innerHTML : ""
    };
  });
  var cumulative = [];
  meta.reduce(function (acc, m, i) { cumulative[i] = acc + m.dur; return cumulative[i]; }, 0);

  /* ---------- progres per bagian ---------- */
  var progress = $("#progress");
  var segFills = {};
  SECTIONS.forEach(function (s) {
    var count = meta.filter(function (m) { return m.sec === s.id; }).length;
    if (!count) return;
    var seg = document.createElement("div");
    seg.className = "seg";
    seg.style.flex = count + " 1 0";
    seg.title = (s.id === "0" ? "" : s.id + " ") + s.label;
    var fill = document.createElement("i");
    seg.appendChild(fill);
    progress.appendChild(seg);
    segFills[s.id] = { fill: fill, count: count };
  });

  /* ---------- daftar isi ---------- */
  var tocList = $("#tocList");
  SECTIONS.forEach(function (s) {
    var items = meta.filter(function (m) { return m.sec === s.id; });
    if (!items.length) return;
    var box = document.createElement("div");
    box.className = "toc-sec";
    var head = document.createElement("button");
    head.type = "button";
    head.innerHTML = "<span>" + (s.id === "0" ? "" : s.id + " ") + s.label + "</span><span>" + s.who + " · " + s.min + " mnt</span>";
    head.addEventListener("click", function () { go(items[0].index); closePanels(); });
    box.appendChild(head);
    var ol = document.createElement("ol");
    items.forEach(function (m) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.index = m.index;
      b.innerHTML = "<span>" + (m.index + 1) + "</span><span>" + m.title + "</span>";
      b.addEventListener("click", function () { go(m.index); closePanels(); });
      li.appendChild(b);
      ol.appendChild(li);
    });
    box.appendChild(ol);
    tocList.appendChild(box);
  });

  /* ---------- tampilkan slide ---------- */
  var whereSec = $("#whereSec"), whereSub = $("#whereSub"), who = $("#who"),
      src = $("#src"), count = $("#count");

  function render() {
    var m = meta[current];
    var prev = meta[current - 1];
    var sec = sectionOf(m.sec);

    slides.forEach(function (el, i) {
      var on = i === current;
      el.classList.toggle("active", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
      if ("inert" in el) el.inert = !on;
    });

    whereSec.textContent = m.sec === "0" ? sec.label : m.sec + " " + sec.label;
    whereSub.textContent = m.sub;

    var handoff = prev && prev.who !== m.who;
    who.classList.toggle("handoff", !!handoff);
    who.innerHTML = handoff ? "Giliran <b>" + m.who + "</b>" : "Presenter: <b>" + m.who + "</b>";

    src.innerHTML = m.src ? "Sumber: <b>" + m.src + "</b>" : "Bab 10 · Keadilan Sosial · Character Building: Pancasila";
    count.textContent = (current + 1) + " / " + slides.length;

    Object.keys(segFills).forEach(function (id) {
      var items = meta.filter(function (x) { return x.sec === id; });
      var first = items[0].index, last = items[items.length - 1].index;
      var pct = current > last ? 100 : current < first ? 0 : ((current - first + 1) / items.length) * 100;
      segFills[id].fill.style.width = pct + "%";
    });

    $$(".toc-sec li button").forEach(function (b) {
      b.classList.toggle("current", +b.dataset.index === current);
    });

    renderNotes();
    var hash = "#/" + (current + 1);
    if (location.hash !== hash) history.replaceState(null, "", hash);
    document.title = (current + 1) + ". " + m.title + " · Bab 10 Keadilan Sosial";
  }

  function renderNotes() {
    var m = meta[current], next = meta[current + 1];
    var sec = sectionOf(m.sec);
    $("#npTitle").textContent = "Slide " + (current + 1) + " · " + m.title;
    $("#npMeta").innerHTML =
      "Durasi slide <b>±" + fmt(m.dur) + "</b> · Presenter: <b>" + m.who + "</b> · Bagian " +
      (m.sec === "0" ? sec.label : m.sec) + ": " + sec.min + " menit · Target selesai slide ini: <b>" +
      fmt(cumulative[current]) + "</b> dari " + TOTAL_MIN + ":00";
    $("#npBody").innerHTML = m.notesHTML || "<li>Tidak ada catatan.</li>";
    $("#npNext").textContent = next
      ? "Berikutnya: " + next.title + (next.who !== m.who ? " → giliran " + next.who : "")
      : "Ini slide terakhir.";
  }

  /* ---------- navigasi ---------- */
  var channel = null;
  try { channel = new BroadcastChannel("bab10-keadilan-sosial"); } catch (e) { channel = null; }

  function go(i, fromRemote) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === current && slides[i].classList.contains("active")) return;
    current = i;
    render();
    if (channel && !fromRemote) channel.postMessage({ type: "goto", index: current });
  }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  if (channel) {
    channel.onmessage = function (e) {
      if (e.data && e.data.type === "goto") go(e.data.index, true);
    };
  }

  $("#btnNext").addEventListener("click", next);
  $("#btnPrev").addEventListener("click", prev);

  $$("[data-goto-sec]").forEach(function (b) {
    b.addEventListener("click", function () {
      var target = meta.filter(function (m) { return m.sec === b.dataset.gotoSec; })[0];
      if (target) go(target.index);
    });
  });

  function fromHash() {
    var n = parseInt((location.hash.match(/\d+/) || ["1"])[0], 10);
    return isNaN(n) ? 0 : n - 1;
  }
  window.addEventListener("hashchange", function () { go(fromHash()); });

  /* ---------- panel ---------- */
  var toc = $("#toc"), notes = $("#notes"), btnToc = $("#btnToc"), btnNotes = $("#btnNotes");

  function setPanel(panel, btn, open) {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function toggleToc() { setPanel(toc, btnToc, toc.hidden); if (!toc.hidden) setPanel(notes, btnNotes, false); }
  function toggleNotes() { setPanel(notes, btnNotes, notes.hidden); if (!notes.hidden) setPanel(toc, btnToc, false); }
  function closePanels() { setPanel(toc, btnToc, false); if (!isPresenter) setPanel(notes, btnNotes, false); }

  btnToc.addEventListener("click", toggleToc);
  btnNotes.addEventListener("click", toggleNotes);
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closePanels); });

  /* ---------- layar penuh ---------- */
  var btnFull = $("#btnFull");
  function toggleFull() {
    var d = document;
    if (!d.fullscreenElement && !d.webkitFullscreenElement) {
      var el = d.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } else {
      (d.exitFullscreen || d.webkitExitFullscreen || function () {}).call(d);
    }
  }
  btnFull.addEventListener("click", toggleFull);
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) {
    document.addEventListener(ev, function () {
      var on = !!(document.fullscreenElement || document.webkitFullscreenElement);
      btnFull.textContent = on ? "Keluar layar penuh" : "Layar penuh";
    });
  });

  /* ---------- jendela presenter ---------- */
  function openPresenter() {
    var url = location.pathname + "?presenter" + "#/" + (current + 1);
    window.open(url, "bab10-presenter", "width=900,height=640");
  }

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    var onControl = t && t.closest && t.closest("button, summary, a, input, textarea");
    var k = e.key;

    if ((k === " " || k === "Enter") && onControl) return; // biarkan tombol bekerja

    switch (k) {
      case "ArrowRight": case "PageDown": case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home": e.preventDefault(); go(0); break;
      case "End": e.preventDefault(); go(slides.length - 1); break;
      case "n": case "N": toggleNotes(); break;
      case "t": case "T": toggleToc(); break;
      case "f": case "F": if (!isPresenter) toggleFull(); break;
      case "p": case "P": if (!isPresenter) openPresenter(); break;
      case "Escape": closePanels(); break;
    }
  });

  /* Setelah klik dengan mouse, lepas fokus agar spasi/panah tetap mengganti slide */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button, summary");
    if (b && e.detail > 0) b.blur();
  });

  /* Geser (swipe) di layar sentuh */
  var touchX = null, touchY = null;
  document.addEventListener("touchstart", function (e) {
    touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 45) { dx < 0 ? next() : prev(); }
    touchX = touchY = null;
  }, { passive: true });

  /* ---------- kartu balik ---------- */
  $$(".flip").forEach(function (card) {
    card.addEventListener("click", function () {
      var on = !card.classList.contains("flipped");
      card.classList.toggle("flipped", on);
      card.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });

  /* ---------- tab ---------- */
  $$("[data-tabs]").forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    var panels = $$('[role="tabpanel"]', box);
    var uid = "tb" + Math.random().toString(36).slice(2, 7);
    tabs.forEach(function (tab, i) {
      tab.id = uid + "-t" + i;
      panels[i].id = uid + "-p" + i;
      tab.setAttribute("aria-controls", panels[i].id);
      panels[i].setAttribute("aria-labelledby", tab.id);
      tab.addEventListener("click", function () { select(i); });
    });
    function select(i) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.tabIndex = j === i ? 0 : -1;
        panels[j].hidden = j !== i;
      });
    }
    select(0);

    var all = $(".show-all-btn", box);
    if (all) {
      all.addEventListener("click", function () {
        var on = !box.classList.contains("show-all");
        box.classList.toggle("show-all", on);
        all.setAttribute("aria-pressed", on ? "true" : "false");
        all.textContent = on ? "Kembali ke tab" : "Lihat semua";
      });
    }
  });

  /* ---------- timer pertanyaan pembuka ---------- */
  $$("[data-timer]").forEach(function (box) {
    var total = parseInt(box.dataset.timer, 10) || 60;
    var btn = $(".timer-btn", box), out = $(".timer-out", box);
    var left = total, id = null;
    function show() { out.textContent = fmt(left); }
    function stop() { clearInterval(id); id = null; }
    btn.addEventListener("click", function () {
      if (id) { stop(); left = total; show(); box.classList.remove("done"); btn.textContent = "Mulai 1 menit"; return; }
      if (left <= 0) { left = total; box.classList.remove("done"); }
      btn.textContent = "Hentikan";
      id = setInterval(function () {
        left -= 1; show();
        if (left <= 0) { stop(); box.classList.add("done"); out.textContent = "Waktu habis"; btn.textContent = "Ulangi"; }
      }, 1000);
    });
    show();
  });

  /* ---------- stopwatch catatan pembicara ---------- */
  var elapsed = 0, ticking = null, startedAt = 0;
  var npElapsed = $("#npElapsed"), npStart = $("#npStart");
  function showElapsed() {
    var s = Math.floor(elapsed / 1000), m = Math.floor(s / 60), r = s % 60;
    npElapsed.textContent = (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  npStart.addEventListener("click", function () {
    if (ticking) {
      clearInterval(ticking); ticking = null; elapsed += Date.now() - startedAt; npStart.textContent = "Lanjut";
    } else {
      startedAt = Date.now(); npStart.textContent = "Jeda";
      var base = elapsed;
      ticking = setInterval(function () { elapsed = base + (Date.now() - startedAt); showElapsed(); }, 500);
    }
  });
  $("#npReset").addEventListener("click", function () {
    if (ticking) { clearInterval(ticking); ticking = null; }
    elapsed = 0; showElapsed(); npStart.textContent = "Mulai";
  });

  /* ---------- mulai ---------- */
  if (isPresenter) { notes.hidden = false; btnNotes.setAttribute("aria-expanded", "true"); }
  current = -1;
  go(fromHash(), true);
})();
