
const CATEGORIES = ['Food', 'Entertainment', 'Transport', 'Shopping', 'Crypto', 'Currency', 'Other'];

const CATEGORY_IMAGES = {
  Food:          'images/mcdonalds.png',
  Entertainment: 'images/monster.png',
  Transport:     'images/tesla.png',
  Shopping:      'images/uniliver.png',
  Crypto:        'images/BTC.png',
  Currency:      'images/EURO.png',
  Other:         'images/logo.png',
};

const CHART_COLORS = ['#7380ec','#41f1b6','#ff7782','#ffbb55','#36A2EB','#FF9F40','#C9CBCF'];


   
function initialData() {
  const now = new Date();
  const data= (monthsAgo, day) => {
    const dt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    return dt.toISOString().slice(0, 10);
  };
  return [
    { id: uid(), description: "Salary",        amount: 3500,  type: "income",  category: "Other",         date: d(0, 1)  },
    { id: uid(), description: "McDonald's",    amount: 12.5,  type: "expense", category: "Food",          date: d(0, 3)  },
    { id: uid(), description: "Netflix",       amount: 15.99, type: "expense", category: "Entertainment", date: d(0, 5)  },
    { id: uid(), description: "Uber",          amount: 22,    type: "expense", category: "Transport",     date: d(0, 7)  },
    { id: uid(), description: "Amazon",        amount: 89.99, type: "expense", category: "Shopping",      date: d(0, 10) },
    { id: uid(), description: "Bitcoin",       amount: 200,   type: "income",  category: "Crypto",        date: d(0, 12) },
    { id: uid(), description: "Euro Exchange", amount: 450,   type: "income",  category: "Currency",      date: d(1, 2)  },
    { id: uid(), description: "Freelance",     amount: 800,   type: "income",  category: "Other",         date: d(1, 5)  },
    { id: uid(), description: "Monster Energy",amount: 8.5,   type: "expense", category: "Entertainment", date: d(1, 8)  },
    { id: uid(), description: "Tesla",         amount: 65,    type: "expense", category: "Transport",     date: d(1, 12) },
    { id: uid(), description: "Unilever",      amount: 34.5,  type: "expense", category: "Shopping",      date: d(1, 15) },
    { id: uid(), description: "Ethereum",      amount: 320,   type: "income",  category: "Crypto",        date: d(2, 3)  },
    { id: uid(), description: "Salary",        amount: 3500,  type: "income",  category: "Other",         date: d(2, 1)  },
    { id: uid(), description: "McDonald's",    amount: 9.75,  type: "expense", category: "Food",          date: d(2, 6)  },
    { id: uid(), description: "Amazon",        amount: 55,    type: "expense", category: "Shopping",      date: d(2, 9)  },
    { id: uid(), description: "Uber",          amount: 18,    type: "expense", category: "Transport",     date: d(3, 4)  },
    { id: uid(), description: "Salary",        amount: 3500,  type: "income",  category: "Other",         date: d(3, 1)  },
    { id: uid(), description: "Netflix",       amount: 15.99, type: "expense", category: "Entertainment", date: d(3, 5)  },
    { id: uid(), description: "Euro Exchange", amount: 300,   type: "income",  category: "Currency",      date: d(4, 2)  },
    { id: uid(), description: "Tesla",         amount: 72,    type: "expense", category: "Transport",     date: d(4, 8)  },
    { id: uid(), description: "Freelance",     amount: 600,   type: "income",  category: "Other",         date: d(4, 10) },
    { id: uid(), description: "Bitcoin",       amount: 150,   type: "expense", category: "Crypto",        date: d(5, 3)  },
    { id: uid(), description: "Salary",        amount: 3500,  type: "income",  category: "Other",         date: d(5, 1)  },
    { id: uid(), description: "Unilever",      amount: 42,    type: "expense", category: "Shopping",      date: d(5, 7)  },
  ];
}


function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmt(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



const State = {
  transactions: [],
  filters: { from: null, to: null, category: 'all', type: 'all' },
  role: 'viewer',
  theme: 'light',
  card: { number: '4242', holder: 'John Doe', expiry: '12/27', network: 'visa' },
  _charts: {},

  filteredTransactions() {
    const { from, to, category, type } = this.filters;
    return this.transactions.filter(tx => {
      if (from && tx.date < from) return false;
      if (to   && tx.date > to)   return false;
      if (category !== 'all' && tx.category !== category) return false;
      if (type !== 'all'     && tx.type     !== type)     return false;
      return true;
    });
  },

  summary() {
    const txs = this.filteredTransactions();
    const income   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  },

  monthlyTrend() {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString('default', { month: 'short' }) });
    }
    return months.map(({ year, month, label }) => {
      const txs = this.transactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      const income   = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month: label, balance: income - expenses };
    });
  },

  categoryTotals() {
    const txs = this.filteredTransactions().filter(t => t.type === 'expense');
    const totals = {};
    txs.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return totals;
  },

  persist() {
    try {
      localStorage.setItem('fd_state', JSON.stringify({
        transactions: this.transactions,
        filters: this.filters,
        role: this.role,
        theme: this.theme,
        card: this.card,
      }));
    } catch (e) { /* localStorage unavailable */ }
  },

  init() {
    try {
      const raw = localStorage.getItem('fd_state');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.transactions) && data.transactions.length > 0) {
          // Ensure amounts are numbers (guard against stringified values)
          this.transactions = data.transactions.map(t => ({ ...t, amount: parseFloat(t.amount) || 0 }));
          if (data.filters) this.filters = { ...this.filters, ...data.filters };
          if (data.role)    this.role    = data.role;
          if (data.theme)   this.theme   = data.theme;
          if (data.card)    this.card    = { ...this.card, ...data.card };
          return;
        }
      }
    } catch (e) { /* corrupt data — fall through */ }
    this.transactions = generateSeedData();
    this.persist();
  },
};


const Controller = {
  toggleTheme() {
    State.theme = State.theme === 'light' ? 'dark' : 'light';
    Renderer.applyTheme();
    State.persist();
    Renderer.renderCharts();
  },

  toggleSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active', sidebar.classList.contains('open'));
  },

  setRole(role) {
    State.role = role;
    State.persist();
    Renderer.applyRole();
    Renderer.renderTransactions();
  },

  applyFilters() {
    State.filters.from     = document.getElementById('filter-from').value     || null;
    State.filters.to       = document.getElementById('filter-to').value       || null;
    State.filters.category = document.getElementById('filter-category').value || 'all';
    State.filters.type     = document.getElementById('filter-type').value     || 'all';
    Renderer.render();
  },

  resetFilters() {
    State.filters = { from: null, to: null, category: 'all', type: 'all' };
    document.getElementById('filter-from').value     = '';
    document.getElementById('filter-to').value       = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-type').value     = 'all';
    Renderer.render();
  },

  openAddModal() {
    document.getElementById('transaction-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('modal-title').textContent = 'Add Transaction';
    _clearFormErrors();
    document.getElementById('transaction-modal').showModal();
  },

  closeModal() {
    document.getElementById('transaction-modal').close();
  },

  addTransaction(data) {
    const errors = _validateTransaction(data);
    if (Object.keys(errors).length) return errors;
    State.transactions.push({
      id: uid(),
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
    });
    State.persist();
    Renderer.render();
    return null;
  },

  editTransaction(id) {
    const tx = State.transactions.find(t => t.id === id);
    if (!tx) return;
    document.getElementById('edit-id').value          = tx.id;
    document.getElementById('form-description').value = tx.description;
    document.getElementById('form-amount').value      = tx.amount;
    document.getElementById('form-type').value        = tx.type;
    document.getElementById('form-category').value    = tx.category;
    document.getElementById('form-date').value        = tx.date;
    document.getElementById('modal-title').textContent = 'Edit Transaction';
    _clearFormErrors();
    document.getElementById('transaction-modal').showModal();
  },

  saveEdit(id, data) {
    const errors = _validateTransaction(data);
    if (Object.keys(errors).length) return errors;
    const idx = State.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    State.transactions[idx] = {
      ...State.transactions[idx],
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
    };
    State.persist();
    Renderer.render();
    return null;
  },

  deleteTransaction(id) {
    State.transactions = State.transactions.filter(t => t.id !== id);
    State.persist();
    Renderer.render();
  },

  exportCSV() {
    const txs = State.filteredTransactions();
    const header = ['id', 'description', 'amount', 'type', 'category', 'date'];
    const escape = v => `"${String(v).replace(/"/g, '""')}"`;
    const rows = txs.map(t => header.map(k => escape(t[k])).join(','));
    _download([header.join(','), ...rows].join('\n'), 'transactions.csv', 'text/csv');
  },

  exportJSON() {
    _download(JSON.stringify(State.filteredTransactions(), null, 2), 'transactions.json', 'application/json');
  },
};


function _validateTransaction(data) {
  const errors = {};
  if (!data.description || !data.description.trim()) errors.description = 'Description is required.';
  if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0)
    errors.amount = 'Enter a valid positive amount.';
  if (!data.type)     errors.type     = 'Select a type.';
  if (!data.category) errors.category = 'Select a category.';
  if (!data.date)     errors.date     = 'Select a date.';
  return errors;
}

function _clearFormErrors() {
  ['description','amount','type','category','date'].forEach(f => {
    const el  = document.getElementById('form-' + f);
    const err = document.getElementById('err-' + f);
    if (el)  el.classList.remove('invalid');
    if (err) err.textContent = '';
  });
}

function _showFormErrors(errors) {
  _clearFormErrors();
  Object.entries(errors).forEach(([field, msg]) => {
    const el  = document.getElementById('form-' + field);
    const err = document.getElementById('err-' + field);
    if (el)  el.classList.add('invalid');
    if (err) err.textContent = msg;
  });
}

function _download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


const Renderer = {
  render() {
    this.renderSummaryCards();
    this.renderCreditCard();
    this.renderRecentTransactions();
    this.renderCharts();
    this.renderTransactions();
    this.renderInsights();
    this.renderFilterOptions();
    this.applyRole();
    this.applyTheme();
  },

  renderSummaryCards() {
    const { balance, income, expenses } = State.summary();
    document.getElementById('val-balance').textContent  = fmt(balance);
    document.getElementById('val-income').textContent   = fmt(income);
    document.getElementById('val-expenses').textContent = fmt(expenses);
  },

  renderCreditCard() {
    const { number, holder, expiry, network } = State.card;
    document.getElementById('cc-number').textContent      = `**** **** **** ${number}`;
    document.getElementById('cc-holder-name').textContent = holder.toUpperCase();
    document.getElementById('cc-expiry').textContent      = expiry;
    const logo = document.getElementById('cc-network-logo');
    logo.src = network === 'mastercard' ? 'images/master card.png' : 'images/visa.png';
    logo.alt = network;
  },

  renderRecentTransactions() {
    const list = document.getElementById('recent-transactions-list');
    const txs  = State.filteredTransactions().slice(-5).reverse();
    if (!txs.length) {
      list.innerHTML = `<li class="empty-state"><span class="material-icons-sharp">inbox</span><p>No transactions yet</p></li>`;
      return;
    }
    list.innerHTML = txs.map(tx => `
      <li class="recent-item">
        <img src="${CATEGORY_IMAGES[tx.category] || CATEGORY_IMAGES.Other}" alt="${tx.category}">
        <div class="recent-item-info">
          <strong>${_esc(tx.description)}</strong>
          <small>${fmtDate(tx.date)}</small>
        </div>
        <span class="recent-item-amount ${tx.type}">${tx.type === 'income' ? '+' : '-'}${fmt(tx.amount)}</span>
      </li>`).join('');
  },

  renderCharts() {
    this._destroyChart('trend');
    this._destroyChart('breakdown');

    const isDark    = State.theme === 'dark';
    const textColor = isDark ? '#edeffd' : '#363949';
    const gridColor = isDark ? '#2a2d35' : '#e0e0e0';

    // Balance Trend (line)
    const trend    = State.monthlyTrend();
    const trendCtx = document.getElementById('chart-trend');
    if (trendCtx) {
      State._charts.trend = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: trend.map(t => t.month),
          datasets: [{
            label: 'Balance',
            data: trend.map(t => t.balance),
            borderColor: '#7380ec',
            backgroundColor: 'rgba(115,128,236,0.12)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#7380ec', pointRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: { beginAtZero: false, grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    const totals       = State.categoryTotals();
    const labels       = Object.keys(totals);
    const values       = Object.values(totals);
    const breakdownCtx = document.getElementById('chart-breakdown');
    const emptyEl      = document.getElementById('breakdown-empty');

    if (!labels.length) {
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    if (emptyEl) emptyEl.classList.add('hidden');

    if (breakdownCtx) {
      State._charts.breakdown = new Chart(breakdownCtx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: CHART_COLORS, hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: textColor, boxWidth: 12, padding: 12 } },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.parsed)}` } }
          },
          cutout: '65%',
        }
      });
    }
  },

  _destroyChart(key) {
    if (State._charts[key]) { State._charts[key].destroy(); delete State._charts[key]; }
  },

  renderTransactions() {
    const tbody   = document.getElementById('transactions-tbody');
    const txs     = State.filteredTransactions();
    const isAdmin = State.role === 'admin';

    if (!txs.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state">
        <span class="material-icons-sharp">inbox</span><p>No transactions found</p></div></td></tr>`;
      return;
    }

    const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date));
    tbody.innerHTML = sorted.map(tx => `
      <tr>
        <td><img class="tx-img" src="${CATEGORY_IMAGES[tx.category] || CATEGORY_IMAGES.Other}" alt="${tx.category}"></td>
        <td class="tx-desc">${_esc(tx.description)}</td>
        <td><span class="tx-category">${_esc(tx.category)}</span></td>
        <td class="tx-date">${fmtDate(tx.date)}</td>
        <td class="tx-amount ${tx.type}">${tx.type === 'income' ? '+' : '-'}${fmt(tx.amount)}</td>
        <td class="admin-only${isAdmin ? '' : ' hidden'}">
          <div class="tx-actions">
            <button class="tx-edit btn-icon" data-id="${tx.id}" title="Edit">
              <span class="material-icons-sharp">edit</span>
            </button>
            <button class="tx-delete btn-icon" data-id="${tx.id}" title="Delete">
              <span class="material-icons-sharp">delete</span>
            </button>
          </div>
        </td>
      </tr>`).join('');
  },

  renderInsights() {
    const totals = State.categoryTotals();
    const { income, expenses } = State.summary();

    
    const topCatEl = document.getElementById('insight-top-cat-val');
    const entries  = Object.entries(totals);
    topCatEl.textContent = entries.length
      ? (() => { const [cat, amt] = entries.reduce((a, b) => b[1] > a[1] ? b : a); return `${cat} (${fmt(amt)})`; })()
      : '—';

    
    const momEl  = document.getElementById('insight-mom-val');
    const now    = new Date();
    const prev   = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisM  = State.transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
    const lastM  = State.transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === prev.getMonth() && new Date(t.date).getFullYear() === prev.getFullYear()).reduce((s, t) => s + t.amount, 0);
    if (lastM === 0) {
      momEl.textContent = '—';
      momEl.style.color = '';
    } else {
      const pct = ((thisM - lastM) / lastM * 100).toFixed(1);
      momEl.textContent = `${pct > 0 ? '+' : ''}${pct}%`;
      momEl.style.color = pct > 0 ? 'var(--color-danger)' : 'var(--color-success)';
    }

    
    const ratioEl = document.getElementById('insight-ratio-val');
    ratioEl.textContent = expenses === 0 ? '—' : (income / expenses).toFixed(2);
  },

  renderFilterOptions() {
    const sel     = document.getElementById('filter-category');
    const current = sel.value;
    sel.innerHTML = '<option value="all">All Categories</option>';
    CATEGORIES.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      if (cat === current) opt.selected = true;
      sel.appendChild(opt);
    });
    if (State.filters.from)     document.getElementById('filter-from').value     = State.filters.from;
    if (State.filters.to)       document.getElementById('filter-to').value       = State.filters.to;
    if (State.filters.category) document.getElementById('filter-category').value = State.filters.category;
    if (State.filters.type)     document.getElementById('filter-type').value     = State.filters.type;
  },

  applyRole() {
    const isAdmin = State.role === 'admin';
    document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !isAdmin));
  },

  applyTheme() {
    const isDark = State.theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  },
};


document.addEventListener('DOMContentLoaded', () => {
  
  try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); }
  catch (e) { document.getElementById('storage-banner').classList.remove('hidden'); }

  
  try {
    const raw = localStorage.getItem('fd_state');
    if (raw) {
      const data = JSON.parse(raw);
      // If no transactions or amounts look wrong, reset
      if (!Array.isArray(data.transactions) || data.transactions.length === 0) {
        localStorage.removeItem('fd_state');
      }
    }
  } catch(e) { localStorage.removeItem('fd_state'); }

  State.init();
  Renderer.render();

  
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetEl = document.getElementById('greeting-text');
  if (greetEl) greetEl.textContent = `${greet}, John 👋`;

 
  document.getElementById('role-select').value = State.role;

  
  document.getElementById('theme-toggle').addEventListener('click', () => Controller.toggleTheme());

  
  document.getElementById('menu-btn').addEventListener('click', () => Controller.toggleSidebar());

  
  document.getElementById('role-select').addEventListener('change', e => Controller.setRole(e.target.value));

  
  ['filter-from','filter-to','filter-category','filter-type'].forEach(id =>
    document.getElementById(id).addEventListener('change', () => Controller.applyFilters())
  );
  document.getElementById('filter-reset').addEventListener('click', () => Controller.resetFilters());

  
  document.getElementById('add-transaction-btn').addEventListener('click', () => Controller.openAddModal());

 
  document.getElementById('modal-close').addEventListener('click',  () => Controller.closeModal());
  document.getElementById('modal-cancel').addEventListener('click', () => Controller.closeModal());
  document.getElementById('transaction-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) Controller.closeModal();
  });

  
  document.getElementById('transaction-form').addEventListener('submit', e => {
    e.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const data = {
      description: document.getElementById('form-description').value,
      amount:      document.getElementById('form-amount').value,
      type:        document.getElementById('form-type').value,
      category:    document.getElementById('form-category').value,
      date:        document.getElementById('form-date').value,
    };
    const errors = editId ? Controller.saveEdit(editId, data) : Controller.addTransaction(data);
    if (errors) _showFormErrors(errors);
    else Controller.closeModal();
  });

  
  document.getElementById('transactions-tbody').addEventListener('click', e => {
    const editBtn   = e.target.closest('.tx-edit');
    const deleteBtn = e.target.closest('.tx-delete');
    if (editBtn)   Controller.editTransaction(editBtn.dataset.id);
    if (deleteBtn) Controller.deleteTransaction(deleteBtn.dataset.id);
  });

  
  document.getElementById('export-csv-btn').addEventListener('click',  () => Controller.exportCSV());
  document.getElementById('export-json-btn').addEventListener('click', () => Controller.exportJSON());

  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const view = link.dataset.view;

      
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      
      document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
      const target = document.getElementById('view-' + view);
      if (target) target.classList.remove('hidden');

      
      if (view === 'analytics') {
        const { balance, income, expenses } = State.summary();
        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v); };
        setVal('val-balance-a', balance);
        setVal('val-income-a', income);
        setVal('val-expenses-a', expenses);
        Renderer.renderCharts();
      }

      
      if (view === 'settings') {
        const themeBtn = document.getElementById('settings-theme-toggle');
        if (themeBtn) themeBtn.classList.toggle('on', State.theme === 'dark');
        const roleEl = document.getElementById('settings-role-select');
        if (roleEl) roleEl.value = State.role;
        const card = State.card;
        const setInput = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        setInput('settings-card-holder',  card.holder);
        setInput('settings-card-number',  card.number);
        setInput('settings-card-expiry',  card.expiry);
        setInput('settings-card-network', card.network);
      }

      
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
      }
    });
  });

 
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  });

  
  const settingsThemeBtn = document.getElementById('settings-theme-toggle');
  if (settingsThemeBtn) {
    settingsThemeBtn.addEventListener('click', () => {
      Controller.toggleTheme();
      settingsThemeBtn.classList.toggle('on', State.theme === 'dark');
    });
  }

  // Settings — role select
  const settingsRoleEl = document.getElementById('settings-role-select');
  if (settingsRoleEl) {
    settingsRoleEl.addEventListener('change', e => {
      Controller.setRole(e.target.value);
      document.getElementById('role-select').value = e.target.value;
    });
  }

  
  const saveCardBtn = document.getElementById('settings-save-card');
  if (saveCardBtn) {
    saveCardBtn.addEventListener('click', () => {
      State.card.holder  = document.getElementById('settings-card-holder').value  || State.card.holder;
      State.card.number  = document.getElementById('settings-card-number').value  || State.card.number;
      State.card.expiry  = document.getElementById('settings-card-expiry').value  || State.card.expiry;
      State.card.network = document.getElementById('settings-card-network').value || State.card.network;
      State.persist();
      Renderer.renderCreditCard();
      saveCardBtn.textContent = '✓ Saved!';
      setTimeout(() => { saveCardBtn.innerHTML = '<span class="material-icons-sharp">save</span> Save Card'; }, 1500);
    });
  }

  
  const resetDataBtn = document.getElementById('settings-reset-data');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      if (!confirm('Reset all transactions to demo data?')) return;
      State.transactions = generateSeedData();
      State.filters = { from: null, to: null, category: 'all', type: 'all' };
      State.persist();
      Renderer.render();
    });
  }
});
