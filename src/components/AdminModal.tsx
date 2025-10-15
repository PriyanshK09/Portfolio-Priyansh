import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[80vh] bg-[var(--dark-bg)] rounded-xl overflow-hidden 
                    border border-[var(--border-color)] shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminModal;