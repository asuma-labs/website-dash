// app/faq/premium/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Zap, Infinity, Bot, HelpCircle, Mail, ChevronRight, Sparkles } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const faqs = [
  { q: 'Apa beda Free vs Premium?', a: 'Free: 2 bot, limit harian. Premium: unlimited bot, limit besar, akses fitur eksklusif.', icon: Crown },
  { q: 'Berapa harga Premium?', a: 'Premium mulai dari Rp 15.000/bulan. Cek halaman pricing untuk detail lengkap.', icon: Zap },
  { q: 'Bagaimana cara upgrade?', a: 'Hubungi support via WhatsApp untuk upgrade ke Premium.', icon: Sparkles },
  { q: 'Apakah bisa banyak bot dengan 1 Premium?', a: 'Ya! Premium dapat unlimited bot clone dengan 1 akun.', icon: Infinity },
  { q: 'Apakah ada trial Premium?', a: 'Belum ada trial. Tapi kamu bisa pakai Free dulu untuk test semua fitur dasar.', icon: Bot },
]

const supportLinks = [
  { icon: FaWhatsapp, label: 'WhatsApp Support', value: 'Chat Sekarang', href: 'https://wa.me/447920601019', gradient: 'from-green-500 to-emerald-600', hoverBorder: 'hover:border-green-500/25', hoverText: 'group-hover:text-green-400', pill: 'bg-green-500/10 text-green-400' },
  { icon: Mail, label: 'Email', value: 'support@asuma.my.id', href: 'mailto:support@asuma.my.id', gradient: 'from-blue-500 to-indigo-600', hoverBorder: 'hover:border-blue-500/25', hoverText: 'group-hover:text-blue-400', pill: null },
]

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-amber-600/8 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-orange-600/7 blur-[120px]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-5 py-14">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/faq" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-white text-sm transition-colors duration-200 mb-12 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke FAQ
          </Link>
        </motion.div>

        <motion.div className="mb-14" initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-5">
              <Crown size={12} />
              Premium & Limit
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400 bg-clip-text text-transparent">Premium</span> & Limit
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-lg">Informasi tentang upgrade dan batasan akun.</motion.p>
        </motion.div>

        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={14} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pertanyaan Umum</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
          <motion.div className="space-y-2.5" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            {faqs.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="group bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
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
          <div className="flex items-center gap-3 mb-2"><span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Butuh Bantuan?</span><div className="flex-1 h-px bg-white/[0.05]" /></div>
          <p className="text-gray-600 text-sm mb-5">Hubungi kami untuk upgrade.</p>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            {supportLinks.map((link, i) => {
              const Icon = link.icon
              return (
                <motion.a key={i} variants={fadeUp} href={link.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} className={`group flex items-center gap-3.5 p-4 bg-white/[0.025] border border-white/[0.07] rounded-2xl ${link.hoverBorder} hover:bg-white/[0.04] transition-colors duration-200`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                  <div className="min-w-0 flex-1"><p className="text-[11px] text-gray-600 mb-0.5">{link.label}</p><p className={`text-sm font-medium text-gray-300 ${link.hoverText} transition-colors truncate`}>{link.value}</p></div>
                  {link.pill && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${link.pill} flex-shrink-0`}>Online</span>}
                  <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
                </motion.a>
              )
            })}
          </motion.div>
          <p className="text-center text-gray-700 text-xs mt-10">&copy; {new Date().getFullYear()} Asuma MD &middot; Made for Indonesia</p>
        </section>
      </div>
    </div>
  )
}
