import { useId } from 'react';

const Input = ({ label, error, id, suffix, inputRef, ...rest }) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	return (
		<div className="field">
			{label ? (
				<label className="field__label" htmlFor={inputId}>
					{label}
				</label>
			) : null}
			<div className="input-wrap">
				<input
					id={inputId}
					ref={inputRef}
					className={`input${error ? ' input--error' : ''}`}
					aria-invalid={Boolean(error)}
					aria-describedby={[error ? `${inputId}-error` : null, suffix ? `${inputId}-suffix` : null].filter(Boolean).join(' ') || undefined}
					{...rest}
				/>
				{suffix ? (
					<div className="input-wrap__suffix" id={`${inputId}-suffix`}>
						{suffix}
					</div>
				) : null}
			</div>
			{error ? (
				<p className="field__error" id={`${inputId}-error`}>
					{error}
				</p>
			) : null}
		</div>
	);
};

export default Input;
