import React from 'react';
import './ModernGlassCard.css';

const ModernGlassCard = ({ children, header, icon, accentColor = '#06b6d4', style = {} }) => (
  <div className="modern-glass-card" style={{ borderColor: accentColor, ...style }}>
    {icon && <div className="modern-glass-card-icon" style={{ color: accentColor }}>{icon}</div>}
    {header && <div className="modern-glass-card-header" style={{ color: accentColor }}>{header}</div>}
    <div className="modern-glass-card-content">{children}</div>
  </div>
);

export default ModernGlassCard;
