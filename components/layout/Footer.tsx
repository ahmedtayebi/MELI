'use client'

import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mely_ima?igsh=cTFhcG5oa2lwNnl4',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1KoHWcP4Dm/',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@mely__ima?_r=1&_t=ZS-958CfpcVh0U',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
]

const QUICK_LINKS = [
  { label: 'التشكيلة',    href: '#products'  },
  { label: 'من نحن',      href: '#statement' },
  { label: 'اطلبي الآن', href: '#products'  },
]

const CONTACT = [
  { icon: Phone,  text: '0665967348',       href: 'tel:0665967348'         },
  { icon: Mail,   text: 'info@melyima.dz',  href: 'mailto:info@melyima.dz' },
  { icon: MapPin, text: 'بسكرة، الجزائر',  href: '#'                      },
]

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0E0B09 0%, #1A1208 55%, #0E0B09 100%)' }}
    >
      {/* Decorative orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(200,150,60,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Top divider */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,60,0.4), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Image
              src="/logo.png"
              alt="MELY•IMA"
              width={90}
              height={36}
              style={{ width: 'auto', height: '36px', filter: 'brightness(1.05)' }}
              className="object-contain select-none"
            />
            <p className="font-body text-white/45 text-sm leading-relaxed">
              عباءات نسائية عصرية للمرأة الجزائرية الأنيقة
            </p>
            <div className="flex gap-2.5 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, color: '#C8963C', borderColor: 'rgba(200,150,60,0.5)' }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 transition-colors duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3
              className="font-heading font-bold text-xs tracking-widest uppercase"
              style={{ color: 'rgba(200,150,60,0.6)' }}
            >
              روابط سريعة
            </h3>
            <div className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ x: -4, color: '#C8963C' }}
                  transition={{ duration: 0.2 }}
                  className="font-body text-white/50 hover:text-white text-sm transition-colors duration-200"
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3
              className="font-heading font-bold text-xs tracking-widest uppercase"
              style={{ color: 'rgba(200,150,60,0.6)' }}
            >
              تواصلي معنا
            </h3>
            <div className="flex flex-col gap-3">
              {CONTACT.map(({ icon: Icon, text, href }) => (
                <motion.a
                  key={text}
                  href={href}
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5 font-body text-white/50 hover:text-white text-sm transition-colors duration-200"
                >
                  <Icon size={14} style={{ color: '#C8963C', flexShrink: 0 }} />
                  <span>{text}</span>
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-10 py-5 px-6"
        style={{ borderTop: '1px solid rgba(200,150,60,0.1)' }}
      >
        <p className="text-center font-body text-white/25 text-xs">
          © {new Date().getFullYear()} MELY•IMA — كل الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}
