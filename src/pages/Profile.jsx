import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getOrCreateUser, getUser } from '../backend'

export default function Profile(){
  const { address } = useAccount()
  const [user, setUser] = useState(null)

  useEffect(()=>{
    async function load(){
      if(address){
        await getOrCreateUser(address)
        const u = await getUser(address)
        setUser(u)
      }
    }
    load()
  }, [address])

  if(!address) return <div className="text-muted">Connect a wallet to view profile.</div>

  if(!user) return null

  return (
    <div className="bg-panel-800 p-6 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{user.avatar}</div>
        <div>
          <div className="font-semibold">{user.username}</div>
          <div className="text-xs font-mono text-muted">{user.address}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm text-muted">Points</div>
          <div className="text-xl font-semibold">{user.points || 0}</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Judge Level</h3>
        <div className="text-muted mt-1">{user.points >= 500 ? 'Gold' : user.points >= 100 ? 'Silver' : 'Bronze'}</div>
      </div>
    </div>
  )
}
