import { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  disabled = false,
  className = '',
  icon,
  as = 'input',
  rows = 3,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = `form-control ${error ? 'is-invalid' : ''} ${className}`;
  
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="position-relative">
        {icon && (
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <i className={`fas fa-${icon} text-muted`}></i>
          </div>
        )}
        
        {as === 'textarea' ? (
          <textarea
            className={inputClass}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            style={{ paddingLeft: icon ? '2.5rem' : '1rem' }}
            {...props}
          />
        ) : (
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            className={inputClass}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{ paddingLeft: icon ? '2.5rem' : '1rem' }}
            {...props}
          />
        )}
        
        {type === 'password' && as !== 'textarea' && (
          <button
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} text-muted`}></i>
          </button>
        )}
      </div>
      
      {error && (
        <div className="invalid-feedback d-block">
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;