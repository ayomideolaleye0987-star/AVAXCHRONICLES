import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav(){
  return (
    <nav className="max-w-4xl mx-auto flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-muted">Courtroom</Link>
        <Link to="/submit" className="text-sm text-muted">Submit Case</Link>
        <Link to="/archive" className="text-sm text-muted">Archive</Link>
      </div>
      <div>
        <Link to="/profile" className="text-sm text-muted">Profile</Link>
      </div>
    </nav>
  )
}
