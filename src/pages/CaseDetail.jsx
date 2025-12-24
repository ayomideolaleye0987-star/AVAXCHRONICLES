import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { getCase, addEvidence, upvoteEvidence, voteVerdict } from '../backend'
import { useAccount } from 'wagmi'

export default function CaseDetail(){
  const { id } = useParams()
  const { address } = useAccount()
  const [c, setC] = useState(null)
  const [evidenceText, setEvidenceText] = useState('')

  useEffect(()=>{
    async function load(){
      const data = await getCase(id)
      setC(data)
    }
    load()
  }, [id])

  async function handleAddEvidence(e){
    e.preventDefault()
    await addEvidence(id, { author: address, content: evidenceText })
    const data = await getCase(id)
    setC(data)
    setEvidenceText('')
  }

  async function handleUpvote(evId){
    await upvoteEvidence(id, evId, address)
    const data = await getCase(id)
    setC(data)
  }

  async function handleVerdict(choice){
    await voteVerdict(id, choice, address)
    const data = await getCase(id)
    setC(data)
  }

  if(!c) return <div className="text-muted">Case not found</div>

  const evVariants = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

  return (
    <div className="bg-panel-800 p-6 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-muted">{c.category}</div>
          <h2 className="text-xl font-semibold mt-1">{c.title}</h2>
          <div className="text-xs font-mono text-muted">{c.txs && c.txs.join(', ')}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Description</h3>
        <p className="text-muted mt-1">{c.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Evidence</h3>
        <div className="mt-3 space-y-3">
          {c.evidence.length===0 && <div className="text-muted">No evidence yet.</div>}
          {c.evidence.map(ev => (
            <motion.div key={ev.id} initial="hidden" animate="show" variants={evVariants} className="p-3 bg-bg-900 rounded border border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-mono text-muted">{ev.author}</div>
                  <div className="mt-1">{ev.content}</div>
                  <div className="text-xs text-muted mt-1">Upvotes: {ev.upvotes}</div>
                </div>
                <div>
                  <button className="px-2 py-1 bg-gold-500 text-black rounded mr-2" onClick={()=>handleUpvote(ev.id)}>▲ Upvote</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <form className="mt-4" onSubmit={handleAddEvidence}>
          <textarea value={evidenceText} onChange={e=>setEvidenceText(e.target.value)} rows={3} className="w-full p-2 bg-bg-900 rounded border border-gray-700" placeholder="Add transaction analysis, clues, screenshots (link)" />
          <div className="mt-2">
            <button className="px-3 py-1 bg-gold-500 text-black rounded">Submit Evidence</button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Verdict</h3>
        <div className="mt-2 flex gap-3">
          <motion.button whileTap={{ scale: 0.96 }} className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>handleVerdict('guilty')}>Guilty</motion.button>
          <motion.button whileTap={{ scale: 0.96 }} className="px-3 py-1 bg-cyan-400 text-black rounded" onClick={()=>handleVerdict('not_guilty')}>Not Guilty</motion.button>
          <motion.button whileTap={{ scale: 0.96 }} className="px-3 py-1 bg-gray-600 text-white rounded" onClick={()=>handleVerdict('adjourn')}>Adjourn</motion.button>
        </div>
      </div>
    </div>
  )
}
