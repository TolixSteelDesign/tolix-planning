*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f8f7f4;
  --surface: #ffffff;
  --border: #e5e2d9;
  --border-light: #f0ede6;
  --text-primary: #1a1917;
  --text-secondary: #6b6860;
  --text-muted: #9c9a94;
  --accent: #1a1917;
  --green: #1d6f42;
  --green-bg: #e8f4ee;
  --red: #9b2626;
  --red-bg: #fceaea;
  --orange: #9a4a0a;
  --orange-bg: #fef0e4;
  --blue: #1a4a7a;
  --blue-bg: #e8f0fa;
  --radius: 8px;
  --radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.08);
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  padding: 6px 14px;
  border-radius: var(--radius);
  transition: background 0.15s, border-color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
button:hover { background: var(--bg); border-color: #ccc; }
button.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
button.primary:hover { background: #333; }
button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

input, select {
  font-family: inherit;
  font-size: 13px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: var(--radius);
  outline: none;
}
input:focus, select:focus { border-color: #aaa; }

table { width: 100%; border-collapse: collapse; }
th { font-weight: 500; color: var(--text-secondary); text-align: left; padding: 8px 12px; font-size: 12px; }
td { padding: 8px 12px; font-size: 13px; border-top: 1px solid var(--border-light); }

.badge {
  display: inline-flex; align-items: center; padding: 2px 8px;
  border-radius: 99px; font-size: 11px; font-weight: 500;
}
.badge.green { background: var(--green-bg); color: var(--green); }
.badge.red { background: var(--red-bg); color: var(--red); }
.badge.orange { background: var(--orange-bg); color: var(--orange); }
.badge.blue { background: var(--blue-bg); color: var(--blue); }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
}
.stat-card .label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
.stat-card .value { font-size: 20px; font-weight: 600; }

.section-header {
  padding: 10px 16px;
  background: #fafaf8;
  border-bottom: 1px solid var(--border-light);
  display: flex; align-items: center; justify-content: space-between;
}

.empty-state {
  text-align: center; padding: 3rem; color: var(--text-muted);
  border: 1.5px dashed var(--border); border-radius: var(--radius-lg);
}
