import Spinner from './Spinner';

const variantClasses = {
	primary: 'button--primary',
	secondary: 'button--secondary',
	danger: 'button--danger',
	ghost: 'button--ghost',
};

const sizeClasses = {
	sm: 'button--sm',
	md: 'button--md',
	lg: 'button--lg',
};

const Button = ({
	variant = 'primary',
	size = 'md',
	loading = false,
	disabled = false,
	className = '',
	type = 'button',
	children,
	...rest
}) => {
	const isDisabled = disabled || loading;

	return (
		<button
			type={type}
			className={[
				'button',
				variantClasses[variant] ?? variantClasses.primary,
				sizeClasses[size] ?? sizeClasses.md,
				className,
			]
				.filter(Boolean)
				.join(' ')}
			disabled={isDisabled}
			aria-busy={loading}
			{...rest}
		>
			{loading ? <Spinner size="sm" className="button__spinner" /> : null}
			<span>{children}</span>
		</button>
	);
};

export default Button;
