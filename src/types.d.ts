declare module '*.svg' {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement> & { 
    size?: number | string;
    color?: string;
    title?: string;
  }>;
  export default content;
}