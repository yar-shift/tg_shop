'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, Image as ImageIcon, Share2 } from 'lucide-react';

export default function TelegramSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0088CC]/8 rounded-full mb-6">
              <svg className="w-3.5 h-3.5 text-[#0088CC]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              <span className="text-xs font-semibold text-[#0088CC]">Telegram-native платформа</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Товары публикуются<br />прямо в Telegram
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-sm">
              Каждый новый товар автоматически отправляется в наш Telegram-канал.
              Изображения хранятся в Telegram CDN для максимальной скорости загрузки.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Bell, title: 'Мгновенные уведомления', desc: 'Подпишитесь на канал, чтобы первым узнавать о новинках' },
                { icon: ImageIcon, title: 'Быстрая загрузка фото', desc: 'Telegram CDN обеспечивает молниеносную загрузку изображений' },
                { icon: Share2, title: 'Поделиться с партнёром', desc: 'Легко отправить карточку товара коллеге в один клик' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0088CC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#0088CC]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://t.me/horizmo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0088CC] text-white text-sm font-semibold rounded-xl hover:bg-[#0077BB] active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Подписаться на канал
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Telegram channel preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-[#EFEFF4] rounded-3xl p-4 shadow-xl max-w-sm mx-auto">
              {/* Phone chrome */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#0088CC] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">TG Shop Next</p>
                    <p className="text-[10px] text-gray-400">500 подписчиков</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-3 space-y-3 bg-[#F4F4F8]">
                  {/* Product post */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-300/50 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900 mb-1">Samsung Galaxy A55 5G</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Флагманский среднеклассник с 5G, AMOLED 6.6", Exynos 1480</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0088CC]">от 16 200 ₽</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">В наличии</span>
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex justify-center">
                    <span className="text-[9px] text-gray-400 bg-white/60 px-2 py-0.5 rounded-full">сегодня 14:23</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#0088CC]/5 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
