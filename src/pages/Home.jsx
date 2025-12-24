import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCases, voteCaseSelection } from '../backend'
import { useAccount } from 'wagmi'
import CaseCard from '../components/CaseCard'

export default function Home(){
  const { address } = useAccount()
  const [cases, setCases] = useState([])

  useEffect(()=>{
    async function load(){
      const res = await listCases()
      setCases(res)
    }
    load()
  }, [])

  async function handleSelect(id){
    await voteCaseSelection(id, address)
    const res = await listCases()
    setCases(res)
  }

  return (
    <div>
      <section className="mb-6">
        <div className="bg-panel-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Queued Cases</h2>
          <div className="mt-4 space-y-3">
            {cases.length===0 && <div className="text-muted">No cases yet. Be the first to submit.</div>}
            {cases.map(c => (
              <div key={c.id} className="p-3 bg-bg-900 rounded border-l-4 border-gold-500 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted">{c.category}</div>
                  <Link to={`/case/${c.id}`} className="font-semibold">{c.title}</Link>
                  <div className="text-xs font-mono text-muted">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <button className="px-3 py-1 bg-gold-500 text-black rounded" onClick={()=>handleSelect(c.id)}>Vote</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="bg-panel-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Case of the Day</h2>
          <p className="text-muted text-sm mt-1">Spotlight</p>
          <div className="mt-4">
            <CaseCard />
          </div>
        </div>
      </section>
    </div>
  )
}
