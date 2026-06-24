import { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { parseERP, getECA, fmt, lisser, getISOWeekKey, COULEUR_PALETTE } from './lib/utils.js'

// ─── Icônes SVG inline ───────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
    list: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {icons[name]}
    </svg>
  )
}

// ─── Composant import fichier ────────────────────────────────────
function ImportZone({ onData }) {
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true })
      onData(rows)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      style={{
        border: `2px dashed ${dragging ? '#1a1917' : '#d0cdc6'}`,
        borderRadius: 12, padding: '3rem', textAlign: 'center',
        background: dragging ? '#f0ede6' : '#faf9f7', transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input id="file-input" type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }}
        onChange={e => handleFile(e.target.files[0])} />
      <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
      <p style={{ fontWeight: 500, marginBottom: 6 }}>Glisser votre export ERP ici</p>
      <p style={{ fontSize: 12, color: '#9c9a94' }}>ou cliquer pour sélectionner · xlsx, xls, csv</p>
    </div>
  )
}

// ─── Vue Planning ────────────────────────────────────────────────
function VuePlanning({ lignes, statuts, onToggle }) {
  const [semaine, setSemaine] = useState('')
  const [nbJours, setNbJours] = useState(5)
  const [maxECA, setMaxECA] = useState(250)

  const sems = [...new Set(lignes.map(l => l.semaine))].filter(Boolean).sort()
  const semActuelle = semaine || sems[0] || ''
  const lignesSem = lignes.filter(l => l.semaine === semActuelle)
    .map(l => ({ ...l, peint: statuts[`${l.id}||${l.ref}`] || false }))

  const totalECA = lignesSem.reduce((s, l) => s + getECA(l.ref) * l.qte, 0)
  const ecaParJour = nbJours > 0 ? totalECA / nbJours : 0
  const depasse = ecaParJour > maxECA
  const jours = lisser(lignesSem, nbJours)

  // Palette couleurs stables
  const allCouleurs = [...new Set(lignes.map(l => l.couleur))].sort()
  const couleurMap = {}
  allCouleurs.forEach((c, i) => { couleurMap[c] = COULEUR_PALETTE[i % COULEUR_PALETTE.length] })

  return (
    <div>
      {/* Contrôles */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:16 }}>
        <select value={semActuelle} onChange={e => setSemaine(e.target.value)}>
          {sems.map(s => <option key={s} value={s}>Semaine {s}</option>)}
        </select>
        <span style={{ fontSize:12, color:'#9c9a94' }}>Jours de peinture :</span>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3,4,5,6].map(n => (
            <button key={n} className={nbJours===n?'active':''} onClick={() => setNbJours(n)}
              style={{ padding:'5px 10px', minWidth:36 }}>{n}</button>
          ))}
        </div>
        <span style={{ fontSize:12, color:'#9c9a94', marginLeft:8 }}>Max ECA/j :</span>
        <input type="number" value={maxECA} onChange={e => setMaxECA(+e.target.value)}
          style={{ width:70 }} min={50} max={600} step={10}/>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:8, marginBottom:16 }}>
        {[
          { label:'Lignes', value: lignesSem.length },
          { label:'Pièces', value: lignesSem.reduce((s,l)=>s+l.qte,0) },
          { label:'ECA total', value: fmt(totalECA) },
          { label:'ECA / jour', value: fmt(ecaParJour), color: depasse?'#9b2626':'#1d6f42' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="label">{s.label}</div>
            <div className="value" style={s.color?{color:s.color}:{}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Barre de charge globale */}
      {lignesSem.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9c9a94', marginBottom:4 }}>
            <span>Charge ECA / jour</span>
            <span>{fmt(ecaParJour)} / {maxECA} ECA · {Math.round(ecaParJour/maxECA*100)}%{depasse?' ⚠ Dépasse':''}</span>
          </div>
          <div style={{ height:8, background:'#f0ede6', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${Math.min(100,ecaParJour/maxECA*100)}%`,
              background: depasse?'#c0392b': ecaParJour/maxECA>0.85?'#e67e22':'#1d9e75',
              borderRadius:99, transition:'width 0.3s' }}/>
          </div>
        </div>
      )}

      {lignesSem.length === 0 ? (
        <div className="empty-state">Aucune ligne pour cette semaine</div>
      ) : (
        <div>
          {jours.map(j => {
            const over = j.eca > maxECA
            const pct = Math.min(100, j.eca/maxECA*100)
            const barColor = over ? '#c0392b' : j.eca/maxECA > 0.85 ? '#e67e22' : '#1d9e75'
            return (
              <div key={j.jour} className="card" style={{ marginBottom:16 }}>
                {/* En-tête jour */}
                <div className="section-header">
                  <span style={{ fontWeight:600, fontSize:15 }}>Jour {j.jour}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:120, height:6, background:'#e5e2d9', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:99 }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:500, color: over?'#9b2626':barColor }}>
                      {fmt(j.eca)} ECA {over ? '⚠' : ''}
                    </span>
                  </div>
                </div>

                {/* Groupes couleur */}
                {j.groupes.sort((a,b)=>a.couleur.localeCompare(b.couleur)).map(g => {
                  const acc = couleurMap[g.couleur]
                  const nbPeintes = g.lignes.filter(l=>l.peint).length
                  return (
                    <div key={g.couleur}>
                      {/* En-tête couleur */}
                      <div style={{ padding:'8px 16px', background:'#fafaf8',
                        borderTop:'1px solid #f0ede6', borderBottom:'1px solid #f0ede6',
                        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:acc, flexShrink:0 }}/>
                          <span style={{ fontWeight:500, fontSize:13 }}>{g.couleur}</span>
                          <span style={{ fontSize:11, color:'#9c9a94' }}>{nbPeintes}/{g.lignes.length} peintes</span>
                        </div>
                        <span style={{ fontSize:12, color:'#9c9a94' }}>{fmt(g.eca)} ECA</span>
                      </div>

                      {/* Tableau lignes */}
                      <table>
                        <thead>
                          <tr style={{ background:'#fafaf8' }}>
                            <th style={{ width:'32%' }}>Désignation</th>
                            <th style={{ width:'22%' }}>Client</th>
                            <th style={{ width:'8%', textAlign:'center' }}>Qté</th>
                            <th style={{ width:'10%', textAlign:'center' }}>ECA</th>
                            <th style={{ width:'16%', textAlign:'center' }}>Date liv.</th>
                            <th style={{ width:'12%', textAlign:'center' }}>Peint</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.lignes.map((l, li) => {
                            const ecaU = getECA(l.ref)
                            const key = `${l.id}||${l.ref}`
                            return (
                              <tr key={li} style={{ background: l.peint ? '#f0faf4' : li%2===0?'#fff':'#fafaf8' }}>
                                <td style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:0 }}
                                  title={l.design}>{l.design}</td>
                                <td style={{ color:'#6b6860', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:0 }}
                                  title={l.client}>{l.client}</td>
                                <td style={{ textAlign:'center', fontWeight:500 }}>{l.qte}</td>
                                <td style={{ textAlign:'center', color:'#9c9a94' }}>{fmt(ecaU*l.qte)}</td>
                                <td style={{ textAlign:'center', color:'#6b6860', fontSize:12 }}>{l.dateLiv}</td>
                                <td style={{ textAlign:'center' }}>
                                  <button
                                    onClick={() => onToggle(key)}
                                    style={{
                                      padding:'2px 10px', fontSize:11, fontWeight:500,
                                      background: l.peint?'#e8f4ee':'#fceaea',
                                      color: l.peint?'#1d6f42':'#9b2626',
                                      border: `1px solid ${l.peint?'#b8ddc8':'#f0c0c0'}`,
                                      borderRadius:99,
                                    }}>
                                    {l.peint ? '✓ OK' : '— NOK'}
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Vue Charge ECA ──────────────────────────────────────────────
function VueCharge({ lignes, onSemaine }) {
  const [maxECA, setMaxECA] = useState(250)
  const [nbJours, setNbJours] = useState(5)

  const sems = [...new Set(lignes.map(l => l.semaine))].filter(Boolean).sort()
  const ecaBySem = {}
  sems.forEach(s => {
    ecaBySem[s] = lignes.filter(l=>l.semaine===s).reduce((t,l)=>t+getECA(l.ref)*l.qte, 0)
  })
  const maxVal = Math.max(...Object.values(ecaBySem), 1)
  const capacite = maxECA * nbJours

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:20 }}>
        <span style={{ fontSize:12, color:'#9c9a94' }}>Jours / sem :</span>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3,4,5,6].map(n => (
            <button key={n} className={nbJours===n?'active':''} onClick={() => setNbJours(n)}
              style={{ padding:'5px 10px', minWidth:36 }}>{n}</button>
          ))}
        </div>
        <span style={{ fontSize:12, color:'#9c9a94', marginLeft:8 }}>Max ECA/j :</span>
        <input type="number" value={maxECA} onChange={e=>setMaxECA(+e.target.value)}
          style={{ width:70 }} min={50} max={600} step={10}/>
        <span style={{ fontSize:12, color:'#9c9a94' }}>
          → Capacité : {capacite} ECA/sem
        </span>
      </div>

      <div className="card" style={{ padding:'20px 20px 24px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {sems.map(s => {
            const eca = ecaBySem[s]
            const over = eca > capacite
            const pct = Math.round(eca/maxVal*100)
            const col = over ? '#c0392b' : eca > capacite*0.85 ? '#e67e22' : '#1d9e75'
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:12, color:'#6b6860', width:64, flexShrink:0 }}>{s}</span>
                <div style={{ flex:1, height:22, background:'#f0ede6', borderRadius:4, overflow:'hidden',
                  cursor:'pointer' }} onClick={() => onSemaine(s)}>
                  <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:4,
                    display:'flex', alignItems:'center', paddingLeft:8, transition:'width 0.3s' }}>
                    {pct > 18 && <span style={{ fontSize:11, color:'#fff', fontWeight:500 }}>{fmt(eca)} ECA</span>}
                  </div>
                </div>
                {pct <= 18 && <span style={{ fontSize:11, color:'#9c9a94', minWidth:40 }}>{fmt(eca)}</span>}
                {over && <span style={{ fontSize:11, color:'#9b2626', flexShrink:0 }}>⚠ dépasse</span>}
              </div>
            )
          })}
        </div>
        <p style={{ marginTop:16, fontSize:11, color:'#9c9a94' }}>
          Cliquez sur une barre pour voir le planning de la semaine
        </p>
      </div>
    </div>
  )
}

// ─── Vue Reporting ───────────────────────────────────────────────
function VueReporting({ lignes, statuts, onToggle, onCommande }) {
  // Grouper par commande
  const byCde = {}
  lignes.forEach(l => {
    const key = `${l.id}||${l.ref}`
    const peint = statuts[key] || false
    if (!byCde[l.id]) byCde[l.id] = { id:l.id, client:l.client, dateLiv:l.dateLiv, lignes:[], peintes:0 }
    byCde[l.id].lignes.push({ ...l, peint })
    if (peint) byCde[l.id].peintes++
  })

  const commandes = Object.values(byCde).sort((a,b) => {
    const toDate = s => { const p=s.split('/'); return p.length===3?`${p[2]}${p[1]}${p[0]}`:'99999999' }
    return toDate(a.dateLiv).localeCompare(toDate(b.dateLiv))
  })

  return (
    <div className="card">
      <table>
        <thead>
          <tr style={{ background:'#fafaf8' }}>
            <th style={{ width:'12%' }}>N° cde</th>
            <th style={{ width:'28%' }}>Client</th>
            <th style={{ width:'14%', textAlign:'center' }}>Date liv.</th>
            <th style={{ width:'20%', textAlign:'center' }}>Avancement</th>
            <th style={{ width:'12%', textAlign:'center' }}>Lignes</th>
            <th style={{ width:'14%', textAlign:'center' }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((cmd, i) => {
            const pct = Math.round(cmd.peintes / cmd.lignes.length * 100)
            const [sBg, sCol, sLbl] =
              pct===100 ? ['#e8f4ee','#1d6f42','Terminé'] :
              pct>0    ? ['#fef0e4','#9a4a0a','En cours'] :
                         ['#fceaea','#9b2626','En attente']
            return (
              <tr key={cmd.id} style={{ background: i%2===0?'#fff':'#fafaf8' }}>
                <td>
                  <button onClick={() => onCommande(cmd.id)}
                    style={{ background:'none', border:'none', padding:0, color:'#1a4a7a',
                      textDecoration:'underline', fontWeight:500, cursor:'pointer', fontSize:13 }}>
                    {cmd.id}
                  </button>
                </td>
                <td style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:0 }}
                  title={cmd.client}>{cmd.client}</td>
                <td style={{ textAlign:'center', fontSize:12, color:'#6b6860' }}>{cmd.dateLiv}</td>
                <td style={{ textAlign:'center' }}>
                  <div style={{ height:5, background:'#e5e2d9', borderRadius:99, overflow:'hidden', width:80, margin:'0 auto 3px' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:sCol, borderRadius:99 }}/>
                  </div>
                  <span style={{ fontSize:11, color:'#9c9a94' }}>{pct}%</span>
                </td>
                <td style={{ textAlign:'center', color:'#6b6860' }}>{cmd.peintes}/{cmd.lignes.length}</td>
                <td style={{ textAlign:'center' }}>
                  <span className="badge" style={{ background:sBg, color:sCol }}>{sLbl}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Vue Détail commande ─────────────────────────────────────────
function VueDetailCommande({ commandeId, lignes, statuts, onToggle, onBack }) {
  const lignesCde = lignes
    .filter(l => l.id === commandeId)
    .map(l => ({ ...l, peint: statuts[`${l.id}||${l.ref}`] || false }))

  const client = lignesCde[0]?.client || ''
  const nbPeintes = lignesCde.filter(l=>l.peint).length
  const pct = lignesCde.length > 0 ? Math.round(nbPeintes/lignesCde.length*100) : 0
  const [sBg, sCol, sLbl] =
    pct===100 ? ['#e8f4ee','#1d6f42','Terminé'] :
    pct>0    ? ['#fef0e4','#9a4a0a','En cours'] :
               ['#fceaea','#9b2626','En attente']

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="back" size={14}/> Retour
        </button>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:'Syne, sans-serif', fontSize:18, fontWeight:700 }}>
            Commande {commandeId}
          </h2>
          <p style={{ fontSize:12, color:'#9c9a94' }}>{client}</p>
        </div>
        <span className="badge" style={{ background:sBg, color:sCol, fontSize:13, padding:'4px 12px' }}>
          {sLbl} · {nbPeintes}/{lignesCde.length} lignes · {pct}%
        </span>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr style={{ background:'#fafaf8' }}>
              <th style={{ width:'30%' }}>Désignation</th>
              <th style={{ width:'22%' }}>Couleur</th>
              <th style={{ width:'8%', textAlign:'center' }}>Qté</th>
              <th style={{ width:'10%', textAlign:'center' }}>ECA</th>
              <th style={{ width:'12%', textAlign:'center' }}>Semaine</th>
              <th style={{ width:'10%', textAlign:'center' }}>Date liv.</th>
              <th style={{ width:'8%', textAlign:'center' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lignesCde.map((l, i) => {
              const key = `${l.id}||${l.ref}`
              const ecaU = getECA(l.ref)
              return (
                <tr key={i} style={{ background: l.peint?'#f0faf4':i%2===0?'#fff':'#fafaf8' }}>
                  <td style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:0 }}
                    title={l.design}>{l.design}</td>
                  <td style={{ color:'#6b6860', fontSize:12 }}>{l.couleur}</td>
                  <td style={{ textAlign:'center', fontWeight:500 }}>{l.qte}</td>
                  <td style={{ textAlign:'center', color:'#9c9a94' }}>{fmt(ecaU*l.qte)}</td>
                  <td style={{ textAlign:'center', fontSize:12, color:'#6b6860' }}>{l.semaine}</td>
                  <td style={{ textAlign:'center', fontSize:12, color:'#6b6860' }}>{l.dateLiv}</td>
                  <td style={{ textAlign:'center' }}>
                    <button
                      onClick={() => onToggle(key)}
                      style={{
                        padding:'2px 8px', fontSize:11, fontWeight:500, borderRadius:99,
                        background: l.peint?'#e8f4ee':'#fceaea',
                        color: l.peint?'#1d6f42':'#9b2626',
                        border: `1px solid ${l.peint?'#b8ddc8':'#f0c0c0'}`,
                      }}>
                      {l.peint ? '✓ OK' : 'NOK'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── App principale ──────────────────────────────────────────────
export default function App() {
  const [lignes, setLignes] = useState([])
  const [statuts, setStatuts] = useState({}) // { "id||ref": true/false }
  const [vue, setVue] = useState('planning')
  const [semainePlanning, setSemainePlanning] = useState('')
  const [commandeDetail, setCommandeDetail] = useState(null)
  const [fichierNom, setFichierNom] = useState('')

  const handleData = useCallback((rows) => {
    const parsed = parseERP(rows)
    setLignes(parsed)
    // Conserver les statuts existants pour les refs communes
    const sems = [...new Set(parsed.map(l=>l.semaine))].filter(Boolean).sort()
    setSemainePlanning(sems[0] || '')
    setVue('planning')
  }, [])

  const toggleStatut = useCallback((key) => {
    setStatuts(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const goToSemaine = (s) => {
    setSemainePlanning(s)
    setVue('planning')
  }

  const TABS = [
    { id:'planning', label:'Planning', icon:'calendar' },
    { id:'charge',   label:'Charge ECA', icon:'chart' },
    { id:'reporting',label:'Reporting', icon:'list' },
  ]

  const hasData = lignes.length > 0

  return (
    <div style={{ minHeight:'100vh', background:'#f8f7f4' }}>
      {/* Header */}
      <header style={{
        background:'#1a1917', color:'#fff', padding:'0 24px',
        display:'flex', alignItems:'center', gap:16, height:52, position:'sticky', top:0, zIndex:100,
      }}>
        <span style={{ fontFamily:'Syne, sans-serif', fontSize:16, fontWeight:700, letterSpacing:'0.02em' }}>
          TOLIX · Peinture
        </span>
        {hasData && (
          <nav style={{ display:'flex', gap:2, marginLeft:16 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setVue(t.id); setCommandeDetail(null) }}
                style={{
                  background: vue===t.id&&!commandeDetail ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border:'none', color:'#fff', padding:'5px 12px', borderRadius:6,
                  fontSize:13, opacity: vue===t.id&&!commandeDetail ? 1 : 0.7,
                }}>
                {t.label}
              </button>
            ))}
          </nav>
        )}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          {fichierNom && <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{fichierNom}</span>}
          <label style={{
            background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
            color:'#fff', padding:'4px 12px', borderRadius:6, fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', gap:6,
          }}>
            <Icon name="upload" size={13}/>
            {hasData ? 'Nouveau fichier' : 'Importer'}
            <input type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }}
              onChange={e => {
                const f = e.target.files[0]
                if (!f) return
                setFichierNom(f.name)
                const reader = new FileReader()
                reader.onload = ev => {
                  const wb = XLSX.read(ev.target.result, { type:'array' })
                  const ws = wb.Sheets[wb.SheetNames[0]]
                  handleData(XLSX.utils.sheet_to_json(ws, { header:1, raw:true }))
                }
                reader.readAsArrayBuffer(f)
              }}/>
          </label>
        </div>
      </header>

      {/* Contenu */}
      <main style={{ maxWidth:1100, margin:'0 auto', padding:'24px 16px' }}>
        {!hasData ? (
          <div>
            <div style={{ textAlign:'center', marginBottom:32, paddingTop:32 }}>
              <p style={{ fontFamily:'Syne, sans-serif', fontSize:28, fontWeight:700, marginBottom:8 }}>
                Planning peinture
              </p>
              <p style={{ color:'#6b6860' }}>Importez votre export ERP Codial pour démarrer</p>
            </div>
            <div style={{ maxWidth:500, margin:'0 auto' }}>
              <ImportZone onData={(rows) => { handleData(rows) }} />
            </div>
          </div>
        ) : commandeDetail ? (
          <VueDetailCommande
            commandeId={commandeDetail}
            lignes={lignes}
            statuts={statuts}
            onToggle={toggleStatut}
            onBack={() => setCommandeDetail(null)}
          />
        ) : vue === 'planning' ? (
          <VuePlanning
            lignes={lignes}
            statuts={statuts}
            onToggle={toggleStatut}
          />
        ) : vue === 'charge' ? (
          <VueCharge lignes={lignes} onSemaine={goToSemaine} />
        ) : vue === 'reporting' ? (
          <VueReporting
            lignes={lignes}
            statuts={statuts}
            onToggle={toggleStatut}
            onCommande={(id) => setCommandeDetail(id)}
          />
        ) : null}
      </main>
    </div>
  )
}
