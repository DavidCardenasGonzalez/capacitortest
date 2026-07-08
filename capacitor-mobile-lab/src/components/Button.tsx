import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`button button--${variant} ${className}`.trim()}
      type={type}
    >
      {children}
    </button>
  )
}
