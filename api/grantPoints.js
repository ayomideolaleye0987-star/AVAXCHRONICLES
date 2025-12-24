import { createClient } from '@supabase/supabase-js'

// Vercel / serverless endpoint to safely grant points using Supabase service_role key.
// Protect this endpoint with a project-specific ADMIN_SECRET environment variable.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const adminHeader = req.headers['x-admin-secret'] || req.headers['x-admin-key']
  if (!ADMIN_SECRET || adminHeader !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return res.status(500).json({ error: 'Supabase service role not configured on server' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  try {
    const { address, points } = req.body || {}
    const pts = Number(points || 0)
    if (!address || Number.isNaN(pts)) return res.status(400).json({ error: 'Invalid payload' })

    // Fetch current points
    const { data: userData, error: selErr } = await supabase.from('users').select('points').eq('address', address).single()
    if (selErr && selErr.code !== 'PGRST116') {
      // PGRST116 sometimes used for no rows; ignore and create.
    }

    const current = (userData && userData.points) ? Number(userData.points) : 0
    const newPoints = current + pts

    const { data, error } = await supabase.from('users').upsert({ address, points: newPoints }, { onConflict: 'address' }).select().single()
    if (error) return res.status(500).json({ error: error.message || error })

    return res.status(200).json({ user: data })
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) })
  }
}
