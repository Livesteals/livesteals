import { supabase } from './supabase'

// Fire-and-forget activity logger. Never throws — a logging failure
// must never break the action it's recording.
export async function logActivity(type, description, extra = {}) {
  try {
    await supabase.from('activity_log').insert({
      type,
      description,
      amount: extra.amount ?? null,
      meta: extra.meta ?? null,
    })
  } catch (err) {
    console.error('activity log failed:', err)
  }
}
