import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const initialErrors = { email: '', password: '' };

const LoginPage = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { showToast } = useToast();
	const [form, setForm] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState(initialErrors);
	const [apiError, setApiError] = useState('');
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const nextErrors = { ...initialErrors };

		if (!form.email.trim()) nextErrors.email = 'Email is required';
		if (!form.password.trim()) nextErrors.password = 'Password is required';

		setErrors(nextErrors);
		return !nextErrors.email && !nextErrors.password;
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
			await login(form.email.trim(), form.password);
			showToast({ type: 'success', message: 'Signed in successfully.' });
			navigate('/dashboard', { replace: true });
		} catch (error) {
			setApiError(error.response?.data?.message || 'Unable to sign in at the moment.');
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
						<h1>Plan less. Finish more.</h1>
						<p>Organize work, track progress, and keep every task moving in one focused workspace.</p>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__header">
						<p className="eyebrow">Welcome back</p>
						<h2>Sign in to continue</h2>
					</div>

					{apiError ? <div className="alert alert--error">{apiError}</div> : null}

					<form className="auth-form" onSubmit={handleSubmit} noValidate>
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
							autoComplete="current-password"
							placeholder="Enter your password"
							value={form.password}
							onChange={handleChange}
							error={errors.password}
						/>

						<Button type="submit" className="button--full" loading={loading}>
							{loading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>

					<p className="auth-switch">
						New here? <Link to="/register">Create an account</Link>
					</p>
				</section>
			</section>
		</main>
	);
};

export default LoginPage;
