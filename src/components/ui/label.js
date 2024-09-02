import React from 'react';

export function Label({ children, className, ...props }) {
  return <label className={`block mb-2 ${className}`} {...props}>{children}</label>;
}