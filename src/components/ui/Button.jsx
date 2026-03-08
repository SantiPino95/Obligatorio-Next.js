// components/ui/Button.jsx
export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  fullWidth = false,
  size='md'
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };
 const sizes = {
    sm: 'px-3 py-1.5 text-sm',   // Pequeño
    md: 'px-4 py-2 text-base',    // Mediano (default)
    lg: 'px-6 py-3 text-lg'       // Grande
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : 'px-6 py-3'}
        font-semibold
        rounded-lg
        sm
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}