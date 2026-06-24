export const ECA_REF = {
  "EACAC-11474-C":1,"EACAC-11476-C":1,"EACAC-11478-C":1,
  "EACAC-11290-C":0.25,"EACAC-11291-C":0.25,
  "EACAC-11306-C":0.5,"EACAC-11305-C":0.5,"EACAC-11482-C":1,
  "OCHAC-12088-F":2,"ETBAC-12100-F":4,"ETBAC-12098-F":6,"ETBAC-12099-F":6,
  "ERAAC-12085-C":14,"ERAAC-10570-V":8,"ERAAC-10568-C":8,
  "ERAAC-10567-V":6,"ERAAC-10565-C":6,"ERAAC-10564-V":6,
  "ERAAC-10562-C":6,"ERAAC-10561-V":8,"ERAAC-10559-C":8,
  "ERAAC-12097-V":12,"ERAAC-12074-C":12,
  "OCHAC-10530-V":1,"OCHAC-11332-G":1,"OCHAC-10532-C":1,
  "OFOAC-10539-V":1,"OFOAC-11443-G":1,"OCHAC-10541-C":1,
  "OFOAC-10525-V":1,"OFOAC-10524-C":1,
  "ERAAC-12083-C":14,"ERAAC-12084-C":16,
  "ETBAC-10597-V":6,"ETBAC-10619-C":6,"ETBAC-10583-C":6,
  "ETBAC-10620-V":6,"ETBAC-10601-C":6,"ETBAC-10582-C":6,
  "ETBAC-10621-V":6,"ETBAC-10603-C":6,"ETBAC-10586-C":8,
  "ETBAC-10622-V":4,"ETBAC-10599-C":4,"ETBAC-10577-C":4,
  "ETBAC-10573-V":4,"ETBAC-10571-C":4,
  "ETBAC-11390-C":6,"ETBAC-11397-C":6,
  "OTAAC-10574-V":1,"OTAAC-10576-C":1,"OTAAC-11193-V":1,
  "OTAAC-11311-G":1,"OTAAC-11294-C":1,"OTAAC-11132-V":1,
  "OTAAC-11315-G":1,"OTAAC-11295-C":1,"OTAAC-11298-V":1,
  "OTAAC-11319-G":1,"OTAAC-11296-C":1,"OTAAC-11299-C":2,
  "OTAAC-11300-V":2,"OTAAC-11301-C":2,"OTAAC-11309-F":1,
  "OTAAC-11323-F":1,"OTAAC-11331-F":2,
  "ERAAC-10558-V":6,"ERAAC-10556-C":6,"ERAAC-10553-V":14,
  "ERAAC-10555-C":14,"ERAAC-10550-V":20,"ERAAC-10548-C":20,
  "ERAAC-10615-V":8,"ERAAC-10613-C":8,"ERAAC-10551-V":26,
  "ERAAC-10612-C":26,"ERAAC-08759-C":40,"ERAAC-08760-C":40,
  "ELUIN-11466-C":1,"ELUIN-11233-C":1,
  "EBNAC-11435-G":6,"EBNAC-12040-C":6,"EBNAC-11249-G":4,
  "EBNAC-12039-C":4,"EBNAC-12093-C":6,"EBNAC-11154-C":6,
  "OCHAC-10978-G":1,"OCHAC-12033-C":1,"OCHAC-10515-V":1,
  "OCHAC-10500-C":1,"OCHAC-10510-C":2,"OCHAC-11767-C":2,
  "OCHAC-12060-F":1,"OCHAC-12060-C":1,
  "OFOAC-10979-G":2,"OFOAC-12035-C":2,"OFOAC-12034-C":2,
  "OFOAC-12018-C":4,"OFOAC-12019-C":4,"OFOAC-12042-C":2,"OFOAC-10541-C":1,
  "ETBAC-12048-C":6,"ETBAC-12047-C":4,"ETBAC-12043-C":4,
  "ETBAC-12049-C":8,"ETBAC-12044-C":8,"ETBAC-12045-C":10,"ETBAC-12046-C":10,
  "ETAAC-12037-C":1,"EBNAC-12093-C":6,"EBNAC-11154-C":6,
  "ETBAC-11430-C":6,"ETBAC-11432-C":6,"ETBAC-10520-C":6,
  "ETBAC-12071-C":10,"ETBAC-12072-C":12,"ETBAC-10517-C":8,
  "ETBAC-10518-C":6,"ETBAC-10519-C":6,
  "OCHIN-11208-C":1,"OCHIN-00406-V":1,
  "ETBIN-11494-C":4,"ETBIN-11522-C":4,
  "OTAIN-11502-C":1,"OTAIN-11503-C":1,"OTAIN-11739-C":1,"OTAIN-11740-C":1,
  "ETBAC-12090-V":4,"ETBAC-11490-C":4,"ETBAC-11493-V":4,"ETBAC-11492-C":4,
  "ETBAC-11485-C":2,"ETBAC-11487-C":2,"ETBAC-12069-C":6,
  "ETBAC-12070-C":6,"ETBAC-12094-V":6,"ETBAC-11460-C":6,
  "ETBAC-12095-V":6,"ETBAC-10522-C":6,"ETBAC-10521-C":6,
  "ETAAC-05636-C":2,"ETAAC-05463-C":2,"ETAAC-05687-V":2,
  "ETBAC-12136-F":10,"ETBAC-10898-C":10,"ETBAC-10583-V":6,
}

export function getECA(ref) {
  if (!ref) return 1
  return ECA_REF[ref.substring(0, 13)] ?? 1
}

export function fmt(n) {
  if (n === undefined || n === null) return '0'
  const num = typeof n === 'string' ? parseFloat(n) : n
  return Number.isInteger(num) ? String(num) : num.toFixed(1)
}

const EXCL = ['EMBALLAGE','PALETTE','ECHANTILLON','NUANCIER','KIT EMBALLAGE']

function lastSlash(s) {
  const idx = s.lastIndexOf('/ ')
  return idx >= 0 ? idx : -1
}

export function parseERP(rows) {
  // rows = tableau de tableaux depuis xlsx (ligne 0 = en-têtes)
  const headers = rows[0].map(h => String(h || '').trim().toUpperCase())
  const idx = {
    date:     headers.indexOf('DATE'),
    dateliv:  headers.indexOf('DATELIV'),
    dmp:      headers.findIndex(h => h.includes('PEINTURE') || h.includes('MISE EN')),
    numeroc:  headers.indexOf('NUMEROC'),
    nom:      headers.indexOf('NOM'),
    design:   headers.indexOf('DESIGN'),
    qte:      headers.indexOf('QTE'),
    qtereste: headers.indexOf('QTERESTE'),
    ref:      headers.indexOf('REFERENCE'),
  }

  const lignes = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const design = String(r[idx.design] || '').trim()
    const qteCol = idx.qtereste >= 0 ? idx.qtereste : idx.qte
    const qte = parseFloat(r[qteCol]) || 0
    if (qte <= 0) continue
    if (EXCL.some(e => design.toUpperCase().includes(e))) continue

    const pos = lastSlash(design)
    const couleur = pos >= 0 ? design.slice(pos + 2).trim() : ''
    const produit = pos > 0 ? design.slice(0, pos).trim() : design
    if (!couleur) continue

    // Date de livraison — lire le numéro de série Excel brut
    let dateLivStr = ''
    const rawLiv = r[idx.dateliv]
    if (rawLiv) {
      if (typeof rawLiv === 'number') {
        // Numéro de série Excel → date
        const d = new Date(Math.round((rawLiv - 25569) * 86400 * 1000))
        const day = String(d.getUTCDate()).padStart(2,'0')
        const month = String(d.getUTCMonth()+1).padStart(2,'0')
        const year = d.getUTCFullYear()
        dateLivStr = `${day}/${month}/${year}`
      } else {
        dateLivStr = String(rawLiv).trim()
      }
    }

    // Date mise en peinture = date livraison - 28 jours
    let semaine = ''
    if (dateLivStr && dateLivStr.length >= 8) {
      const parts = dateLivStr.split('/')
      if (parts.length === 3) {
        const livDate = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]))
        const pDate = new Date(livDate.getTime() - 28 * 86400 * 1000)
        semaine = getISOWeekKey(pDate)
      }
    }

    lignes.push({
      id: String(r[idx.numeroc] || '').trim(),
      client: String(r[idx.nom] || '').trim().substring(0, 40),
      ref: String(r[idx.ref] || '').trim(),
      design: produit.substring(0, 60),
      couleur: couleur.substring(0, 40),
      qte: Math.round(qte),
      dateLiv: dateLivStr,
      semaine,
      peint: false,
    })
  }
  return lignes
}

export function getISOWeekKey(date) {
  const d = new Date(date)
  d.setUTCHours(0,0,0,0)
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7))
  const week1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const wn = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getUTCDay()+6)%7)) / 7)
  return `S${String(wn).padStart(2,'0')}-${String(d.getUTCFullYear()).slice(-2)}`
}

// Lissage : bin packing first-fit-decreasing par couleur
export function lisser(lignes, nbJours) {
  const map = {}
  lignes.forEach(l => {
    if (!map[l.couleur]) map[l.couleur] = { couleur: l.couleur, lignes: [], eca: 0 }
    map[l.couleur].lignes.push(l)
    map[l.couleur].eca += getECA(l.ref) * l.qte
  })
  const groupes = Object.values(map).sort((a, b) => b.eca - a.eca)
  const jours = Array.from({ length: nbJours }, (_, i) => ({ jour: i+1, eca: 0, groupes: [] }))
  for (const g of groupes) {
    if (g.eca === 0) continue
    const j = jours.reduce((min, x) => x.eca < min.eca ? x : min)
    j.groupes.push(g)
    j.eca += g.eca
  }
  return jours
}

export const COULEUR_PALETTE = [
  '#1D9E75','#185FA5','#BA7517','#993C1D','#534AB7',
  '#3B6D11','#A32D2D','#0F6E56','#854F0B','#3C3489',
  '#1a6b8a','#7a3b7a','#5a6800','#8a4a00','#2a5a8a',
]
