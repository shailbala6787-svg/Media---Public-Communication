import React from 'react';

export default function Button({
  children, variant = 'primary', size = '', icon, onClick,
  type = 'button', disabled = false, loading = false, className = '', ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}${size ? ` btn-${size}` : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="spinner spinner-sm" />
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
