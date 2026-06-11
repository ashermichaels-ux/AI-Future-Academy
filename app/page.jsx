'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setMessage('Creating account...')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Check your email to confirm signup! 🎉')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
          AI Future Academy
        </
