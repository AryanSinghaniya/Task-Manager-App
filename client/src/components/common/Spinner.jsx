const sizeMap = {
	sm: 16,
	md: 24,
	lg: 40,
};

const Spinner = ({ size = 'md', className = '' }) => {
	const dimension = sizeMap[size] ?? sizeMap.md;

	return (
		<span
			className={`spinner ${className}`.trim()}
			style={{ width: dimension, height: dimension }}
			aria-hidden="true"
		/>
	);
};

export default Spinner;
