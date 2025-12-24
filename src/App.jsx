import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import SubmitCase from './pages/SubmitCase'
import CaseDetail from './pages/CaseDetail'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-primary p-6 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl tracking-widest uppercase font-serif">THE PEOPLE VS THE PATTERN</h1>
          <p className="text-muted text-sm mt-1">AVAX CHRONICLES — The On‑Chain Tribunal</p>
        </div>
        <div>
          <ConnectButton />
        </div>
      </header>

      <Nav />

      <main className="max-w-4xl mx-auto mt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitCase />} />
          <Route path="/case/:id" element={<CaseDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
