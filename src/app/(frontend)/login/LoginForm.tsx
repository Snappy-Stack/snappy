'use client'

import React, { useState } from 'react'
import { Field, Tabs } from '@ark-ui/react'
import { Mail, Lock, ShieldCheck, Zap, ArrowRight, Github } from 'lucide-react'
import { login, requestMagicLink } from './actions'

export const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('magic')
  const [isPending, setIsPending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  // Controlled state for Password tab
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      await requestMagicLink(formData)
      setIsSent(true)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full max-w-[25rem] animate-in fade-in zoom-in duration-500">
      <div className="relative group">
        <div className="relative overflow-hidden rounded-[2rem] bg-snappy-card/80 backdrop-blur-3xl border border-snappy-border shadow-2xl p-8 sm:p-10">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white fill-current" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">
              SNAPPY <span className="text-secondary">Auth</span>
            </h1>
            <p className="text-xs font-bold text-snappy-fg/30 uppercase tracking-[0.2em] mt-2">
              Premium Portal v1.5
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-[100px]" />
            <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Demo Accounts
            </h4>
            <div className="space-y-2 text-xs font-medium text-foreground/80 relative z-10">
              <form action={login}>
                <input type="hidden" name="email" value="admin@snappy.io" />
                <input type="hidden" name="password" value="snappy123" />
                <button
                  type="submit"
                  className="w-full flex justify-between items-center bg-background hover:bg-background/80 transition-colors rounded-lg p-3 border border-snappy-border text-left cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      A
                    </div>
                    <div>
                      <span className="block font-bold text-primary mb-0.5">Admin Role</span>
                      <span className="text-foreground/60 text-[10px]">admin@snappy.io</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </form>
              <form action={login}>
                <input type="hidden" name="email" value="user@snappy.io" />
                <input type="hidden" name="password" value="snappy123" />
                <button
                  type="submit"
                  className="w-full flex justify-between items-center bg-background hover:bg-background/80 transition-colors rounded-lg p-3 border border-snappy-border text-left cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                      U
                    </div>
                    <div>
                      <span className="block font-bold text-secondary mb-0.5">User Role</span>
                      <span className="text-foreground/60 text-[10px]">user@snappy.io</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-snappy-border flex-1" />
            <span className="text-[10px] font-bold text-snappy-fg/40 uppercase tracking-widest">
              or sign in with
            </span>
            <div className="h-px bg-snappy-border flex-1" />
          </div>

          <Tabs.Root
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            className="w-full"
          >
            <Tabs.List className="flex p-1 bg-background rounded-xl mb-8 border border-snappy-border">
              <Tabs.Trigger
                value="magic"
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === 'magic'
                    ? 'bg-snappy-card text-primary shadow-sm'
                    : 'text-snappy-fg/40 hover:text-snappy-fg'
                }`}
              >
                Smart Link
              </Tabs.Trigger>
              <Tabs.Trigger
                value="password"
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === 'password'
                    ? 'bg-snappy-card text-primary shadow-sm'
                    : 'text-snappy-fg/40 hover:text-snappy-fg'
                }`}
              >
                Password
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="magic">
              {isSent ? (
                <div className="text-center py-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-bold">Check your inbox ⚡</h3>
                  <p className="text-sm text-foreground0">
                    We've sent a magic entry link to your email. It expires in 15 minutes.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Try another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-6">
                  <Field.Root>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-snappy-fg/30 group-focus-within/input:text-primary transition-colors" />
                      <Field.Input
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="w-full bg-background border border-snappy-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </Field.Root>
                  <button
                    disabled={isPending}
                    type="submit"
                    className="group w-full bg-primary text-white rounded-2xl py-3.5 text-sm font-black shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPending ? 'DEPLOYING LINK...' : 'SEND MAGIC LINK'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </Tabs.Content>

            <Tabs.Content value="password">
              <form action={login} className="space-y-4">
                <Field.Root>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-snappy-fg/30 group-focus-within/input:text-primary transition-colors" />
                    <Field.Input
                      name="email"
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-background border border-snappy-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </Field.Root>
                <Field.Root>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-snappy-fg/30 group-focus-within/input:text-primary transition-colors" />
                    <Field.Input
                      name="password"
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-snappy-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </Field.Root>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-[10px] font-bold text-snappy-fg/40 hover:text-snappy-fg uppercase tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white rounded-2xl py-3.5 text-sm font-black shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  SECURE SIGN IN
                </button>
              </form>
            </Tabs.Content>
          </Tabs.Root>

          {/* Social Proof / Alternative Auth */}
          <div className="mt-8 pt-8 border-t border-snappy-border">
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-3 w-full border border-snappy-border rounded-2xl py-3 text-xs font-bold hover:bg-background transition-colors">
                <Github className="w-4 h-4" />
                CONTINUE WITH GITHUB
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-snappy-fg/30 font-medium">Protected by SNAPPY Guard System</p>
      </div>
    </div>
  )
}
