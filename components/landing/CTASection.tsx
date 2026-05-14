'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Начните поставки сегодня
          </h2>
          <p className="text-sm text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            Просмотрите каталог, добавьте товары в корзину и оформите заявку за 2 минуты
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/catalog"
              className="group flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              Открыть каталог
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://t.me/horizmo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-[#0088CC]/20 text-[#54B8E8] text-sm font-semibold rounded-xl hover:bg-[#0088CC]/30 active:scale-[0.98] transition-all border border-[#0088CC]/30"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Написать менеджеру
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
