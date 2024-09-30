import React from 'react';

// Main Card component with hover effects
export function Card({ children, className, ...props }) {
  return (
    <div
      className={`rounded-lg shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl bg-gray-900 relative overflow-hidden border border-pink-500 ${className}`}
      {...props}
    >
      {/* Cosmic horror overlay for all cards */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-pink-500 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
