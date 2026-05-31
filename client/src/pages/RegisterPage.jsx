import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const initialErrors = { name: '', email: '', password: '', confirmPassword: '' };

const RegisterPage = () => {
	const navigate = useNavigate();
	const { register } = useAuth();
	const { showToast } = useToast();
	const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
	const [errors, setErrors] = useState(initialErrors);
	const [apiError, setApiError] = useState('');
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const nextErrors = { ...initialErrors };

		if (!form.name.trim()) nextErrors.name = 'Name is required';
		if (!form.email.trim()) nextErrors.email = 'Email is required';
		if (!form.password.trim()) nextErrors.password = 'Password is required';
		if (!form.confirmPassword.trim()) nextErrors.confirmPassword = 'Please confirm your password';
		if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
			nextErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(nextErrors);
		return !nextErrors.name && !nextErrors.email && !nextErrors.password && !nextErrors.confirmPassword;
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
		setErrors((current) => ({ ...current, [name]: '' }));
		setApiError('');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setApiError('');

		if (!validate()) return;

		setLoading(true);

		try {
			await register(form.name.trim(), form.email.trim(), form.password);
			showToast({ type: 'success', message: 'Account created successfully.' });
			navigate('/dashboard', { replace: true });
		} catch (error) {
			setApiError(error.response?.data?.message || 'Unable to create your account right now.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-shell">
				<aside className="auth-panel">
					<div className="auth-panel__content">
						<span className="auth-brand">TaskFlow</span>
						<h1>Structure your work with clarity.</h1>
						<p>Capture tasks quickly, keep priorities visible, and move every project forward with confidence.</p>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__header">
						<p className="eyebrow">Get started</p>
						<h2>Create your account</h2>
					</div>

					{apiError ? <div className="alert alert--error">{apiError}</div> : null}

					<form className="auth-form" onSubmit={handleSubmit} noValidate>
						<Input
							label="Name"
							name="name"
							type="text"
							autoComplete="name"
							placeholder="Your name"
							value={form.name}
							onChange={handleChange}
							error={errors.name}
						/>
						<Input
							label="Email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							value={form.email}
							onChange={handleChange}
							error={errors.email}
						/>
						<Input
							label="Password"
							name="password"
							type="password"
							autoComplete="new-password"
							placeholder="Create a password"
							value={form.password}
							onChange={handleChange}
							error={errors.password}
						/>
						<Input
							label="Confirm password"
							name="confirmPassword"
							type="password"
							autoComplete="new-password"
							placeholder="Repeat your password"
							value={form.confirmPassword}
							onChange={handleChange}
							error={errors.confirmPassword}
						/>

						<Button type="submit" className="button--full" loading={loading}>
							{loading ? 'Creating account...' : 'Create account'}
						</Button>
					</form>

					<p className="auth-switch">
						Already have an account? <Link to="/login">Sign in</Link>
					</p>
				</section>
			</section>
		</main>
	);
};

export default RegisterPage;
