'use client';

import React from 'react';

/**
 * AnswerCard Component - Matching Big5 version selection cards design
 * Beautiful card design for assessment answer options
 * 
 * @param {number} value - The value of this answer option
 * @param {string} emoji - Emoji to display
 * @param {string} label - Label text in Arabic
 * @param {string} color - Primary color for this option (hex format)
 * @param {boolean} isSelected - Whether this option is currently selected
 * @param {function} onClick - Click handler
 */
const AnswerCard = ({
  value,
  emoji,
  label,
  color,
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${color}50, ${color}30), linear-gradient(180deg, rgba(255,255,255,0.08), transparent)`
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.5))',
        backdropFilter: 'blur(20px)',
        borderRadius: '18px',
        padding: '20px 15px',
        border: isSelected ? `3px solid ${color}` : `2px solid rgba(255, 255, 255, 0.15)`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        transform: isSelected ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isSelected 
          ? `0 8px 25px ${color}40, inset 0 1px 0 rgba(255,255,255,0.15)` 
          : '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${color}35, inset 0 1px 0 rgba(255,255,255,0.15)`;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.borderWidth = '2px';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderWidth = '2px';
        }
      }}
    >
      {/* Glossy overlay - always visible */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
        borderRadius: '18px 18px 0 0',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Animated shine effect - stronger */}
      {isSelected && (
        <div 
          style={{
            position: 'absolute',
            top: '-100%',
            left: '-100%',
            width: '300%',
            height: '300%',
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
            animation: 'shine 2s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 3
          }} 
        />
      )}

      {/* Icon */}
      <div style={{
        fontSize: '40px',
        marginBottom: '10px',
        textAlign: 'center',
        filter: isSelected ? `drop-shadow(0 0 15px ${color}) brightness(1.2)` : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 2
      }}>
        {emoji}
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: isSelected ? '#ffffff' : '#e5e7eb',
        marginBottom: '8px',
        textAlign: 'center',
        fontFamily: 'Cairo, Arial, sans-serif',
        direction: 'rtl',
        position: 'relative',
        zIndex: 2,
        textShadow: isSelected ? `0 0 20px ${color}, 0 2px 4px rgba(0,0,0,0.5)` : '0 2px 4px rgba(0,0,0,0.3)',
        filter: 'brightness(1.1)'
      }}>
        {label}
      </h2>

      {/* Selected indicator */}
      {isSelected && (
        <div style={{
          marginTop: '10px',
          padding: '6px 10px',
          background: `linear-gradient(135deg, ${color}, ${color}E6)`,
          borderRadius: '10px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl',
          animation: 'fadeIn 0.3s ease',
          position: 'relative',
          zIndex: 2,
          boxShadow: `0 4px 20px ${color}90, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2)`
        }}>
          ✓ تم الاختيار
        </div>
      )}

      {/* Inline animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shine {
          0% { transform: translateX(-150%) translateY(-150%) rotate(30deg); }
          100% { transform: translateX(150%) translateY(150%) rotate(30deg); }
        }
      `}</style>
    </div>
  );
};

export default AnswerCard;
