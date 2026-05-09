// app/faq/cara-jadibot/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Smartphone,
  UserPlus,
  Bot,
  HelpCircle,
  Mail,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const steps = [
  {
    icon: UserPlus,
    title: 'Daftar Akun',
    desc: 'Kirim perintah ke bot utama Asuma untuk membuat akun baru.',
    command: '.daftar username|password',
    example: 'cth: .daftar ditss|rahasia123',
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59,130,246,0.3)',
    badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  },
  {
    icon: Smartphone,
    title: 'Tambah Bot Baru',
    desc: 'Login ke dashboard, tambahkan nomor WhatsApp yang ingin dijadikan bot.',
    command: 'Dashboard - Tambah Bot',
    example: 'Masukkan nomor aktif WA kamu',
    gradient: 'from-cyan-500 to-teal-500',
    glowColor: 'rgba(6,182,212,0.3)',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
  },
  {
    icon: Zap,
    title: 'Dapatkan Pairing Code',
    desc: 'Sistem otomatis generate kode 8 digit. Berlaku 60 detik, segera gunakan.',
    command: '8 digit kode pairing',
    example: 'Berlaku 60 detik saja',
    gradient: 'from-sky-400 to-blue-500',
    glowColor: 'rgba(56,189,248,0.3)',
    badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
  },
  {
    icon: Bot,
    title: 'Bot Aktif 24 Jam',
    desc: 'Buka WhatsApp - Perangkat Tertaut - Tautkan Perangkat - Masukkan kode - Selesai.',
    command: 'WhatsApp - Perangkat Tertaut',
    example: 'Bot langsung online 24 jam',
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.3)',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  },
]

const faqs = [
  {
    q: 'Bagaimana cara daftar akun?',
    a: 'Kirim .daftar username|password ke bot utama Asuma. Contoh: .daftar ditss|rahasia123',
    icon: UserPlus,
  },
  {
    q: 'Bagaimana cara membuat bot?',
    a: 'Login ke dashboard - klik Tambah Bot - masukkan nomor WhatsApp - dapatkan kode pairing - masukkan di WhatsApp - selesai.',
    icon: Bot,
  },
  {
    q: 'Berapa banyak bot yang bisa dibuat?',
    a: 'Akun Free mendapat 2 bot. Akun Premium mendapat bot unlimited tanpa batas.',
    icon: Zap,
  },
  {
    q: 'Apakah bisa pakai WhatsApp Business?',
    a: 'Ya. WA Messenger dan WA Business keduanya didukung penuh oleh sistem Asuma.',
    icon: Smartphone,
  },
  {
    q: 'Berapa lama pairing code berlaku?',
    a: 'Kode pairing berlaku 60 detik. Jika expired, klik "Dapatkan Kode Pairing" lagi di dashboard.',
    icon: Clock,
  },
  {
    q: 'Apakah nomor saya aman?',
    a: '100% aman. Semua data tersimpan terenkripsi dan tidak pernah disebarluaskan ke pihak manapun.',
    icon: Shield,
  },
]

const supportLinks = [
  {
    icon: FaWhatsapp,
    label: 'WhatsApp Support',
    value: 'Chat Sekarang',
    href: 'https://wa.me/6283113264512',
    gradient: 'from-green-500 to-emerald-600',
    hoverBorder: 'hover:border-green-500/25',
    hoverText: 'group-hover:text-green-400',
    pill: 'bg-green-500/10 text-green-400',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@asuma.my.id',
    href: 'mailto:support@asuma.my.id',
    gradient: 'from-blue-500 to-indigo-600',
    hoverBorder: 'hover:border-blue-500/25',
    hoverText: 'group-hover:text-blue-400',
    pill: null,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
}

export default function CaraJadibotPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-600/7 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-white text-sm transition-colors duration-200 mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Kembali ke FAQ
          </Link>
        </motion.div>

        <motion.div className="mb-14" initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Panduan Resmi Asuma
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight"
          >
            Cara{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Jadibot
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-lg">
            Buat bot WhatsApp dalam 4 langkah mudah. Tidak perlu keahlian teknis, siapapun bisa.
          </motion.p>
        </motion.div>

        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Langkah - Langkah
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.005 }}
                className="group relative bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] hover:bg-white/[0.04] transition-colors duration-300 cursor-default"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.35rem] -bottom-3 w-px h-3 bg-white/[0.1] z-10" />
                )}

                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center`}
                      style={{ boxShadow: `0 4px 20px ${step.glowColor}` }}
                    >
                      <step.icon size={18} className="text-white" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#030712] border border-white/[0.1] flex items-center justify-center">
                      <span className="text-[9px] font-bold text-gray-500">{i + 1}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${step.badgeBg}`}
                      >
                        <span className="opacity-50">&rsaquo;</span> {step.command}
                      </span>
                      <span className="text-xs text-gray-600">{step.example}</span>
                    </div>
                  </div>

                  <ChevronRight
                    size={15}
                    className="text-gray-700 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mb-14 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-sky-600/20" />
          <div className="absolute inset-0 border border-blue-500/20 rounded-2xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

          <div className="relative px-7 py-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Sparkles size={15} className="text-cyan-400" />
                <p className="font-semibold text-white text-sm">Sudah paham caranya?</p>
              </div>
              <p className="text-sm text-gray-400">
                Mulai sekarang dan buat bot WhatsApp pertamamu, gratis, cepat, tanpa ribet.
              </p>
            </div>
            <Link
              href="/login"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-sm text-white hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
            >
              <Zap size={15} />
              Mulai Gratis
            </Link>
          </div>
        </motion.div>

        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={14} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Pertanyaan Umum
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          <motion.div
            className="space-y-2.5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white/[0.12] transition-colors">
                    <f.icon size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1.5">{f.q}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Butuh Bantuan?
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
          <p className="text-gray-600 text-sm mb-5">
            Tim support kami siap membantu. Hubungi lewat platform favoritmu.
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {supportLinks.map((link, i) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={i}
                  variants={fadeUp}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex items-center gap-3.5 p-4 bg-white/[0.025] border border-white/[0.07] rounded-2xl ${link.hoverBorder} hover:bg-white/[0.04] transition-colors duration-200`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-600 mb-0.5">{link.label}</p>
                    <p
                      className={`text-sm font-medium text-gray-300 ${link.hoverText} transition-colors truncate`}
                    >
                      {link.value}
                    </p>
                  </div>
                  {link.pill && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${link.pill} flex-shrink-0`}
                    >
                      Online
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className="text-gray-700 group-hover:text-gray-400 flex-shrink-0 transition-colors"
                  />
                </motion.a>
              )
            })}
          </motion.div>

          <p className="text-center text-gray-700 text-xs mt-10">
            &copy; {new Date().getFullYear()} Asuma MD &middot; Made for Indonesia
          </p>
        </section>
      </div>
    </div>
  )
}
