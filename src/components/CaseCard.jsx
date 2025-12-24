import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CaseCard() {
  const [verdict, setVerdict] = useState(null)

  const verdictAnim = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } }
  }

  const hammerShake = {
    idle: { x: 0 },
    shake: { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.6 } }
  }

  return (
    <div className="border-l-4 border-gold-500 bg-bg-900 p-4 rounded-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted">Category — Market Abuse</div>
          <h3 className="text-lg font-semibold mt-1">Suspicious Wash Trading Pattern</h3>
          <div className="text-xs font-mono text-muted mt-2">tx: 0x...c0ffee</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted">Phase: Evidence</div>
          <div className="mt-2">
            <button
              className="px-3 py-1 bg-gold-500 text-black rounded-sm mr-2"
              onClick={() => setVerdict('guilty')}
            >
              Reveal Guilty
            </button>
            <button
              className="px-3 py-1 bg-cyan-400 text-black rounded-sm"
              onClick={() => setVerdict('not_guilty')}
            >
              Reveal Not Guilty
            </button>
          </div>
        </div>
      </div>

      {verdict && (
        <motion.div initial="hidden" animate="visible" variants={verdictAnim} className="mt-4 p-3 rounded border" style={{ borderColor: verdict === 'guilty' ? '#C43D3D' : '#4FD1C5', background: verdict === 'guilty' ? 'rgba(196,61,61,0.08)' : 'rgba(79,209,197,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Verdict: {verdict === 'guilty' ? 'GUILTY' : 'NOT GUILTY'}</div>
              <div className="text-xs text-muted mt-1">Archived as Chronicle Verdict</div>
            </div>
            <motion.div className="ml-4 text-2xl" animate={verdict === 'guilty' ? 'shake' : 'idle'} variants={hammerShake}>🔨</motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
