// Application configuration

// In production (Vercel), use /api. In development, use localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

export const DEFAULT_USER_ID = 'user_123'; // In production, this comes from auth provider

export const ANIMATION_CONFIG = {
  autoPlayInterval: 5000,  // 5 seconds per generation in presentation mode
  transitionDuration: 700, // CSS transition duration in ms
  presentationScale: 1.3,  // Scale factor for presentation mode
};

export const LINE_STYLE = {
  stroke: '#a78bfa',       // Purple color for relationship lines
  strokeWidth: 2,
  strokeDasharray: '6 4',  // Dotted line pattern
};

