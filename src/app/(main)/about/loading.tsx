'use client';

import { useState, useEffect } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // شبیه‌سازی افزایش تدریجی درصد
    const interval = setInterval(() => {
      setProgress((old) => {
        const next = old + Math.random() * 10;
        return next >= 90 ? 90 : next;
      });
    }, 300);

    // وقتی صفحه کامل لود شد (تصاویر، CSS و JS)
    const handleLoad = () => {
      clearInterval(interval);
      setProgress(100);

      // کمی صبر کن تا انیمیشن آخر هم کامل اجرا شه
      setTimeout(() => {
        setLoaded(true);
      }, 500); // 500ms تأخیر برای smooth بودن
    };

    // اگر قبلاً صفحه لود شده باشه
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (loaded) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-500">
      <div className="w-64 h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded transition-all duration-300"
          style={{ width: `${Math.floor(progress)}%` }}
        ></div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">{Math.floor(progress)}%</p>
    </div>
  );
}
