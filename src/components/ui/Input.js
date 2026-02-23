export function Input({ className = '', variant = 'outline', ...props }) {
  const baseClasses = 'w-full outline-none transition-colors'

  const variants = {
    outline:
      'px-3 py-2 border border-gray-300 shadow-sm rounded text-sm focus:border-school-navy focus:ring-1 focus:ring-school-navy',
    underlined:
      'text-2xl font-bold px-0 border-b border-gray-200 focus:border-school-navy pb-2 bg-transparent',
  }

  const mergedClasses = `${baseClasses} ${variants[variant]} ${className}`.trim()

  return <input className={mergedClasses} {...props} />
}
