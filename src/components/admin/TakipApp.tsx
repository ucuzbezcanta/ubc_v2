'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

// Konum: src/components/admin/TakipApp.tsx
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

type Row = Record<string, any>
type Field = { k: string; l: string; t?: 'text' | 'number' | 'area' | 'select' | 'tel'; o?: string[]; req?: boolean }
type ModalState = { title: string; fields: Field[]; values: Row; onSave: (v: Row) => void } | null

const COLS = ['Teklif', 'Kesim', 'Dikim', 'Baskı', 'Teslimat']
const TABS = [['panel', 'Panel'], ['todo', 'Yapılacaklar'], ['stok', 'Stok'], ['musteri', 'Müşteriler']] as const
const tl = (n: any) => Number(n || 0).toLocaleString('tr-TR') + ' TL'
const num = (v: any) => (v === '' || v == null ? null : Number(v))

const btn = 'px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700'
const ghost = 'px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50'
const danger = 'px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-red-600 hover:bg-red-50'
const small = 'px-2 py-1 rounded-lg border border-gray-300 text-xs hover:bg-gray-50'
const inp = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm'
const rowCls = 'flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl mb-2'
const h2 = 'text-lg font-bold text-gray-800'

/* İlk yükleme + canlı güncelleme (Realtime) */
function useTable(name: string) {
  const [rows, setRows] = useState<Row[]>([])
  const upsertLocal = (r: Row) =>
    setRows(cur => { const i = cur.findIndex(x => x.id === r.id); if (i > -1) { const n = [...cur]; n[i] = r; return n } return [...cur, r] })

  useEffect(() => {
    let on = true
    supabase.from(name).select('*').order('created_at').then(({ data }) => { if (on) setRows(data ?? []) })
    const ch = supabase.channel(name + '-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: name }, (p: any) => {
        if (p.eventType === 'DELETE') setRows(cur => cur.filter(r => r.id !== p.old.id))
        else upsertLocal(p.new)
      }).subscribe()
    return () => { on = false; supabase.removeChannel(ch) }
  }, [name])

  const save = useCallback(async (row: Row) => {
    const { id, ...rest } = row
    const q = id ? supabase.from(name).update(rest).eq('id', id) : supabase.from(name).insert(rest)
    const { data, error } = await q.select().single()
    if (error) return alert('Kaydedilemedi: ' + error.message)
    upsertLocal(data)
  }, [name])

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from(name).delete().eq('id', id)
    if (error) return alert('Silinemedi: ' + error.message)
    setRows(cur => cur.filter(r => r.id !== id))
  }, [name])

  return { rows, save, remove }
}

function Modal({ m, close }: { m: NonNullable<ModalState>; close: () => void }) {
  const [v, setV] = useState<Row>(m.values)
  const set = (k: string, val: string) => setV(s => ({ ...s, [k]: val }))
  const ok = () => {
    if (m.fields[0].req && !String(v[m.fields[0].k] ?? '').trim()) return
    m.onSave(v); close()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={close}>
      <div className="bg-white rounded-2xl w-[min(420px,92vw)] max-h-[90vh] overflow-auto p-5" onClick={e => e.stopPropagation()}>
        <h2 className={h2 + ' mb-2'}>{m.title}</h2>
        {m.fields.map(f => (
          <div key={f.k}>
            <label className="block text-sm text-gray-500 mt-3 mb-1">{f.l}</label>
            {f.t === 'select' ? (
              <select className={inp} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)}>{f.o!.map(o => <option key={o}>{o}</option>)}</select>
            ) : f.t === 'area' ? (
              <textarea className={inp} rows={2} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} />
            ) : (
              <input className={inp} type={f.t ?? 'text'} step="any" min={f.t === 'number' ? 0 : undefined} list={f.o ? 'dl-' + f.k : undefined}
                value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} />
            )}
            {f.o && f.t !== 'select' && <datalist id={'dl-' + f.k}>{f.o.map(o => <option key={o} value={o} />)}</datalist>}
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-5">
          <button className={ghost} onClick={close}>Vazgeç</button>
          <button className={btn} onClick={ok}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

export default function TakipApp() {
  const [tab, setTab] = useState<string>('panel')
  const [modal, setModal] = useState<ModalState>(null)
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const [over, setOver] = useState<string | null>(null)
  const cards = useTable('takip_cards'), todos = useTable('takip_todos')
  const stock = useTable('takip_stock'), cust = useTable('takip_customers')

  const ask = (title: string, fields: Field[], values: Row, onSave: (v: Row) => void) => setModal({ title, fields, values, onSave })
  const sure = (msg: string, fn: () => void) => { if (confirm(msg)) fn() }

  /* Panel */
  const cardFields = (): Field[] => [
    { k: 'musteri', l: 'Müşteri', o: cust.rows.map(c => c.firma), req: true },
    { k: 'urun', l: 'Ürün / kumaş tipi' },
    { k: 'adet', l: 'Adet', t: 'number' },
    { k: 'fiyat', l: 'Birim fiyat (TL)', t: 'number' },
    { k: 'notu', l: 'Not', t: 'area' },
  ]
  const cleanCard = (v: Row) => ({ ...v, adet: num(v.adet), fiyat: num(v.fiyat) })
  const addCard = (col: string) => ask('Kart ekle: ' + col, cardFields(), {}, v => cards.save({ ...cleanCard(v), col }))
  const editCard = (c: Row) => ask('Kartı düzenle', cardFields(), c, v => cards.save(cleanCard({ ...v, id: c.id })))
  const move = (id: string, col: string) => cards.save({ id, col })

  /* Stok */
  const stockFields = (type: string): Field[] => [
    { k: 'ad', l: type === 'kumas' ? 'Kumaş adı / tipi' : 'Çanta modeli', req: true },
    { k: 'miktar', l: type === 'kumas' ? 'Miktar' : 'Adet', t: 'number' },
    ...(type === 'kumas' ? [{ k: 'birim', l: 'Birim', t: 'select', o: ['metre', 'kg', 'top', 'adet'] } as Field] : []),
    { k: 'notu', l: 'Not' },
  ]
  const stockList = (type: string, title: string) => {
    const L = stock.rows.filter(s => s.type === type)
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className={h2}>{title}</h2>
          <button className={btn} onClick={() => ask('Stok ekle', stockFields(type), { birim: 'metre' }, v => stock.save({ ...v, miktar: num(v.miktar) ?? 0, type }))}>+ Ekle</button>
        </div>
        {L.map(s => (
          <div className={rowCls} key={s.id}>
            <div className="flex-1 min-w-0"><b>{s.ad}</b>{s.notu && <div className="text-sm text-gray-500">{s.notu}</div>}</div>
            <div className="flex items-center gap-2">
              <button className={ghost} onClick={() => stock.save({ id: s.id, miktar: Math.max(0, Number(s.miktar) - 1) })}>−</button>
              <b className="min-w-12 text-center">{s.miktar}{type === 'kumas' ? ' ' + (s.birim ?? '') : ''}</b>
              <button className={ghost} onClick={() => stock.save({ id: s.id, miktar: Number(s.miktar) + 1 })}>+</button>
            </div>
            <button className={ghost} onClick={() => ask('Stok düzenle', stockFields(type), s, v => stock.save({ ...v, id: s.id, miktar: num(v.miktar) ?? 0 }))}>Düzenle</button>
            <button className={danger} onClick={() => sure('Stok kaydı silinsin mi?', () => stock.remove(s.id))}>Sil</button>
          </div>
        ))}
        {!L.length && <div className="text-center text-gray-400 py-4">Kayıt yok.</div>}
      </div>
    )
  }

  /* Müşteri */
  const custFields: Field[] = [{ k: 'firma', l: 'Firma adı', req: true }, { k: 'kisi', l: 'İlgili kişi' }, { k: 'tel', l: 'İrtibat no', t: 'tel' }]
  const custRows = cust.rows.filter(c => `${c.firma} ${c.kisi ?? ''} ${c.tel ?? ''}`.toLowerCase().includes(search.toLowerCase()))
  const addTodo = () => { if (text.trim()) { todos.save({ text: text.trim() }); setText('') } }

  return (
    <div>
      <h1 className="md:pt-20 text-2xl font-bold text-gray-800 mb-4">Atölye Takip</h1>
      <nav className="flex gap-1 flex-wrap mb-5">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={'px-4 py-2 rounded-lg text-sm font-medium ' + (tab === k ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-500 hover:bg-gray-100')}>{l}</button>
        ))}
      </nav>

      {tab === 'panel' && (
        <div className="grid gap-3 overflow-x-auto pb-3" style={{ gridTemplateColumns: 'repeat(5, minmax(230px, 1fr))' }}>
          {COLS.map(c => {
            const L = cards.rows.filter(x => x.col === c)
            return (
              <div key={c} className={'bg-indigo-50/60 rounded-xl p-3 min-h-80 flex flex-col gap-2 ' + (over === c ? 'outline-2 outline-dashed outline-indigo-500' : '')}
                onDragOver={e => { e.preventDefault(); setOver(c) }} onDragLeave={() => setOver(null)}
                onDrop={e => { e.preventDefault(); setOver(null); const id = e.dataTransfer.getData('id'); if (id) move(id, c) }}>
                <div className="font-bold text-gray-800">{c}<span className="ml-2 text-sm font-normal text-gray-400">{L.length}</span></div>
                {L.map(x => (
                  <div key={x.id} draggable onDragStart={e => e.dataTransfer.setData('id', x.id)}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-grab text-sm">
                    <b className="block text-gray-900">{x.musteri}</b>
                    {x.urun && <div>{x.urun}</div>}
                    <div className="text-gray-500">{x.adet ? x.adet + ' adet' : ''}{x.fiyat ? ' × ' + tl(x.fiyat) : ''}{x.adet && x.fiyat ? ' · Toplam ' + tl(x.adet * x.fiyat) : ''}</div>
                    {x.notu && <div className="text-gray-500">{x.notu}</div>}
                    <div className="flex gap-1.5 mt-2">
                      <select className="flex-1 min-w-0 border border-gray-300 rounded-lg px-1.5 py-1 text-xs" value={c} onChange={e => move(x.id, e.target.value)}>
                        {COLS.map(k => <option key={k}>{k}</option>)}
                      </select>
                      <button className={small} onClick={() => editCard(x)}>Düzenle</button>
                      <button className={small + ' text-red-600'} onClick={() => sure('Kart silinsin mi?', () => cards.remove(x.id))}>Sil</button>
                    </div>
                  </div>
                ))}
                <button className="border border-dashed border-gray-300 rounded-lg p-2 text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-500" onClick={() => addCard(c)}>+ Kart ekle</button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'todo' && (
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4">
            <input className={inp} value={text} placeholder="Yeni iş yaz, Enter’a bas" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} />
            <button className={btn} onClick={addTodo}>Ekle</button>
          </div>
          {[...todos.rows].sort((a, b) => Number(a.done) - Number(b.done)).map(t => (
            <div key={t.id} className={rowCls}>
              <input type="checkbox" checked={t.done} onChange={() => todos.save({ id: t.id, done: !t.done })} />
              <div className={'flex-1 ' + (t.done ? 'line-through text-gray-400' : '')}>{t.text}</div>
              <button className={danger} onClick={() => todos.remove(t.id)}>Sil</button>
            </div>
          ))}
          {!todos.rows.length && <div className="text-center text-gray-400 py-4">Yapılacak iş yok.</div>}
        </div>
      )}

      {tab === 'stok' && <div className="grid md:grid-cols-2 gap-6">{stockList('kumas', 'Kumaş stoğu')}{stockList('canta', 'Hazır çanta stoğu')}</div>}

      {tab === 'musteri' && (
        <div className="max-w-3xl">
          <div className="flex gap-2 mb-4">
            <input className={inp} placeholder="Ara…" value={search} onChange={e => setSearch(e.target.value)} />
            <button className={btn + ' whitespace-nowrap'} onClick={() => ask('Yeni müşteri', custFields, {}, v => cust.save(v))}>+ Yeni müşteri</button>
          </div>
          {custRows.map(c => (
            <div className={rowCls} key={c.id}>
              <div className="flex-1 min-w-0"><b>{c.firma}</b><div className="text-sm text-gray-500">{c.kisi}{c.tel ? ' · ' + c.tel : ''}</div></div>
              <button className={ghost} onClick={() => ask('Müşteriyi düzenle', custFields, c, v => cust.save({ ...v, id: c.id }))}>Düzenle</button>
              <button className={danger} onClick={() => sure('Müşteri silinsin mi?', () => cust.remove(c.id))}>Sil</button>
            </div>
          ))}
          {!custRows.length && <div className="text-center text-gray-400 py-4">Müşteri bulunamadı.</div>}
        </div>
      )}

      {modal && <Modal m={modal} close={() => setModal(null)} />}
    </div>
  )
}