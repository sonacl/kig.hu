export function Button({
  as: Component = 'button',
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const baseClasses =
    'px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center'

  const variants = {
    primary: 'bg-school-navy text-white hover:bg-[#1a2d4b]',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-school-blue hover:underline p-0 m-0',
    ghostDanger: 'bg-transparent text-red-500 hover:underline p-0 m-0',
  }

  const mergedClasses = `${baseClasses} ${variants[variant]} ${className}`.trim()

  return (
    <Component className={mergedClasses} {...props}>
      {children}
    </Component>
  )
}
