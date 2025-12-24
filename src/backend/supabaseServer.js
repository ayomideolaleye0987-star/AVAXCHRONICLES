import { supabase, isSupabaseEnabled } from './supabaseClient'

// Supabase-backed implementations (async). Tables expected: cases, evidence, users

async function ensure() {
  if (!isSupabaseEnabled()) throw new Error('Supabase not configured')
}

export async function listCases() {
  await ensure()
  const { data, error } = await supabase.from('cases').select('*').order('createdAt', { ascending: false })
  if (error) throw error
  return data
}

export async function getCase(id) {
  await ensure()
  const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()
  if (error) return null
  // fetch evidence
  const { data: ev, error: evErr } = await supabase.from('evidence').select('*').eq('caseId', id).order('createdAt', { ascending: true })
  if (!evErr) data.evidence = ev
  return data
}

export async function createCase({ title, category, description, txs, images, submitter }) {
  await ensure()
  const payload = { title, category, description, txs, images, submitter, status: 'queued', createdAt: Date.now() }
  const { data, error } = await supabase.from('cases').insert(payload).select().single()
  if (error) throw error
  // add points
  await supabase.from('users').upsert({ address: submitter }).select()
  return data
}

export async function addEvidence(caseId, { author, content, txExplain }) {
  await ensure()
  const payload = { caseId, author, content, txExplain: !!txExplain, upvotes: 0, createdAt: Date.now() }
  const { data, error } = await supabase.from('evidence').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function upvoteEvidence(caseId, evidenceId, voter) {
  await ensure()
  // increment upvotes
  const { data, error } = await supabase.from('evidence').update({ upvotes: supabase.rpc ? supabase.rpc('increment', { value: 1 }) : undefined }).eq('id', evidenceId)
  // fallback: fetch, increment, update
  if (error) {
    const get = await supabase.from('evidence').select('upvotes').eq('id', evidenceId).single()
    const newCount = (get.data.upvotes || 0) + 1
    await supabase.from('evidence').update({ upvotes: newCount }).eq('id', evidenceId)
  }
}

export async function voteCaseSelection(caseId, voter) {
  await ensure()
  // simplistic: increment selectionVotes column
  const { data } = await supabase.from('cases').select('selectionVotes').eq('id', caseId).single()
  const newVal = (data?.selectionVotes || 0) + 1
  await supabase.from('cases').update({ selectionVotes: newVal }).eq('id', caseId)
}

export async function voteVerdict(caseId, choice, voter) {
  await ensure()
  // store verdict votes in separate table
  await supabase.from('verdict_votes').insert({ caseId, choice, voter, createdAt: Date.now() })
}

export async function getOrCreateUser(address) {
  await ensure()
  const { data } = await supabase.from('users').select('*').eq('address', address).single()
  if (data) return data
  const { data: created } = await supabase.from('users').insert({ address, username: `judge_${address.slice(2,8)}`, avatar: '🧑‍⚖️', points: 0 }).select().single()
  return created
}

export async function addPoints(address, pts) {
  await ensure()
  const { data } = await supabase.from('users').select('points').eq('address', address).single()
  const newPts = (data?.points || 0) + pts
  await supabase.from('users').update({ points: newPts }).eq('address', address)
}

export async function getUser(address) {
  await ensure()
  const { data } = await supabase.from('users').select('*').eq('address', address).single()
  return data
}
