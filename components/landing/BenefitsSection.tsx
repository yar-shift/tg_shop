'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, BadgeCheck, MessageCircle, RefreshCw, TrendingDown, Globe } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Быстрая доставка',
    desc: 'Отправка в течение 48 часов. Работаем с ведущими транспортными компаниями.',
    color: 'text-[#0088CC] bg-[#0088CC]/8',
  },
  {
    icon: BadgeCheck,
    title: 'Проверенное качество',
    desc: 'Каждая партия проходит контроль качества перед отправкой клиенту.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: TrendingDown,
    title: 'Оптовые цены',
    desc: 'Скидки при объёме от 10 штук. Чем больше — тем выгоднее условия.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: MessageCircle,
    title: 'Поддержка в Telegram',
    desc: 'Менеджер всегда на связи. Отвечаем быстро, решаем вопросы оперативно.',
    color: 'text-[#0088CC] bg-[#0088CC]/8',
  },
  {
    icon: RefreshCw,
    title: 'Регулярное обновление',
    desc: 'Каталог обновляется еженедельно. Новые модели и актуальные позиции.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Globe,
    title: 'Прямые поставки',
    desc: 'Работаем напрямую с производителями Китая. Без посредников.',
    color: 'text-rose-600 bg-rose-50',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
          >
            Почему выбирают нас
          </motion.h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Работаем для бизнеса, ценим надёжность и скорость
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
