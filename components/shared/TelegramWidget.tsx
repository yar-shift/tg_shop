'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function TelegramWidget() {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0088CC] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">TG Shop Next</p>
                  <p className="text-[10px] text-emerald-500 font-medium">● Онлайн</p>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Задайте вопрос или оформите заказ прямо в Telegram. Отвечаем быстро!
            </p>
            <a
              href="https://t.me/horizmo"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 bg-[#0088CC] text-white text-xs font-bold rounded-xl text-center hover:bg-[#0077BB] transition-colors"
            >
              Написать в Telegram
            </a>
            <button
              onClick={() => setVisible(false)}
              className="w-full mt-2 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Закрыть виджет
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(v => !v)}
        className="w-12 h-12 rounded-full bg-[#0088CC] shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        aria-label="Написать в Telegram"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
        </svg>
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
      </motion.button>
    </div>
  );
}
