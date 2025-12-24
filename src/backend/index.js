import * as mock from './mockServer'
import * as supa from './supabaseServer'
import { isSupabaseEnabled } from './supabaseClient'

const useSupabase = isSupabaseEnabled()

// Export a unified API. If Supabase is enabled we expose async functions, otherwise mock (sync).
export const listCases = useSupabase ? supa.listCases : mock.listCases
export const getCase = useSupabase ? supa.getCase : mock.getCase
export const createCase = useSupabase ? supa.createCase : mock.createCase
export const addEvidence = useSupabase ? supa.addEvidence : mock.addEvidence
export const upvoteEvidence = useSupabase ? supa.upvoteEvidence : mock.upvoteEvidence
export const voteCaseSelection = useSupabase ? supa.voteCaseSelection : mock.voteCaseSelection
export const voteVerdict = useSupabase ? supa.voteVerdict : mock.voteVerdict
export const getOrCreateUser = useSupabase ? supa.getOrCreateUser : mock.getOrCreateUser
export const addPoints = useSupabase ? supa.addPoints : mock.addPoints
export const getUser = useSupabase ? supa.getUser : mock.getUser

export function isUsingSupabase(){
  return useSupabase
}
