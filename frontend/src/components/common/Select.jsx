const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error, 
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const selectClass = `form-select ${error ? 'is-invalid' : ''} ${className}`;
  
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <select
        className={selectClass}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="invalid-feedback d-block">
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;