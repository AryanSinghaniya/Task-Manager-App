import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';

const pulseAnimation = {
	animation: 'pulse 1200ms ease-in-out infinite',
};

const Navbar = ({ onLogout }) => {
	const { user } = useAuth();
	const { tasks } = useTasks();
	const { theme, toggleTheme } = useTheme();

	const overdueCount = tasks?.filter((t) => t.isOverdue).length || 0;
	const { showToast } = useToast();

	const handleBellClick = () => {
		// scroll to first overdue task and briefly highlight
		console.debug('Bell clicked, overdueCount=', overdueCount);
		const el = document.querySelector('.task-due--overdue');
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
			const card = el.closest('.task-card');
			if (card) {
				card.classList.add('task-card--highlight');
				setTimeout(() => card.classList.remove('task-card--highlight'), 2500);
			}
		} else {
			// helpful feedback if no overdue DOM element found
			if (overdueCount === 0) {
				showToast('No overdue tasks', { variant: 'info' });
			} else {
				showToast('Could not locate overdue task in the page', { variant: 'warning' });
				console.warn('Overdue tasks exist but .task-due--overdue not found in DOM');
			}
		}
	};

	return (
		<header className="navbar">
			<div className="navbar__brand">
				<span className="navbar__logo">✓</span>
				<span className="navbar__name">TaskFlow</span>
			</div>

			<div className="navbar__user">
				<Button variant="ghost" size="sm" onClick={toggleTheme} className="navbar__theme" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
					<span className="theme-icon" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 1 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
				</Button>

				<div className="navbar__avatar" aria-hidden="true">
					{getInitials(user?.name)}
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<button type="button" className="navbar__bell" onClick={handleBellClick} aria-label="Show overdue tasks">
						<span style={{ fontSize: 18 }}>🔔</span>
						{overdueCount > 0 ? (
							<span className="navbar__badge" style={overdueCount > 0 ? pulseAnimation : undefined}>
								{overdueCount}
							</span>
						) : null}
					</button>

					<div className="navbar__meta">
					<span className="navbar__label">Signed in as</span>
					<strong className="navbar__name-text">{user?.name}</strong>
					</div>

				</div>

				<Button variant="ghost" size="sm" onClick={onLogout} className="navbar__logout">
					<span aria-hidden="true">↩</span>
					<span>Logout</span>
				</Button>
			</div>
		</header>
	);
};

export default Navbar;
