/* ==========================================================================
   ATLAS — Proje Atlası
   Saf JavaScript. Framework yok, grafik kütüphanesi yok — tüm görselleştirmeler
   elle çizilmiş SVG/CSS.
   Modüller: Storage, Toast, DateUtils, DB (ilişkisel veri), UI, TitleBlock, App
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Yardımcılar                                                         */
  /* ------------------------------------------------------------------ */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const uid = (prefix) => prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------ */
  /* Tarih yardımcıları                                                   */
  /* ------------------------------------------------------------------ */
  const DateUtils = {
    todayISO() { return new Date().toISOString().slice(0, 10); },
    parse(str) { return new Date(str + 'T00:00:00'); },
    daysBetween(a, b) { return Math.round((this.parse(b) - this.parse(a)) / 86400000); },
    addDays(str, n) { const d = this.parse(str); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); },
    formatShort(str) { return this.parse(str).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }); },
    formatLong(str) { return this.parse(str).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }); },
    formatFull(d) { return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }); }
  };

  /* ------------------------------------------------------------------ */
  /* Storage                                                              */
  /* ------------------------------------------------------------------ */
  const Storage = {
    KEYS: { projects: 'atlas:projects', tasks: 'atlas:tasks', prefs: 'atlas:prefs' },
    read(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
      catch (e) { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sessizce yoksay */ }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Toast                                                                */
  /* ------------------------------------------------------------------ */
  const Toast = {
    container: null,
    init() { this.container = qs('#toastContainer'); },
    show(message, type) {
      if (!this.container) return;
      const el = document.createElement('div');
      el.className = 'toast' + (type === 'error' ? ' toast--error' : '');
      el.textContent = message;
      this.container.appendChild(el);
      setTimeout(() => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 260); }, 3200);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Örnek veri (ilk açılışta, localStorage boşsa kullanılır)            */
  /* ------------------------------------------------------------------ */
  function seedProjects() {
    return [
      { id: 'proj-1', sheetNo: 'A-101', name: 'Mobil Uygulama Yeniden Tasarımı', desc: 'iOS ve Android arayüzlerinin baştan çizimi', color: 'cyan' },
      { id: 'proj-2', sheetNo: 'A-102', name: 'Ödeme Altyapısı Migrasyonu', desc: 'Eski sağlayıcıdan yeni sisteme geçiş', color: 'amber' },
      { id: 'proj-3', sheetNo: 'A-103', name: 'Kurumsal Web Sitesi Yenileme', desc: 'Marka kimliğine uygun yeni kurumsal site', color: 'sage' },
      { id: 'proj-4', sheetNo: 'A-104', name: 'Q3 Büyüme Kampanyası', desc: 'Üç kanallı performans pazarlama kampanyası', color: 'coral' },
      { id: 'proj-5', sheetNo: 'A-105', name: 'İç Araçlar: Destek Paneli', desc: 'Müşteri destek ekibi için dahili panel', color: 'cyan' }
    ];
  }
  function seedTasks() {
    return [
      // Mobil Uygulama (proj-1)
      { id: uid('t'), projectId: 'proj-1', title: 'Kullanıcı araştırması ve görüşmeler', status: 'tamam', progress: 100, start: '2026-07-01', end: '2026-07-10', completedAt: '2026-07-30' },
      { id: uid('t'), projectId: 'proj-1', title: 'Wireframe onayı', status: 'tamam', progress: 100, start: '2026-07-08', end: '2026-07-15', completedAt: '2026-08-02' },
      { id: uid('t'), projectId: 'proj-1', title: 'Yüksek çözünürlüklü tasarım (iOS)', status: 'devam', progress: 65, start: '2026-07-16', end: '2026-08-05', completedAt: null },
      { id: uid('t'), projectId: 'proj-1', title: 'Yüksek çözünürlüklü tasarım (Android)', status: 'devam', progress: 55, start: '2026-07-20', end: '2026-08-12', completedAt: null },
      { id: uid('t'), projectId: 'proj-1', title: 'Tasarım sistemi dokümantasyonu', status: 'beklemede', progress: 0, start: '2026-08-12', end: '2026-08-22', completedAt: null },
      { id: uid('t'), projectId: 'proj-1', title: 'Kullanıcı testi (prototip)', status: 'beklemede', progress: 0, start: '2026-08-25', end: '2026-09-02', completedAt: null },

      // Ödeme Altyapısı (proj-2)
      { id: uid('t'), projectId: 'proj-2', title: 'Sağlayıcı API dokümantasyon incelemesi', status: 'tamam', progress: 100, start: '2026-07-01', end: '2026-07-05', completedAt: '2026-07-31' },
      { id: uid('t'), projectId: 'proj-2', title: 'Test ortamı kurulumu', status: 'tamam', progress: 100, start: '2026-07-05', end: '2026-07-12', completedAt: '2026-08-04' },
      { id: uid('t'), projectId: 'proj-2', title: 'Ödeme akışı entegrasyonu', status: 'devam', progress: 70, start: '2026-07-14', end: '2026-08-08', completedAt: null },
      { id: uid('t'), projectId: 'proj-2', title: '3D Secure test senaryoları', status: 'devam', progress: 30, start: '2026-08-01', end: '2026-08-20', completedAt: null },
      { id: uid('t'), projectId: 'proj-2', title: 'Canlıya geçiş planı', status: 'beklemede', progress: 0, start: '2026-08-20', end: '2026-08-30', completedAt: null },
      { id: uid('t'), projectId: 'proj-2', title: 'Eski sağlayıcı kapatma', status: 'beklemede', progress: 0, start: '2026-09-01', end: '2026-09-10', completedAt: null },

      // Kurumsal Web Sitesi (proj-3)
      { id: uid('t'), projectId: 'proj-3', title: 'İçerik envanteri çıkarma', status: 'tamam', progress: 100, start: '2026-06-20', end: '2026-06-28', completedAt: '2026-08-01' },
      { id: uid('t'), projectId: 'proj-3', title: 'Marka kimliği rehberi güncelleme', status: 'tamam', progress: 100, start: '2026-06-25', end: '2026-07-05', completedAt: '2026-08-06' },
      { id: uid('t'), projectId: 'proj-3', title: 'Ana sayfa tasarımı', status: 'tamam', progress: 100, start: '2026-07-06', end: '2026-07-18', completedAt: '2026-08-08' },
      { id: uid('t'), projectId: 'proj-3', title: 'İç sayfa şablonları', status: 'devam', progress: 80, start: '2026-07-19', end: '2026-08-09', completedAt: null },
      { id: uid('t'), projectId: 'proj-3', title: 'SEO ve performans optimizasyonu', status: 'beklemede', progress: 0, start: '2026-08-15', end: '2026-08-25', completedAt: null },
      { id: uid('t'), projectId: 'proj-3', title: 'Yayına alma ve yönlendirmeler', status: 'beklemede', progress: 0, start: '2026-08-26', end: '2026-09-01', completedAt: null },

      // Q3 Büyüme Kampanyası (proj-4)
      { id: uid('t'), projectId: 'proj-4', title: 'Kampanya stratejisi ve bütçe onayı', status: 'tamam', progress: 100, start: '2026-07-01', end: '2026-07-08', completedAt: '2026-08-03' },
      { id: uid('t'), projectId: 'proj-4', title: 'Reklam kreatiflerinin üretimi', status: 'tamam', progress: 100, start: '2026-07-09', end: '2026-07-20', completedAt: '2026-08-09' },
      { id: uid('t'), projectId: 'proj-4', title: 'Google Ads kurulumu', status: 'devam', progress: 90, start: '2026-07-21', end: '2026-08-05', completedAt: null },
      { id: uid('t'), projectId: 'proj-4', title: 'Meta Ads kurulumu', status: 'devam', progress: 60, start: '2026-07-25', end: '2026-08-13', completedAt: null },
      { id: uid('t'), projectId: 'proj-4', title: 'Orta kampanya performans analizi', status: 'beklemede', progress: 0, start: '2026-08-15', end: '2026-08-20', completedAt: null },
      { id: uid('t'), projectId: 'proj-4', title: 'Bütçe yeniden dağıtımı', status: 'beklemede', progress: 0, start: '2026-08-21', end: '2026-08-25', completedAt: null },

      // İç Araçlar (proj-5)
      { id: uid('t'), projectId: 'proj-5', title: 'Gereksinim toplama görüşmeleri', status: 'tamam', progress: 100, start: '2026-07-10', end: '2026-07-17', completedAt: '2026-07-29' },
      { id: uid('t'), projectId: 'proj-5', title: 'Panel bilgi mimarisi', status: 'tamam', progress: 100, start: '2026-07-18', end: '2026-07-25', completedAt: '2026-08-10' },
      { id: uid('t'), projectId: 'proj-5', title: 'Ticket listesi arayüzü', status: 'devam', progress: 45, start: '2026-07-26', end: '2026-08-15', completedAt: null },
      { id: uid('t'), projectId: 'proj-5', title: 'Yetkilendirme ve roller', status: 'beklemede', progress: 0, start: '2026-08-16', end: '2026-08-26', completedAt: null },
      { id: uid('t'), projectId: 'proj-5', title: 'Bildirim sistemi', status: 'beklemede', progress: 0, start: '2026-08-27', end: '2026-09-05', completedAt: null }
    ];
  }

  /* ==================================================================== */
  /* DB — ilişkisel veri katmanı (projeler / görevler, projectId ile bağlı) */
  /* ==================================================================== */
  const DB = {
    projects: Storage.read(Storage.KEYS.projects, null) || seedProjects(),
    tasks: Storage.read(Storage.KEYS.tasks, null) || seedTasks(),

    persist() {
      Storage.write(Storage.KEYS.projects, this.projects);
      Storage.write(Storage.KEYS.tasks, this.tasks);
    },

    // --- Projeler ---
    addProject(name, desc, color) {
      const nextSheet = 101 + this.projects.length;
      const project = { id: uid('proj'), sheetNo: 'A-' + nextSheet, name, desc: desc || '', color: color || 'cyan' };
      this.projects.push(project);
      this.persist();
      return project;
    },
    deleteProject(id) {
      this.projects = this.projects.filter((p) => p.id !== id);
      this.tasks = this.tasks.filter((t) => t.projectId !== id); // ilişkisel kaskad silme
      this.persist();
    },

    // --- Görevler ---
    tasksFor(projectId) { return this.tasks.filter((t) => t.projectId === projectId); },
    addTask(projectId, title, start, end) {
      const task = { id: uid('t'), projectId, title, status: 'beklemede', progress: 0, start, end, completedAt: null };
      this.tasks.push(task);
      this.persist();
      return task;
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.persist();
    },
    setProgress(id, value) {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return;
      task.progress = clamp(Math.round(value), 0, 100);
      task.status = task.progress === 0 ? 'beklemede' : task.progress === 100 ? 'tamam' : 'devam';
      task.completedAt = task.status === 'tamam' ? (task.completedAt || DateUtils.todayISO()) : null;
      this.persist();
    },
    cycleStatus(id) {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return;
      const order = ['beklemede', 'devam', 'tamam'];
      const next = order[(order.indexOf(task.status) + 1) % order.length];
      task.status = next;
      task.progress = next === 'beklemede' ? 0 : next === 'tamam' ? 100 : (task.progress > 0 && task.progress < 100 ? task.progress : 50);
      task.completedAt = next === 'tamam' ? DateUtils.todayISO() : null;
      this.persist();
    },

    // --- Türetilen değerler ---
    isOverdue(task) { return task.status !== 'tamam' && task.end < DateUtils.todayISO(); },
    effectiveStatus(task) { return this.isOverdue(task) ? 'gecikmis' : task.status; },
    projectProgress(projectId) {
      const tasks = this.tasksFor(projectId);
      if (!tasks.length) return 0;
      return Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length);
    },
    overallProgress() {
      if (!this.tasks.length) return 0;
      return Math.round(this.tasks.reduce((sum, t) => sum + t.progress, 0) / this.tasks.length);
    }
  };

  const COLOR_VAR = { cyan: '--color-cyan', amber: '--color-amber', coral: '--color-coral', sage: '--color-sage' };
  const STATUS_LABEL = { beklemede: 'Beklemede', devam: 'Devam Ediyor', tamam: 'Tamamlandı', gecikmis: 'Gecikmiş' };
  const STATUS_COLOR_VAR = { beklemede: '--color-paper-dim', devam: '--color-amber', tamam: '--color-sage', gecikmis: '--color-coral' };

  /* ==================================================================== */
  /* UI CONTROLLER                                                        */
  /* ==================================================================== */
  const UI = {
    state: { search: '', statusFilter: 'all', timelineProject: 'all', openProjects: new Set() },

    /* ---- Genel Bakış ---- */
    renderOverview() {
      const totalProjects = DB.projects.length;
      const totalTasks = DB.tasks.length;
      const doneTasks = DB.tasks.filter((t) => t.status === 'tamam').length;
      const overdueTasks = DB.tasks.filter((t) => DB.isOverdue(t)).length;
      const avg = DB.overallProgress();

      qs('#statProjects').textContent = String(totalProjects);
      qs('#statTasks').textContent = String(totalTasks);
      qs('#statDone').textContent = String(doneTasks);
      qs('#statOverdue').textContent = String(overdueTasks);

      qs('#compassValue').textContent = avg + '%';
      const circumference = 628.3;
      qs('#compassFill').style.strokeDashoffset = String(circumference * (1 - avg / 100));
    },

    buildCompassTicks() {
      const g = qs('#compassTicks');
      if (!g || g.childElementCount) return;
      const ns = 'http://www.w3.org/2000/svg';
      const cx = 120, cy = 120, rOuter = 88, rInner = 82;
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24;
        const x1 = cx + rInner * Math.cos(angle), y1 = cy + rInner * Math.sin(angle);
        const x2 = cx + rOuter * Math.cos(angle), y2 = cy + rOuter * Math.sin(angle);
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', x1.toFixed(1)); line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y2.toFixed(1));
        g.appendChild(line);
      }
    },

    /* ---- Dimension-line ilerleme çubuğu üretici ---- */
    dimBarHTML(percent, colorVar) {
      const color = colorVar ? 'var(' + colorVar + ')' : 'var(--color-cyan)';
      return (
        '<div class="dim-bar">' +
        '<span class="dim-bar-value">' + percent + '%</span>' +
        '<span class="dim-bar-track"></span>' +
        '<span class="dim-bar-tick dim-bar-tick--start"></span>' +
        '<span class="dim-bar-tick dim-bar-tick--end"></span>' +
        '<span class="dim-bar-fill" style="width:' + percent + '%; background:' + color + '"></span>' +
        '<span class="dim-bar-marker" style="left:' + percent + '%; background:' + color + '"></span>' +
        '</div>'
      );
    },

    /* ---- Bölgeler (Projeler) ---- */
    matchesFilters(project) {
      const tasks = DB.tasksFor(project.id);
      const q = this.state.search.trim().toLowerCase();
      const matchesSearch = !q || project.name.toLowerCase().includes(q) || project.desc.toLowerCase().includes(q) ||
        tasks.some((t) => t.title.toLowerCase().includes(q));
      if (!matchesSearch) return false;

      const filter = this.state.statusFilter;
      if (filter === 'all') return true;
      if (filter === 'gecikmis') return tasks.some((t) => DB.isOverdue(t));
      return tasks.some((t) => t.status === filter);
    },

    renderProjectList() {
      const container = qs('#projectList');
      const visible = DB.projects.filter((p) => this.matchesFilters(p));
      container.innerHTML = '';

      if (!visible.length) {
        container.innerHTML = '<p class="empty-state">Bu kritere uyan bölge yok. Filtreleri temizlemeyi dene.</p>';
        return;
      }

      visible.forEach((project) => {
        const tasks = DB.tasksFor(project.id);
        const progress = DB.projectProgress(project.id);
        const colorVar = COLOR_VAR[project.color] || COLOR_VAR.cyan;
        const isOpen = this.state.openProjects.has(project.id);

        const card = document.createElement('article');
        card.className = 'project-card' + (isOpen ? ' is-open' : '');
        card.style.borderLeft = '3px solid var(' + colorVar + ')';

        const doneCount = tasks.filter((t) => t.status === 'tamam').length;

        card.innerHTML =
          '<button class="project-head" type="button" data-toggle-project="' + project.id + '">' +
          '<span class="project-sheet-no">' + project.sheetNo + '</span>' +
          '<span class="project-head-main">' +
          '<span class="project-name">' + escapeHtml(project.name) + '</span>' +
          '<span class="project-desc">' + escapeHtml(project.desc) + '</span>' +
          '</span>' +
          '<span class="project-meta">' +
          '<span class="project-meta-count">' + doneCount + ' / ' + tasks.length + ' görev tamam</span>' +
          '<span class="project-meta-count">' + progress + '% ilerleme</span>' +
          '</span>' +
          '<svg class="project-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<div class="project-body"><div class="project-body-inner">' +
          this.dimBarHTML(progress, colorVar) +
          '<div class="task-list" data-task-list="' + project.id + '"></div>' +
          '<form class="task-form" data-task-form="' + project.id + '">' +
          '<label>Görev<input type="text" name="title" placeholder="ör. API dokümantasyonu" required></label>' +
          '<label>Başlangıç<input type="date" name="start" required></label>' +
          '<label>Bitiş<input type="date" name="end" required></label>' +
          '<button type="submit">+ Ekle</button>' +
          '</form>' +
          '<div class="project-delete-row"><button type="button" data-delete-project="' + project.id + '">Bu bölgeyi sil</button></div>' +
          '</div></div>';

        container.appendChild(card);
        this.renderTaskList(project.id);
      });
    },

    renderTaskList(projectId) {
      const list = qs('[data-task-list="' + projectId + '"]');
      if (!list) return;
      const tasks = DB.tasksFor(projectId).slice().sort((a, b) => a.start.localeCompare(b.start));
      if (!tasks.length) {
        list.innerHTML = '<p class="empty-state">Henüz görev yok. Aşağıdan ilk görevi ekle.</p>';
        return;
      }
      list.innerHTML = tasks.map((task) => {
        const eff = DB.effectiveStatus(task);
        return (
          '<div class="task-row">' +
          '<button class="status-dot status-dot--' + eff + '" type="button" data-cycle-status="' + task.id + '" title="Durumu değiştir: ' + STATUS_LABEL[eff] + '"></button>' +
          '<span class="task-title">' + escapeHtml(task.title) + '</span>' +
          '<span class="task-dates">' + DateUtils.formatShort(task.start) + ' → ' + DateUtils.formatShort(task.end) + '</span>' +
          '<span class="task-progress-mini">' + this.dimBarHTML(task.progress, STATUS_COLOR_VAR[eff]) + '</span>' +
          '<span class="task-tag task-tag--' + eff + '">' + STATUS_LABEL[eff] + '</span>' +
          '<button class="task-delete" type="button" data-delete-task="' + task.id + '" aria-label="Görevi sil">✕</button>' +
          '</div>'
        );
      }).join('');
    },

    /* ---- Zaman Çizelgesi (Gantt) ---- */
    renderTimelineFilterOptions() {
      const select = qs('#timelineProjectFilter');
      const current = select.value;
      select.innerHTML = '<option value="all">Tüm bölgeler</option>' +
        DB.projects.map((p) => '<option value="' + p.id + '">' + escapeHtml(p.name) + '</option>').join('');
      select.value = current || 'all';
    },

    renderTimeline() {
      const filter = this.state.timelineProject;
      const tasks = (filter === 'all' ? DB.tasks : DB.tasksFor(filter)).slice().sort((a, b) => a.start.localeCompare(b.start));
      const grid = qs('#timelineGrid');
      const legend = qs('#timelineLegend');

      legend.innerHTML = DB.projects.map((p) => {
        const colorVar = COLOR_VAR[p.color] || COLOR_VAR.cyan;
        return '<span class="timeline-legend-item"><span class="timeline-legend-swatch" style="background:var(' + colorVar + ')"></span>' + escapeHtml(p.name) + '</span>';
      }).join('') + '<span class="timeline-legend-item"><span class="timeline-legend-swatch" style="background:none;border:2px solid var(--color-coral)"></span>Gecikmiş çerçeve</span>';

      if (!tasks.length) {
        grid.innerHTML = '<p class="empty-state">Gösterilecek görev yok.</p>';
        return;
      }

      const minStart = tasks.reduce((min, t) => (t.start < min ? t.start : min), tasks[0].start);
      const maxEnd = tasks.reduce((max, t) => (t.end > max ? t.end : max), tasks[0].end);
      const rangeStart = DateUtils.addDays(minStart, -2);
      const rangeEnd = DateUtils.addDays(maxEnd, 2);
      const totalDays = Math.max(1, DateUtils.daysBetween(rangeStart, rangeEnd));
      const dayWidth = 28;
      const trackWidth = totalDays * dayWidth;

      const projectById = {};
      DB.projects.forEach((p) => { projectById[p.id] = p; });

      let rowsHTML = '';
      tasks.forEach((task) => {
        const project = projectById[task.projectId];
        const colorVar = project ? (COLOR_VAR[project.color] || COLOR_VAR.cyan) : COLOR_VAR.cyan;
        const left = DateUtils.daysBetween(rangeStart, task.start) * dayWidth;
        const width = Math.max(dayWidth * 0.6, DateUtils.daysBetween(task.start, task.end) * dayWidth);
        const overdue = DB.isOverdue(task);
        rowsHTML +=
          '<div class="timeline-row">' +
          '<span class="timeline-row-label">' + (project ? project.sheetNo + ' · ' : '') + escapeHtml(task.title) + '</span>' +
          '<span class="timeline-track" style="width:' + trackWidth + 'px; min-width:' + trackWidth + 'px;">' +
          '<span class="timeline-bar' + (overdue ? ' is-overdue' : '') + '" style="left:' + left + 'px; width:' + width + 'px; background:var(' + colorVar + ');' + (overdue ? 'box-shadow:0 0 0 2px var(--color-coral);' : '') + '">' +
          '<span class="timeline-bar-label">' + task.progress + '%</span>' +
          '</span>' +
          '</span>' +
          '</div>';
      });

      const todayOffset = DateUtils.daysBetween(rangeStart, DateUtils.todayISO()) * dayWidth;
      grid.style.setProperty('--track-width', trackWidth + 'px');
      grid.innerHTML =
        '<div class="timeline-today" style="left:' + (220 + todayOffset) + 'px;"></div>' + rowsHTML;
    },

    /* ---- Rapor: Durum dağılımı (donut) ---- */
    renderDonut() {
      const counts = { tamam: 0, devam: 0, gecikmis: 0, beklemede: 0 };
      DB.tasks.forEach((t) => { counts[DB.effectiveStatus(t)] += 1; });
      const total = DB.tasks.length || 1;

      const order = ['tamam', 'devam', 'gecikmis', 'beklemede'];
      const ns = 'http://www.w3.org/2000/svg';
      const svg = qs('#donutChart');
      svg.innerHTML = '';
      const cx = 100, cy = 100, r = 78, strokeW = 26;
      const circumference = 2 * Math.PI * r;
      let offsetAcc = 0;

      order.forEach((key) => {
        const count = counts[key];
        if (!count) return;
        const fraction = count / total;
        const segLen = fraction * circumference;
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'var(' + STATUS_COLOR_VAR[key] + ')');
        circle.setAttribute('stroke-width', strokeW);
        circle.setAttribute('stroke-dasharray', segLen.toFixed(1) + ' ' + (circumference - segLen).toFixed(1));
        circle.setAttribute('stroke-dashoffset', (-offsetAcc).toFixed(1));
        svg.appendChild(circle);
        offsetAcc += segLen;
      });

      qs('#donutTotal').textContent = String(DB.tasks.length);
      qs('#donutLegend').innerHTML = order.map((key) => {
        if (!counts[key]) return '';
        return '<li><span class="donut-legend-swatch" style="background:var(' + STATUS_COLOR_VAR[key] + ')"></span>' + STATUS_LABEL[key] + '<span class="donut-legend-count">' + counts[key] + '</span></li>';
      }).join('');
    },

    /* ---- Rapor: Bölge bazlı ilerleme ---- */
    renderProjectProgressBars() {
      const container = qs('#projectProgressBars');
      container.innerHTML = DB.projects.map((p) => {
        const progress = DB.projectProgress(p.id);
        const colorVar = COLOR_VAR[p.color] || COLOR_VAR.cyan;
        return '<div class="progress-bar-row"><span class="progress-bar-label">' + escapeHtml(p.name) + '</span>' + this.dimBarHTML(progress, colorVar) + '</div>';
      }).join('');
    },

    /* ---- Rapor: Tamamlanma eğilimi (son 14 gün) ---- */
    renderTrendChart() {
      const days = 14;
      const today = DateUtils.todayISO();
      const buckets = [];
      for (let i = days - 1; i >= 0; i--) buckets.push(DateUtils.addDays(today, -i));

      const countsByDay = {};
      buckets.forEach((d) => { countsByDay[d] = 0; });
      DB.tasks.forEach((t) => {
        if (t.completedAt && countsByDay[t.completedAt] !== undefined) countsByDay[t.completedAt] += 1;
      });

      let cumulative = 0;
      const points = buckets.map((d, i) => {
        cumulative += countsByDay[d];
        const x = (i / (days - 1)) * 620 + 10;
        return { x, y: cumulative, date: d };
      });
      const maxY = Math.max(1, ...points.map((p) => p.y));
      const toSvgY = (y) => 160 - (y / maxY) * 140;

      const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + toSvgY(p.y).toFixed(1)).join(' ');
      const areaPath = linePath + ' L ' + points[points.length - 1].x.toFixed(1) + ' 160 L ' + points[0].x.toFixed(1) + ' 160 Z';

      const dotsHTML = points.map((p) =>
        '<circle cx="' + p.x.toFixed(1) + '" cy="' + toSvgY(p.y).toFixed(1) + '" r="3" fill="var(--color-cyan-bright)"><title>' + DateUtils.formatShort(p.date) + ': ' + p.y + ' tamamlanan</title></circle>'
      ).join('');

      const gridLinesHTML = [0, 0.25, 0.5, 0.75, 1].map((f) =>
        '<line x1="0" y1="' + (160 - f * 140).toFixed(1) + '" x2="640" y2="' + (160 - f * 140).toFixed(1) + '" stroke="var(--color-line)" stroke-width="1" opacity="0.5"/>'
      ).join('');

      qs('#trendChart').innerHTML =
        gridLinesHTML +
        '<path d="' + areaPath + '" fill="var(--color-cyan)" opacity="0.14"></path>' +
        '<path d="' + linePath + '" fill="none" stroke="var(--color-cyan-bright)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></path>' +
        dotsHTML;
    },

    /* ---- Hepsini yeniden çiz ---- */
    renderAll() {
      this.renderOverview();
      this.buildCompassTicks();
      this.renderProjectList();
      this.renderTimelineFilterOptions();
      this.renderTimeline();
      this.renderDonut();
      this.renderProjectProgressBars();
      this.renderTrendChart();
      TitleBlock.updateCount();
    }
  };

  /* ==================================================================== */
  /* TITLE BLOCK — imza öğesi: scroll ile canlı güncellenen başlık bloğu  */
  /* ==================================================================== */
  const TitleBlock = {
    init() {
      qs('#tbDate').textContent = DateUtils.formatFull(new Date());
      this.updateCount();
      const sections = qsa('main > section[data-sheet]');
      if (!('IntersectionObserver' in window) || !sections.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            qs('#tbSheet').textContent = entry.target.dataset.sheet;
            qs('#tbTitle').textContent = entry.target.dataset.sheetTitle;
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
      sections.forEach((s) => io.observe(s));
    },
    updateCount() {
      const el = qs('#tbCount');
      if (el) el.textContent = String(DB.projects.length);
      const scaleEl = qs('#tbScale');
      if (scaleEl) scaleEl.textContent = '1 : ' + DB.tasks.length;
    }
  };

  /* ==================================================================== */
  /* SCROLL REVEAL                                                        */
  /* ==================================================================== */
  function initScrollReveal() {
    const targets = qsa('.stat-plate, .report-card');
    if (!('IntersectionObserver' in window)) return;
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  }

  /* ==================================================================== */
  /* EVENT WIRING                                                         */
  /* ==================================================================== */
  function wireEvents() {
    // Proje listesi: genişlet/daralt, durum değiştir, sil, görev ekle/sil (event delegation)
    qs('#projectList').addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle-project]');
      if (toggleBtn) {
        const id = toggleBtn.dataset.toggleProject;
        const card = toggleBtn.closest('.project-card');
        if (UI.state.openProjects.has(id)) { UI.state.openProjects.delete(id); card.classList.remove('is-open'); }
        else {
          UI.state.openProjects.add(id);
          card.classList.add('is-open');
          const startInput = card.querySelector('[data-task-form] input[name="start"]');
          const endInput = card.querySelector('[data-task-form] input[name="end"]');
          if (startInput && !startInput.value) startInput.value = DateUtils.todayISO();
          if (endInput && !endInput.value) endInput.value = DateUtils.addDays(DateUtils.todayISO(), 7);
        }
        return;
      }
      const cycleBtn = e.target.closest('[data-cycle-status]');
      if (cycleBtn) {
        DB.cycleStatus(cycleBtn.dataset.cycleStatus);
        UI.renderAll();
        Toast.show('Görev durumu güncellendi.');
        return;
      }
      const deleteTaskBtn = e.target.closest('[data-delete-task]');
      if (deleteTaskBtn) {
        DB.deleteTask(deleteTaskBtn.dataset.deleteTask);
        UI.renderAll();
        Toast.show('Görev silindi.');
        return;
      }
      const deleteProjectBtn = e.target.closest('[data-delete-project]');
      if (deleteProjectBtn) {
        const id = deleteProjectBtn.dataset.deleteProject;
        const project = DB.projects.find((p) => p.id === id);
        const ok = window.confirm('"' + (project ? project.name : 'Bu bölge') + '" silinsin mi? İçindeki tüm görevler de silinecek.');
        if (ok) { DB.deleteProject(id); UI.state.openProjects.delete(id); UI.renderAll(); Toast.show('Bölge silindi.'); }
        return;
      }
    });

    qs('#projectList').addEventListener('submit', (e) => {
      const form = e.target.closest('[data-task-form]');
      if (!form) return;
      e.preventDefault();
      const projectId = form.dataset.taskForm;
      const title = form.elements.title.value.trim();
      const start = form.elements.start.value;
      const end = form.elements.end.value;
      if (!title || !start || !end) return;
      if (end < start) { Toast.show('Bitiş tarihi başlangıçtan önce olamaz.', 'error'); return; }
      DB.addTask(projectId, title, start, end);
      UI.state.openProjects.add(projectId);
      UI.renderAll();
      Toast.show('Görev eklendi.');
    });

    // Arama ve durum filtresi
    qs('#projectSearch').addEventListener('input', (e) => { UI.state.search = e.target.value; UI.renderProjectList(); });
    qs('#statusFilter').addEventListener('change', (e) => { UI.state.statusFilter = e.target.value; UI.renderProjectList(); });

    // Zaman çizelgesi filtresi
    qs('#timelineProjectFilter').addEventListener('change', (e) => { UI.state.timelineProject = e.target.value; UI.renderTimeline(); });

    // Negatif/pozitif baskı
    const applyPrint = (mode) => {
      if (mode === 'negative') document.documentElement.setAttribute('data-print', 'negative');
      else document.documentElement.removeAttribute('data-print');
      const label = mode === 'negative' ? 'NEGATİF BASKI' : 'POZİTİF BASKI';
      qs('#printToggle').textContent = label;
      const mobileBtn = qs('#printToggleMobile');
      if (mobileBtn) mobileBtn.textContent = label;
      Storage.write(Storage.KEYS.prefs, { ...Storage.read(Storage.KEYS.prefs, {}), print: mode });
    };
    const togglePrint = () => {
      const current = document.documentElement.getAttribute('data-print') === 'negative' ? 'negative' : 'positive';
      applyPrint(current === 'negative' ? 'positive' : 'negative');
    };
    qs('#printToggle').addEventListener('click', togglePrint);
    const printToggleMobile = qs('#printToggleMobile');
    if (printToggleMobile) printToggleMobile.addEventListener('click', togglePrint);
    UI._applyPrint = applyPrint;

    // Mobil menü
    const navToggle = qs('#navToggle');
    const mobileNav = qs('#mobileNav');
    navToggle.addEventListener('click', () => {
      const isOpen = !mobileNav.hidden;
      mobileNav.hidden = isOpen;
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });
    qsa('.mobile-nav a').forEach((a) => a.addEventListener('click', () => { mobileNav.hidden = true; navToggle.setAttribute('aria-expanded', 'false'); }));

    // Yeni bölge modalı
    const modal = qs('#projectModal');
    const openModal = () => {
      modal.hidden = false;
      qs('#pfName').focus();
      mobileNav.hidden = true;
      navToggle.setAttribute('aria-expanded', 'false');
    };
    const closeModal = () => {
      modal.hidden = true;
      qs('#projectForm').reset();
      qsa('.color-swatch').forEach((sw, i) => sw.classList.toggle('is-active', i === 0));
      qs('#pfColorValue').value = 'cyan';
      if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      qs('#newProjectBtn').focus({ preventScroll: true });
    };
    qs('#newProjectBtn').addEventListener('click', openModal);
    qs('#heroNewProjectBtn').addEventListener('click', openModal);
    const newProjectBtnMobile = qs('#newProjectBtnMobile');
    if (newProjectBtnMobile) newProjectBtnMobile.addEventListener('click', openModal);
    qs('#projectModalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    qs('#pfColorPicker').addEventListener('click', (e) => {
      const btn = e.target.closest('.color-swatch');
      if (!btn) return;
      qsa('.color-swatch', qs('#pfColorPicker')).forEach((sw) => sw.classList.remove('is-active'));
      btn.classList.add('is-active');
      qs('#pfColorValue').value = btn.dataset.color;
    });

    qs('#projectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = qs('#pfName').value.trim();
      if (!name) return;
      const desc = qs('#pfDesc').value.trim();
      const color = qs('#pfColorValue').value;
      DB.addProject(name, desc, color);
      UI.renderAll();
      Toast.show('Yeni bölge oluşturuldu: ' + name);
      closeModal();
    });

    // Klavye kısayolları
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape' && !modal.hidden) { closeModal(); return; }
      if (typing) return;
      if (e.key === 'n' || e.key === 'N') { openModal(); }
      else if (e.key === '/') { e.preventDefault(); qs('#projectSearch').focus(); }
    });
  }

  /* ==================================================================== */
  /* APP INIT                                                             */
  /* ==================================================================== */
  function init() {
    Toast.init();
    const prefs = Storage.read(Storage.KEYS.prefs, {});
    wireEvents();
    if (UI._applyPrint) UI._applyPrint(prefs.print === 'negative' ? 'negative' : 'positive');
    UI.renderAll();
    TitleBlock.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();