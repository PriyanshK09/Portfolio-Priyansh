import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
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
          className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden 
                     shadow-[0_0_100px_-12px_rgba(0,229,160,0.5)] border border-[#00E5A0]/20"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--dark-bg)]/80 backdrop-blur-sm 
                       hover:bg-[var(--dark-bg)] transition-colors z-10 group"
          >
            <X className="h-6 w-6 text-white group-hover:text-[var(--primary)] transition-colors" />
          </button>

          {/* PDF Viewer */}
          <iframe
            src="/assets/resume.pdf#toolbar=0"
            className="w-full h-full"
            title="Resume"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeModal;