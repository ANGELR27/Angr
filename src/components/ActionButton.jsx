import PropTypes from 'prop-types';

/**
 * Botón de acción reutilizable para la TopBar
 * Elimina código duplicado y estandariza los botones
 */
function ActionButton({ 
  icon: Icon, 
  onClick, 
  title, 
  color = 'primary',
  active = false,
  isLite = false,
  className = ''
}) {
  const colorMap = {
    primary: {
      base: 'var(--theme-primary)',
      hover: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)',
      border: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
      borderHover: 'color-mix(in srgb, var(--theme-primary) 50%, transparent)',
      glow: '0 0 20px var(--theme-glow)'
    },
    secondary: {
      base: 'var(--theme-secondary)',
      hover: 'color-mix(in srgb, var(--theme-secondary) 20%, transparent)',
      border: 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
      borderHover: 'color-mix(in srgb, var(--theme-secondary) 50%, transparent)',
      glow: '0 0 20px color-mix(in srgb, var(--theme-secondary) 60%, transparent)'
    },
    accent: {
      base: 'var(--theme-accent)',
      hover: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)',
      border: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
      borderHover: 'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
      glow: '0 0 20px color-mix(in srgb, var(--theme-accent) 60%, transparent)'
    },
    danger: {
      base: '#ef4444',
      hover: 'rgba(239, 68, 68, 0.2)',
      border: '#ef444433',
      borderHover: '#ef444466',
      glow: '0 0 20px rgba(239, 68, 68, 0.5)'
    }
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded transition-all border ${className}`}
      style={{
        padding: '6px',
        backgroundColor: active 
          ? `color-mix(in srgb, ${colors.base} 25%, transparent)`
          : 'var(--theme-background-secondary)',
        borderColor: active ? colors.borderHover : colors.border,
        boxShadow: active ? colors.glow : 'none',
        color: active ? colors.base : 'var(--theme-text)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.hover;
        e.currentTarget.style.borderColor = colors.borderHover;
        e.currentTarget.style.boxShadow = colors.glow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active 
          ? `color-mix(in srgb, ${colors.base} 25%, transparent)`
          : 'var(--theme-background-secondary)';
        e.currentTarget.style.borderColor = active ? colors.borderHover : colors.border;
        e.currentTarget.style.boxShadow = active ? colors.glow : 'none';
      }}
      title={title}
    >
      <Icon className="w-4 h-4" style={{ color: colors.base }} />
    </button>
  );
}

ActionButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'danger']),
  active: PropTypes.bool,
  isLite: PropTypes.bool,
  className: PropTypes.string
};

export default ActionButton;
