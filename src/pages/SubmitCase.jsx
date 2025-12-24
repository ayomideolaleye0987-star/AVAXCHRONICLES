import React, { useState } from 'react'
import { createCase } from '../backend'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

export default function SubmitCase(){
  const { address } = useAccount()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Market Abuse')
  const [description, setDescription] = useState('')
  const [txs, setTxs] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    const txList = txs.split(/\s*,\s*/).filter(Boolean)
    const c = await createCase({ title, category, description, txs: txList, submitter: address })
    navigate(`/case/${c.id}`)
  }

  return (
    <div className="bg-panel-800 p-6 rounded-lg">
      <h2 className="text-lg font-semibold">Submit a Case</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm">Case Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 p-2 bg-bg-900 rounded border border-gray-700" />
        </div>
        <div>
          <label className="text-sm">Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full mt-1 p-2 bg-bg-900 rounded border border-gray-700">
            <option>Market Abuse</option>
            <option>Sybil</option>
            <option>Rug Pattern</option>
            <option>Social Engineering</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Short Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full mt-1 p-2 bg-bg-900 rounded border border-gray-700" rows={4} />
        </div>
        <div>
          <label className="text-sm">Transaction hashes (comma separated)</label>
          <input value={txs} onChange={e=>setTxs(e.target.value)} className="w-full mt-1 p-2 bg-bg-900 rounded border border-gray-700" />
        </div>
        <div>
          <button className="px-4 py-2 bg-gold-500 text-black rounded">Submit Case</button>
        </div>
      </form>
    </div>
  )
}
