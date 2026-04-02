import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 40 }) => {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Hexagon Frame */}
        <motion.path
          d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Mirrored Curved Paths (Matching User Image) */}
        <motion.path
          d="M50 35C41.7157 35 35 41.7157 35 50C35 58.2843 41.7157 65 50 65"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, rotate: -45 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M50 35C58.2843 35 65 41.7157 65 50C65 58.2843 58.2843 65 50 65"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, rotate: 45 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />

        {/* Central Core Node */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 1.2 
          }}
        />

        {/* Pulse Effect */}
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.8],
            opacity: [0.5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeOut" 
          }}
        />
      </svg>
    </div>
  );
};
