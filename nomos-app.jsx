const { useState, useMemo, useCallback } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie } = Recharts;

// ─── UTILITIES ──────────────────────────────────────────────
const fmt = (n) => {
  if (n === null || n === undefined) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};
const pct = (n) => n === null || n === undefined ? '—' : `${Math.round(n * 100)}%`;
const severityColor = (sev) => ({
  critical: '#ef4444', warning: '#f59e0b', info: '#6b7280', positive: '#10b981'
}[sev] || '#6b7280');
const dcrColor = (dcr) => {
  if (dcr >= 0.75) return '#10b981';
  if (dcr >= 0.50) return '#f59e0b';
  if (dcr >= 0.30) return '#f97316';
  return '#ef4444';
};
const dcrLabel = (dcr) => {
  if (dcr >= 0.75) return 'COMPLIANT';
  if (dcr >= 0.50) return 'REVIEW';
  if (dcr >= 0.30) return 'WARNING';
  return 'CRITICAL';
};

// ─── STYLES ─────────────────────────────────────────────────
const FONT = "'IBM Plex Mono', 'SF Mono', 'Fira Code', monospace";
const SANS = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif";
const C = {
  bg: '#0a0f14',
  surface: '#111820',
  surfaceHover: '#1a2230',
  border: '#1e2a38',
  borderLight: '#2a3a4e',
  text: '#e2e8f0',
  textDim: '#8899aa',
  textMuted: '#5a6a7a',
  accent: '#00d4aa',
  accentDim: 'rgba(0,212,170,0.15)',
  accentBorder: 'rgba(0,212,170,0.3)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.15)',
  yellow: '#f59e0b',
  yellowDim: 'rgba(245,158,11,0.15)',
  green: '#10b981',
  orange: '#f97316',
};

// ─── COMPONENTS ─────────────────────────────────────────────

function Badge({ severity, children }) {
  const bg = severity === 'critical' ? C.redDim : severity === 'warning' ? C.yellowDim : severity === 'positive' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)';
  const color = severityColor(severity);
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontFamily: FONT, fontWeight: 600, background: bg, color, border: `1px solid ${color}33`, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px 20px', flex: 1, minWidth: 140 }}>
      <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: accent || C.accent, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT, fontSize: 11, color: C.textDim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SourceLink({ source }) {
  if (!source) return null;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 3, border: `1px solid ${C.border}` }}>
      <span style={{ color: C.accent }}>⬡</span> {source.type.toUpperCase()} · EIN {source.ein} · {source.taxYear}
    </a>
  );
}

// ─── NAV ────────────────────────────────────────────────────
function Nav({ view, setView, onBack }) {
  const items = [
    { id: 'ledger', label: 'Ledger', icon: '▦' },
    { id: 'compare', label: 'Compare', icon: '⇌' },
    { id: 'methodology', label: 'Methodology', icon: '◈' },
  ];
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="https://nomosanalytics.com" style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.accent, textDecoration: 'none', letterSpacing: '2px' }}>NOMOS<span style={{ color: C.textMuted }}>.ANALYTICS</span></a>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, color: C.textDim, fontFamily: FONT, fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>← Back</button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            background: view === item.id ? C.accentDim : 'transparent',
            border: view === item.id ? `1px solid ${C.accentBorder}` : '1px solid transparent',
            borderRadius: 4, padding: '6px 14px', cursor: 'pointer',
            fontFamily: FONT, fontSize: 12, color: view === item.id ? C.accent : C.textDim,
            transition: 'all 0.15s'
          }}>
            <span style={{ marginRight: 6 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── LEDGER VIEW ────────────────────────────────────────────
function LedgerView({ data, onSelectOrg }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dcr');
  const [sortDir, setSortDir] = useState('asc');

  const orgs = useMemo(() => {
    let list = data.intermediaries.map(org => {
      const latest = org.filings[org.filings.length - 1];
      const prev = org.filings.length > 1 ? org.filings[org.filings.length - 2] : null;
      const dcrTrend = prev ? latest.dcr - prev.dcr : 0;
      return { ...org, latest, prev, dcrTrend };
    });
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => o.name.toLowerCase().includes(q) || o.region.toLowerCase().includes(q) || o.type.toLowerCase().includes(q) || o.ein.includes(q));
    }
    list.sort((a, b) => {
      let av, bv;
      if (sortBy === 'dcr') { av = a.latest.dcr; bv = b.latest.dcr; }
      else if (sortBy === 'revenue') { av = a.latest.totalRevenue; bv = b.latest.totalRevenue; }
      else if (sortBy === 'name') { av = a.name; bv = b.name; }
      else if (sortBy === 'grants') { av = a.latest.grantsToFounders; bv = b.latest.grantsToFounders; }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [data, search, sortBy, sortDir]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir(col === 'name' ? 'asc' : 'asc'); }
  };

  const SortHeader = ({ col, children, align }) => (
    <th onClick={() => toggleSort(col)} style={{ padding: '10px 12px', fontFamily: FONT, fontSize: 10, fontWeight: 600, color: sortBy === col ? C.accent : C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', textAlign: align || 'left', userSelect: 'none', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
      {children} {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* System overview */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="PA System Average DCR" value={pct(data.systemStats.averageDCR)} sub={`${data.systemStats.totalIntermediariesTracked} intermediaries tracked`} accent={dcrColor(data.systemStats.averageDCR)} />
        <StatCard label="State Appropriation" value={fmt(data.systemStats.totalStateAppropriation)} sub="BFTDA Annual Budget" />
        <StatCard label="Below 75% Target" value={`${data.systemStats.pctBelowTarget}%`} sub="of tracked intermediaries" accent={C.red} />
        <StatCard label="Pittsburgh Compact" value="75%" sub="Direct-to-founder target" accent={C.accent} />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text" placeholder="Search by name, EIN, region, or type..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 480, padding: '10px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: FONT, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: `1px solid ${C.border}`, borderRadius: 6 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: C.surface }}>
          <thead>
            <tr>
              <SortHeader col="name">Organization</SortHeader>
              <th style={{ padding: '10px 12px', fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>Type</th>
              <SortHeader col="revenue" align="right">Revenue</SortHeader>
              <SortHeader col="grants" align="right">To Founders</SortHeader>
              <SortHeader col="dcr" align="center">DCR</SortHeader>
              <th style={{ padding: '10px 12px', fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>Trend</th>
              <th style={{ padding: '10px 12px', fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((org, i) => (
              <tr key={org.id} onClick={() => onSelectOrg(org.id)}
                style={{ cursor: 'pointer', borderBottom: i < orgs.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px', fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>
                  {org.name}
                  <div style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, marginTop: 2 }}>EIN {org.ein} · {org.region}</div>
                </td>
                <td style={{ padding: '12px', fontFamily: FONT, fontSize: 11, color: C.textDim }}>{org.type}</td>
                <td style={{ padding: '12px', fontFamily: FONT, fontSize: 13, color: C.text, textAlign: 'right' }}>{fmt(org.latest.totalRevenue)}</td>
                <td style={{ padding: '12px', fontFamily: FONT, fontSize: 13, color: C.text, textAlign: 'right' }}>{fmt(org.latest.grantsToFounders)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: dcrColor(org.latest.dcr) }}>{pct(org.latest.dcr)}</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontFamily: FONT, fontSize: 12 }}>
                  <span style={{ color: org.dcrTrend > 0 ? C.green : org.dcrTrend < 0 ? C.red : C.textMuted }}>
                    {org.dcrTrend > 0 ? '▲' : org.dcrTrend < 0 ? '▼' : '—'} {org.dcrTrend !== 0 ? `${Math.abs(Math.round(org.dcrTrend * 100))}pt` : ''}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <Badge severity={org.latest.dcr < 0.30 ? 'critical' : org.latest.dcr < 0.50 ? 'warning' : org.latest.dcr >= 0.75 ? 'positive' : 'info'}>
                    {dcrLabel(org.latest.dcr)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, marginTop: 12, textAlign: 'right' }}>
        Data sourced from IRS Form 990 filings via ProPublica Nonprofit Explorer · Last updated {data.metadata.lastUpdated}
      </div>
    </div>
  );
}

// ─── ORG PROFILE ────────────────────────────────────────────
function OrgProfile({ org, data }) {
  const latest = org.filings[org.filings.length - 1];
  const dcrHistory = org.filings.map(f => ({ year: f.fiscalYear, dcr: Math.round(f.dcr * 100), target: 75 }));
  const expenseBreakdown = [
    { name: 'To Founders', value: latest.grantsToFounders, fill: C.accent },
    { name: 'Personnel', value: latest.personnelCosts, fill: '#6366f1' },
    { name: 'Operating', value: latest.operatingExpenses, fill: '#8b5cf6' },
    { name: 'Other', value: latest.otherExpenses, fill: C.textMuted },
  ];
  const revenueHistory = org.filings.map(f => ({
    year: f.fiscalYear,
    revenue: f.totalRevenue / 1000000,
    toFounders: f.grantsToFounders / 1000000,
    personnel: f.personnelCosts / 1000000,
  }));

  const criticalFlags = org.flags.filter(f => f.severity === 'critical');
  const warningFlags = org.flags.filter(f => f.severity === 'warning');
  const infoFlags = org.flags.filter(f => f.severity === 'info' || f.severity === 'positive');

  return (
    <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>{org.name}</h1>
            <div style={{ fontFamily: FONT, fontSize: 12, color: C.textDim, marginTop: 4 }}>
              EIN {org.ein} · {org.region} · {org.type}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 800, color: dcrColor(latest.dcr), lineHeight: 1 }}>{pct(latest.dcr)}</div>
            <div style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, marginTop: 4 }}>DCR · {latest.fiscalYear}</div>
          </div>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, lineHeight: 1.6, marginTop: 12, maxWidth: 700 }}>{org.description}</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Total Revenue" value={fmt(latest.totalRevenue)} sub={latest.fiscalYear} />
        <StatCard label="To Founders" value={fmt(latest.grantsToFounders)} sub={`${pct(latest.grantsToFounders / latest.totalRevenue)} of revenue`} accent={C.accent} />
        <StatCard label="Personnel" value={fmt(latest.personnelCosts)} sub={`${latest.personnelToGrantRatio.toFixed(2)}x founder grants`} accent={latest.personnelToGrantRatio > 1 ? C.red : C.textDim} />
        <StatCard label="Net Assets" value={fmt(latest.netAssets)} sub={latest.boardDesignatedReserves ? `${fmt(latest.boardDesignatedReserves)} board-designated` : ''} />
      </div>

      {/* Flags */}
      {(criticalFlags.length > 0 || warningFlags.length > 0) && (
        <div style={{ background: criticalFlags.length > 0 ? C.redDim : C.yellowDim, border: `1px solid ${criticalFlags.length > 0 ? C.red : C.yellow}33`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
          <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: criticalFlags.length > 0 ? C.red : C.yellow, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
            ⚑ {criticalFlags.length + warningFlags.length} Flag{criticalFlags.length + warningFlags.length > 1 ? 's' : ''} Detected
          </div>
          {[...criticalFlags, ...warningFlags].map((flag, i) => (
            <div key={i} style={{ fontFamily: SANS, fontSize: 13, color: C.text, marginBottom: i < criticalFlags.length + warningFlags.length - 1 ? 8 : 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: severityColor(flag.severity), flexShrink: 0 }}>●</span>
              <span>{flag.text} <span style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted }}>({flag.detectedDate})</span></span>
            </div>
          ))}
        </div>
      )}

      {infoFlags.length > 0 && (
        <div style={{ background: 'rgba(107,114,128,0.08)', border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
          {infoFlags.map((flag, i) => (
            <div key={i} style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: i < infoFlags.length - 1 ? 6 : 0, display: 'flex', gap: 8 }}>
              <span style={{ color: severityColor(flag.severity), flexShrink: 0 }}>●</span>
              <span>{flag.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* DCR trend */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
          <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>DCR Trend vs. 75% Target</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dcrHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} stroke={C.border} />
              <YAxis domain={[0, 100]} tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} stroke={C.border} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: FONT, fontSize: 11 }} formatter={v => [`${v}%`]} />
              <ReferenceLine y={75} stroke={C.accent} strokeDasharray="6 3" label={{ value: '75% target', fill: C.accent, fontSize: 10, fontFamily: FONT, position: 'right' }} />
              <Line type="monotone" dataKey="dcr" stroke={dcrColor(latest.dcr)} strokeWidth={2} dot={{ fill: dcrColor(latest.dcr), r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
          <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Expense Breakdown — {latest.fiscalYear}</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {expenseBreakdown.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: FONT, fontSize: 11 }} formatter={v => [fmt(v)]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {expenseBreakdown.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT, fontSize: 10, color: C.textDim }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: e.fill, display: 'inline-block' }} /> {e.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue vs disbursements over time */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Revenue vs. Founder Disbursements vs. Personnel ($M)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} stroke={C.border} />
            <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} stroke={C.border} tickFormatter={v => `$${v}M`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: FONT, fontSize: 11 }} formatter={v => [`$${v.toFixed(1)}M`]} />
            <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 10 }} />
            <Bar dataKey="revenue" name="Total Revenue" fill={C.borderLight} radius={[2,2,0,0]} />
            <Bar dataKey="toFounders" name="To Founders" fill={C.accent} radius={[2,2,0,0]} />
            <Bar dataKey="personnel" name="Personnel" fill="#6366f1" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filing history */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Filing History</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Year', 'Revenue', 'Gov Grants', 'To Founders', 'Personnel', 'DCR', 'P:G Ratio', 'Source'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: h === 'Year' || h === 'Source' ? 'left' : 'right', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {org.filings.map((f, i) => (
                <tr key={i} style={{ borderBottom: i < org.filings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: C.text }}>{f.fiscalYear}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: C.text, textAlign: 'right' }}>{fmt(f.totalRevenue)}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: C.text, textAlign: 'right' }}>{fmt(f.governmentGrants)}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: C.accent, textAlign: 'right', fontWeight: 600 }}>{fmt(f.grantsToFounders)}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: f.personnelToGrantRatio > 1 ? C.red : C.text, textAlign: 'right' }}>{fmt(f.personnelCosts)}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: dcrColor(f.dcr), textAlign: 'right' }}>{pct(f.dcr)}</td>
                  <td style={{ padding: '8px 10px', fontFamily: FONT, fontSize: 12, color: f.personnelToGrantRatio > 1 ? C.red : C.textDim, textAlign: 'right' }}>{f.personnelToGrantRatio.toFixed(2)}x</td>
                  <td style={{ padding: '8px 10px' }}><SourceLink source={f.source} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── COMPARE VIEW ───────────────────────────────────────────
function CompareView({ data, onSelectOrg }) {
  const ranked = useMemo(() => {
    return data.intermediaries.map(org => {
      const latest = org.filings[org.filings.length - 1];
      return { ...org, latest };
    }).sort((a, b) => b.latest.dcr - a.latest.dcr);
  }, [data]);

  const chartData = ranked.map(org => ({
    name: org.name.length > 25 ? org.name.slice(0, 22) + '...' : org.name,
    fullName: org.name,
    dcr: Math.round(org.latest.dcr * 100),
    id: org.id
  }));

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>DCR Comparison — All Tracked Intermediaries</h2>
        <p style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 4 }}>Ranked by Direct Capital Ratio. Pittsburgh Compact target: 75%.</p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={Math.max(300, ranked.length * 48)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 180 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} stroke={C.border} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fill: C.textDim, fontSize: 11, fontFamily: FONT }} stroke={C.border} width={175} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: FONT, fontSize: 11 }} formatter={(v, n, props) => [`${v}%`, props.payload.fullName]} />
            <ReferenceLine x={75} stroke={C.accent} strokeDasharray="6 3" label={{ value: '75%', fill: C.accent, fontSize: 10, fontFamily: FONT }} />
            <Bar dataKey="dcr" radius={[0, 3, 3, 0]} cursor="pointer" onClick={(d) => onSelectOrg(d.id)}>
              {chartData.map((entry, i) => <Cell key={i} fill={dcrColor(entry.dcr / 100)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick comparison cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {ranked.map(org => (
          <div key={org.id} onClick={() => onSelectOrg(org.id)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accentBorder}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{org.name}</div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted }}>{org.region}</div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: dcrColor(org.latest.dcr) }}>{pct(org.latest.dcr)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, fontFamily: FONT, fontSize: 10, color: C.textDim }}>
              <span>Rev: {fmt(org.latest.totalRevenue)}</span>
              <span>·</span>
              <span style={{ color: C.accent }}>Founders: {fmt(org.latest.grantsToFounders)}</span>
              <span>·</span>
              <span style={{ color: org.latest.personnelToGrantRatio > 1 ? C.red : C.textDim }}>P:G {org.latest.personnelToGrantRatio.toFixed(1)}x</span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {org.flags.filter(f => f.severity === 'critical' || f.severity === 'warning').slice(0, 2).map((flag, i) => (
                <Badge key={i} severity={flag.severity}>{flag.type.replace(/_/g, ' ')}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── METHODOLOGY ────────────────────────────────────────────
function MethodologyView() {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>{title}</h3>
      <div style={{ fontFamily: SANS, fontSize: 14, color: C.textDim, lineHeight: 1.8 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Methodology</h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.textDim, marginTop: 8 }}>
          How Nomos calculates the Direct Capital Ratio and what the numbers mean.
        </p>
      </div>

      <Section title="Direct Capital Ratio (DCR)">
        <div style={{ background: C.surface, border: `1px solid ${C.accentBorder}`, borderRadius: 6, padding: 20, marginBottom: 16, fontFamily: FONT, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>FORMULA</div>
          <div style={{ fontSize: 18, color: C.accent }}>
            DCR = <span style={{ color: C.text }}>Grants & Direct Assistance to Founders</span> ÷ <span style={{ color: C.text }}>Total Government Revenue</span>
          </div>
        </div>
        <p>The DCR measures how many cents of every public dollar received by an intermediary organization are disbursed directly to founders as capital. A DCR of 0.25 (25%) means 25 cents of every dollar reaches founders, while 75 cents is absorbed by the intermediary for personnel, operations, reserves, and other costs.</p>
      </Section>

      <Section title="Thresholds">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'COMPLIANT', range: '≥ 75%', color: C.green, desc: 'Meets Pittsburgh Compact standard' },
            { label: 'REVIEW', range: '50–74%', color: C.yellow, desc: 'Below target, trending data needed' },
            { label: 'WARNING', range: '30–49%', color: C.orange, desc: 'Significant absorption, investigation warranted' },
            { label: 'CRITICAL', range: '< 30%', color: C.red, desc: 'Majority of public capital not reaching founders' },
          ].map((t, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
              <Badge severity={t.label === 'COMPLIANT' ? 'positive' : t.label === 'CRITICAL' ? 'critical' : t.label === 'WARNING' ? 'warning' : 'info'}>{t.label}</Badge>
              <div style={{ fontFamily: FONT, fontSize: 18, color: t.color, fontWeight: 700, marginTop: 8 }}>{t.range}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginTop: 4 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data Sources">
        <p><strong style={{ color: C.text }}>IRS Form 990</strong> — Annual information returns filed by tax-exempt organizations. Contains revenue, expenses, compensation, grants paid, and net asset data. Accessed via ProPublica Nonprofit Explorer API.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: C.text }}>Federal Audit Clearinghouse (FAC)</strong> — Repository for single audit reports required of entities spending $750K+ in federal awards annually. Contains findings, questioned costs, and material weakness disclosures.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: C.text }}>State Budget Documents</strong> — Pennsylvania DCED appropriation records, Ben Franklin Technology Development Authority annual reports, and program-level allocation data.</p>
      </Section>

      <Section title="Anomaly Detection">
        <p>Nomos flags anomalies automatically based on the following rules:</p>
        <div style={{ marginTop: 12 }}>
          {[
            { flag: 'declining_dcr', desc: 'DCR decreases by more than 5 percentage points over any 3-year window' },
            { flag: 'personnel_exceeds_grants', desc: 'Personnel costs exceed total founder disbursements (P:G ratio > 1.0)' },
            { flag: 'reserve_accumulation', desc: 'Board-designated reserves grow while DCR declines' },
            { flag: 'recycled_capital_unverifiable', desc: 'Claims of recycled capital returns cannot be independently verified in FAC filings' },
            { flag: 'subsidiary_audit_scope', desc: 'Subsidiary operations audited under non-GAGAS standards, limiting comparability' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <code style={{ fontFamily: FONT, fontSize: 10, color: C.accent, background: C.accentDim, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.flag}</code>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.textDim }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Limitations & Accountability">
        <p>Nomos relies on publicly filed documents. All figures are traceable to a specific 990 filing or FAC submission — no derived estimates, no model-generated numbers. Where data is unavailable or ambiguous, Nomos marks it explicitly rather than interpolating.</p>
        <p style={{ marginTop: 12 }}>The DCR is a diagnostic metric, not a verdict. Some intermediaries (e.g., MEP consulting partners) have structurally low DCRs by design. Context matters, and Nomos surfaces that context alongside the numbers.</p>
        <p style={{ marginTop: 12 }}>Corrections are public. If any figure on this platform is demonstrated to be inaccurate, we correct it and publish the correction with a timestamp.</p>
      </Section>

      <Section title="The Pittsburgh Compact">
        <p>The 75% DCR target comes from the Pittsburgh Compact, a policy proposal recommending that at least 75 cents of every state innovation dollar be disbursed directly to founders as capital. The Compact frames this not as a punitive standard but as a design benchmark — a system should be optimized so that the majority of public investment reaches its intended recipients.</p>
        <p style={{ marginTop: 12 }}>Currently, no tracked intermediary in Pennsylvania meets this standard. The system average DCR is 33%.</p>
      </Section>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginTop: 24 }}>
        <div style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted }}>
          ◈ Every number on Nomos traces to a public source document. If you find an error, contact us and we will correct it publicly. This platform was built with AI tools — which is itself proof of the thesis that innovation infrastructure should cost less than it currently does.
        </div>
      </div>
    </div>
  );
}

// ─── ACCESS GATE ────────────────────────────────────────────
function AccessGate({ onAccess }) {
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const roles = ['State Legislator / Oversight', 'Federal Agency (OIG, GAO)', 'Foundation / Philanthropy', 'Journalist / Researcher', 'Startup Founder', 'Investor', 'Other'];

  const handleSubmit = () => {
    if (email && role) {
      setSubmitted(true);
      setTimeout(() => onAccess(), 1500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.accent, letterSpacing: '3px', marginBottom: 16 }}>NOMOS<span style={{ color: C.textMuted }}>.ANALYTICS</span></div>
          <h1 style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.3 }}>Intelligence Infrastructure<br />for Public Capital</h1>
          <p style={{ fontFamily: SANS, fontSize: 14, color: C.textDim, marginTop: 12 }}>Request access to the platform. Every number traces to a public source document.</p>
        </div>

        {!submitted ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: FONT, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                placeholder="you@organization.com" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>Organization</label>
              <input type="text" value={org} onChange={e => setOrg(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: FONT, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                placeholder="Optional" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: FONT, fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>I am a... *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {roles.map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    padding: '6px 12px', borderRadius: 4, fontFamily: FONT, fontSize: 11, cursor: 'pointer',
                    background: role === r ? C.accentDim : 'transparent',
                    border: `1px solid ${role === r ? C.accentBorder : C.border}`,
                    color: role === r ? C.accent : C.textDim,
                    transition: 'all 0.15s'
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} disabled={!email || !role}
              style={{ width: '100%', padding: '12px', background: email && role ? C.accent : C.border, border: 'none', borderRadius: 4, color: email && role ? C.bg : C.textMuted, fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: email && role ? 'pointer' : 'default', letterSpacing: '1px', transition: 'all 0.15s' }}>
              REQUEST ACCESS
            </button>
          </div>
        ) : (
          <div style={{ background: C.surface, border: `1px solid ${C.accentBorder}`, borderRadius: 8, padding: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT, fontSize: 20, color: C.accent, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.text }}>Access granted. Loading platform...</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="https://nomosanalytics.com" style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>← Back to nomosanalytics.com</a>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────
function NomosApp() {
  const [hasAccess, setHasAccess] = useState(false);
  const [view, setView] = useState('ledger');
  const [selectedOrg, setSelectedOrg] = useState(null);

  const data = typeof NOMOS_DATA !== 'undefined' ? NOMOS_DATA : window.NOMOS_DATA;

  const handleSelectOrg = useCallback((orgId) => {
    setSelectedOrg(orgId);
    setView('profile');
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedOrg(null);
    setView('ledger');
  }, []);

  if (!hasAccess) {
    return <AccessGate onAccess={() => setHasAccess(true)} />;
  }

  const selectedOrgData = selectedOrg ? data.intermediaries.find(o => o.id === selectedOrg) : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Nav view={view} setView={setView} onBack={view === 'profile' ? handleBack : null} />
      {view === 'ledger' && <LedgerView data={data} onSelectOrg={handleSelectOrg} />}
      {view === 'profile' && selectedOrgData && <OrgProfile org={selectedOrgData} data={data} />}
      {view === 'compare' && <CompareView data={data} onSelectOrg={handleSelectOrg} />}
      {view === 'methodology' && <MethodologyView />}
    </div>
  );
}

window.NomosApp = NomosApp;
