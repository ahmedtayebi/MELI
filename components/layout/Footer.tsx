'use client'

import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="font-heading font-black text-3xl tracking-tight">
              MELY<span className="text-accent">•</span>IMA
            </div>
            <p className="font-body text-white/50 text-sm leading-relaxed">
              عباءات نسائية عصرية للمرأة الجزائرية الأنيقة
            </p>
            <div className="flex gap-3 mt-2">
              {/* Instagram */}
              <a href="https://www.instagram.com/mely_ima?igsh=cTFhcG5oa2lwNnl4" target='_blank' rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/1KoHWcP4Dm/" target='_blank' rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@mely__ima?_r=1&_t=ZS-958CfpcVh0U" target='_blank' rel="noopener noreferrer" aria-label="TikTok"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white/40 uppercase tracking-widest">
              روابط سريعة
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'التشكيلة',   href: '#products'  },
                { label: 'من نحن',     href: '#statement' },
                { label: 'اطلبي الآن', href: '#products'  },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white/40 uppercase tracking-widest">
              تواصلي معنا
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: Phone,  text: '0665967348',    href: 'tel:0699596108'         },
                { icon: Mail,   text: 'info@melyima.dz', href: 'mailto:info@melyima.dz' },
                { icon: MapPin, text: 'بسكرة',         href: '#'                      },
              ].map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-2 font-body text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  <Icon size={15} className="text-accent flex-shrink-0" />
                  <span>{text}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-6">
        <p className="text-center font-body text-white/30 text-xs">
          © {new Date().getFullYear()} MELY•IMA — كل الحقوق محفوظة
        </p>
      </div>

    </footer>
  )
}
