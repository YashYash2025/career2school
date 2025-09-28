'use client';
'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const background = backgroundRef.current;
    if (!background) return;

    // تأثير تغيير موضع الخلفية عند تحريك الماوس
    const handleMouseMove = (e) => {
      try {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        background.style.backgroundPosition = `${x}% ${y}%`;
      } catch (error) {
        console.log('Mouse move error:', error);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 -z-10"
      style={{
        background: 'linear-gradient(45deg, #0f0f1e, #1a1a2e, #16213e)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* الأشكال العائمة */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
    </div>
  );
}

// يجب إضافة keyframes للـ animation في ملف CSS العام
// في globals.css أضف:
// @keyframes gradientShift {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// @keyframes float {
//   0%, 100% { transform: translate(0, 0) rotate(0deg); }
//   33% { transform: translate(100px, -100px) rotate(120deg); }
//   66% { transform: translate(-100px, 100px) rotate(240deg); }
// }
// .animate-float { animation: float 20s infinite ease-in-out; }
// .animation-delay-2000 { animation-delay: 2s; }
// .animation-delay-4000 { animation-delay: 4s; }
