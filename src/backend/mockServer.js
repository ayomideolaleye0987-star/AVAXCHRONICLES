// Minimal mock backend using localStorage to persist cases, evidence, users, and points
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'avc_data_v1'

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seed = { cases: [], users: {} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw)
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function listCases() {
  const s = load()
  return s.cases.slice().reverse()
}

export function getCase(id) {
  const s = load()
  return s.cases.find(c => c.id === id)
}

export function createCase({ title, category, description, txs, images, submitter }) {
  const s = load()
  const c = {
    id: uuidv4(),
    title,
    category,
    description,
    txs: txs || [],
    images: images || [],
    submitter,
    status: 'queued',
    createdAt: Date.now(),
    evidence: [],
    votes: { selection: 0, verdict: { guilty: 0, not_guilty: 0, adjourn: 0 } }
  }
  s.cases.push(c)
  save(s)
  addPoints(submitter, 10)
  return c
}

export function addEvidence(caseId, { author, content, txExplain }) {
  const s = load()
  const c = s.cases.find(x => x.id === caseId)
  if (!c) throw new Error('Case not found')
  const ev = { id: uuidv4(), author, content, txExplain: !!txExplain, upvotes: 0, createdAt: Date.now() }
  c.evidence.push(ev)
  save(s)
  addPoints(author, 5)
  return ev
}

export function upvoteEvidence(caseId, evidenceId, voter) {
  const s = load()
  const c = s.cases.find(x => x.id === caseId)
  if (!c) throw new Error('Case not found')
  const ev = c.evidence.find(e => e.id === evidenceId)
  if (!ev) throw new Error('Evidence not found')
  ev.upvotes = (ev.upvotes || 0) + 1
  save(s)
  addPoints(ev.author, 3)
}

export function voteCaseSelection(caseId, voter) {
  const s = load()
  const c = s.cases.find(x => x.id === caseId)
  if (!c) throw new Error('Case not found')
  c.votes.selection = (c.votes.selection || 0) + 1
  save(s)
  addPoints(voter, 2)
}

export function voteVerdict(caseId, choice, voter) {
  const s = load()
  const c = s.cases.find(x => x.id === caseId)
  if (!c) throw new Error('Case not found')
  c.votes.verdict[choice] = (c.votes.verdict[choice] || 0) + 1
  save(s)
  addPoints(voter, 2)
}

export function getOrCreateUser(address) {
  const s = load()
  if (!s.users[address]) {
    s.users[address] = { address, username: `judge_${address.slice(2,8)}`, avatar: '🧑‍⚖️', points: 0 }
    save(s)
  }
  return s.users[address]
}

export function addPoints(address, pts) {
  if (!address) return
  const s = load()
  s.users = s.users || {}
  if (!s.users[address]) s.users[address] = { address, username: `judge_${address.slice(2,8)}`, avatar: '🧑‍⚖️', points: 0 }
  s.users[address].points = (s.users[address].points || 0) + pts
  save(s)
}

export function getUser(address) {
  const s = load()
  return s.users[address]
}
