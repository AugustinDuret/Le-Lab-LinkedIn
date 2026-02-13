import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export default function LoadingSection() {
  const { t } = useLanguage();
  const messages = t('loadingMessages');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Flask animation */}
        <div className="relative w-32 h-40 mx-auto mb-8">
          <svg
            width="128"
            height="160"
            viewBox="0 0 128 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            {/* Flask body */}
            <path
              d="M48 12h32v8h-4v40l28 52a12 12 0 01-10.6 18H34.6A12 12 0 0124 112l28-52V20h-4v-8z"
              fill="#EFF6FF"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Liquid */}
            <path
              d="M36 100l18-33.5V60h20v6.5L92 100a12 12 0 01-10.6 18H34.6A12 12 0 0124 112l12-12z"
              fill="#3B82F6"
              opacity="0.2"
            />
            {/* Bubbles */}
            <circle cx="52" cy="95" r="3" fill="#3B82F6" opacity="0.6">
              <animate attributeName="cy" values="95;60;40" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.4;0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="3;2;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="68" cy="100" r="2.5" fill="#3B82F6" opacity="0.5">
              <animate attributeName="cy" values="100;70;50" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.3;0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="2.5;1.5;0.5" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="105" r="2" fill="#3B82F6" opacity="0.5">
              <animate attributeName="cy" values="105;75;55" dur="1.8s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.3;0" dur="1.8s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="r" values="2;1.2;0.4" dur="1.8s" begin="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="75" cy="98" r="2" fill="#3B82F6" opacity="0.4">
              <animate attributeName="cy" values="98;65;45" dur="2.2s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.2;0" dur="2.2s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="2;1;0.3" dur="2.2s" begin="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Rotating message */}
        <p
          key={messageIndex}
          className="text-lg text-gray-600 font-medium animate-fade-in"
        >
          {messages[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-64 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full"
            style={{
              width: '25%',
              animation: 'progressIndeterminate 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
