'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: EASE },
  }),
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0E0B09 0%, #1D1308 50%, #120E0A 100%)' }}
    >
      {/* ── Decorative orbs ── */}
      <div
        className="animate-float-orb absolute top-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,150,60,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="animate-float-orb-2 absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,150,60,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Grid lines overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,150,60,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,150,60,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center gap-7 max-w-2xl mx-auto px-6 text-center"
      >
        {/* Logo */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
        >
          <Image
            src="/logo.png"
            alt="MELY•IMA"
            width={140}
            height={140}
            className="object-contain select-none drop-shadow-[0_0_30px_rgba(200,150,60,0.4)]"
            priority
          />
        </motion.div>

        {/* Brand name */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-none"
          style={{
            background: 'linear-gradient(135deg, #C8963C, #F2C060, #E8A840, #C8963C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% auto',
          }}
        >
          MELY<span>•</span>IMA
        </motion.h1>

        {/* Divider */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex items-center gap-3"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/60" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-body text-white/60 text-lg sm:text-xl leading-relaxed max-w-sm"
        >
          عباءات مصممة بعناية للمرأة الجزائرية العصرية
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(200,150,60,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="px-9 py-4 rounded-full font-heading font-black text-sm text-[#0E0B09] text-center"
            style={{ background: 'linear-gradient(135deg, #C8963C, #F0C060)' }}
          >
            تسوقي الآن
          </motion.a>
          <motion.a
            href="#statement"
            whileHover={{ scale: 1.04, borderColor: 'rgba(200,150,60,0.9)', color: '#C8963C' }}
            whileTap={{ scale: 0.97 }}
            className="px-9 py-4 rounded-full font-heading font-black text-sm text-white/70 text-center border border-white/20 transition-colors duration-300"
          >
            لماذا نحن
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} className="text-amber-500/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
