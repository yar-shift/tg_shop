'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, MessageCircle, Package } from 'lucide-react';

const steps = [
  {
    icon: Search,
    num: '01',
    title: 'Выберите товары',
    desc: 'Просмотрите каталог, добавьте нужные позиции в корзину с нужным количеством.',
  },
  {
    icon: ShoppingCart,
    num: '02',
    title: 'Оформите заявку',
    desc: 'Заполните короткую форму с контактами. Укажите способ связи.',
  },
  {
    icon: MessageCircle,
    num: '03',
    title: 'Подтвердите в Telegram',
    desc: 'Менеджер свяжется с вами, уточнит детали и согласует условия поставки.',
  },
  {
    icon: Package,
    num: '04',
    title: 'Получите товар',
    desc: 'Отправим вашу партию в течение 48 часов после подтверждения оплаты.',
  },
];

export default function HowItWorksSection() {
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
            Как сделать заказ
          </motion.h2>
          <p className="text-sm text-gray-400">Просто. Быстро. Надёжно.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(({ icon: Icon, num, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-100 leading-none">{num}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-gray-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
