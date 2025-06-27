
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dhnheusptjkppwobqgep.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmhldXNwdGprcHB3b2JxZ2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTcwMDUsImV4cCI6MjA2NjUzMzAwNX0.E6rMTva2CBqTpIMKog4H6_BDBcvHG-TxcT3F2NxS228'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
