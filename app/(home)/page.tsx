// app/page.tsx 
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bot, Shield, Sparkles, Download, Gamepad2, Wrench,
  Users, Crown, Star, TrendingUp, Server, Gift, Rocket,
  Lock, Globe, Coffee, CheckCircle, MessageCircle, HelpCircle,
  Wand2, Settings, UserCheck, ArrowRight, Smartphone, Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const currentYear = new Date().getFullYear()

  const statsData = [
    { value: '1,200+', label: 'Pengguna Aktif', icon: Users },
    { value: '3,500+', label: 'Bot Dibuat', icon: Bot },
    { value: '890+', label: 'Online Sekarang', icon: Server },
    { value: '99.9%', label: 'Uptime', icon: TrendingUp },
  ]

  const mainFeatures = [
    {
      icon: Download,
      title: 'Universal Media Extractor',
      desc: 'Download dari TikTok, YouTube, Instagram, Facebook tanpa watermark',
      highlight: 'Tanpa batas',
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-900/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600'
    },
    {
      icon: Gamepad2,
      title: 'Engagement Suite',
      desc: 'Tebak gambar, kuis, suit, dadu, dan 20+ game seru lainnya',
      highlight: '20+ Game',
      bg: 'from-sky-50 to-blue-50 dark:from-sky-950/50 dark:to-blue-900/30',
      iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600'
    },
    {
      icon: Wrench,
      title: 'Productivity Toolkit',
      desc: 'Buat stiker, generate QR, cek cuaca, translate, short link, dll',
      highlight: '30+ Tools',
      bg: 'from-cyan-50 to-teal-50 dark:from-cyan-950/50 dark:to-teal-900/30',
      iconBg: 'bg-gradient-to-br from-cyan-400 to-teal-600'
    },
  ]

  const testimonials = [
    {
      name: 'Rizky Aditya',
      role: 'CEO TechCorp Indonesia',
      text: 'Asuma Bot handle 10.000+ pelanggan kami setiap bulan. Automation yang seamless!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky',
    },
    {
      name: 'Dian Purnama',
      role: 'Digital Agency Owner',
      text: 'Universal Media Extractor-nya game changer! Satu tools untuk semua kebutuhan.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian',
    },
    {
      name: 'Budi Santoso',
      role: 'Community Manager',
      text: 'Engagement suite bikin grup selalu rame. Retention naik 300%!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    },
  ]

  const faqs = [
    { q: 'Apakah aman menggunakan Asuma Bot?', a: '100% aman! Session terenkripsi end-to-end, data tidak disimpan di server kami.' },
    { q: 'Bisa kena banned WhatsApp?', a: 'Bot kami menggunakan WhatsApp Multi-Device resmi. Risiko banned sangat rendah.' },
    { q: 'Berapa biaya bulanannya?', a: '2 bot pertama GRATIS seumur hidup. Bot ketiga dst mulai dari 25k/bulan.' },
    { q: 'Support jam berapa?', a: 'Tim support kami standby 24/7 via WhatsApp dan Telegram.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/15 dark:bg-blue-900/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200/15 dark:bg-cyan-900/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_0.8px,transparent_0.8px)] dark:bg-[radial-gradient(#334155_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-30" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                      <Image
                        src="/icons/icon.webp"
                        alt="Asuma"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                  </div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Asuma</span>
                  <span className="hidden sm:inline px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">v2.0</span>
                </div>

                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 dark:bg-emerald-900/30 backdrop-blur-sm rounded-full border border-emerald-200/50 dark:border-emerald-700/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">All Systems Online</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Login
                </Link>
                <Link href="/login">
                  <button className="group px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-white text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition flex items-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-medium">#1 WhatsApp Bot Multi-Device di Indonesia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 px-2">
                <span className="text-gray-900 dark:text-white">Bot WhatsApp </span>
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">Tanpa Ribet</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                Cukup pairing code 8 digit. <span className="font-semibold text-blue-600 dark:text-blue-400">2 bot GRATIS</span> seumur hidup. Online 24 jam meski HP mati.
              </p>

              <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Session terenkripsi • Tanpa scan QR • Aktif 24/7</span>
              </div>

              <Link href="/login">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full font-bold text-white text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <Rocket className="w-5 h-5" />
                  Clone Bot Gratis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                atau{' '}
                <Link href="#features" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">lihat fitur lengkap →</Link>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12">
                {statsData.map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50">
                    <stat.icon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="py-16 scroll-mt-20">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">Simple & Fast</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Aktif dalam 3 Langkah</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Hanya butuh 5 menit untuk membuat bot profesional Anda.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 dark:from-blue-700 dark:via-cyan-700 dark:to-sky-700" />

                {[
                  { step: '01', icon: UserCheck, title: 'Hubungkan Akun', desc: 'Masuk dengan pairing code 8 digit.' },
                  { step: '02', icon: Settings, title: 'Konfigurasi Bot', desc: 'Pilih fitur dan atur preferensi.' },
                  { step: '03', icon: Rocket, title: 'Nikmati Hasilnya', desc: 'Bot langsung online 24/7.' },
                ].map((item, idx) => (
                  <div key={idx} className="relative text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/50 flex items-center justify-center shadow-lg relative z-10">
                      <item.icon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-6xl font-black text-blue-100 dark:text-blue-900/30 -z-5">{item.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="py-16 scroll-mt-20">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">Fitur Yang Bikin Beda</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">Lebih dari Sekadar Auto-Reply</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {mainFeatures.map((feature, idx) => (
                  <div key={idx} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-full hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{feature.highlight}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">Testimonial</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">Dipercaya Ratusan Pengguna</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{item.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <Image src={item.avatar} alt={item.name} width={40} height={40} className="rounded-full border-2 border-white dark:border-gray-700" unoptimized />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl mx-4">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1.5 mb-4">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">FAQ</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pertanyaan Yang Sering Diajukan</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">Q:</span>
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">A:</span>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4 text-blue-500" /> End-to-End Encrypted
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Server className="w-4 h-4 text-blue-500" /> 99.9% Uptime SLA
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MessageCircle className="w-4 h-4 text-blue-500" /> Support 24/7
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-blue-500/25">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Siap Punya Bot WhatsApp Sendiri?</h2>
                <p className="text-white/80 mb-6 max-w-md mx-auto">Daftar dalam 30 detik. Gratis 2 bot pertama — tanpa kartu kredit.</p>
                <Link href="/login">
                  <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
                    <Bot className="w-5 h-5" /> Mulai Sekarang — Gratis <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image src="/icons/asuma.jpg" alt="Asuma" width={32} height={32} className="w-full h-full object-cover" unoptimized />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Asuma MD</span>
                <span className="text-gray-400 text-sm">© {currentYear}</span>
              </div>

              <div className="flex gap-6 text-sm">
                <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Tentang</Link>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Privasi</Link>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Syarat</Link>
              </div>

              <div className="text-gray-400 text-xs flex items-center gap-1">
                <Globe className="w-3 h-3" /> Powered by Asuma MD
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
