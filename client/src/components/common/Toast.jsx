import { useToastContext } from '../../context/ToastContext';

const icons = {
	success: (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	error: (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M12 9v4m0 4h.01M10.3 4.7h3.4L21 12l-7.3 7.3h-3.4L3 12l7.3-7.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	info: (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M12 17v-6m0-4h.01M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
};

const Toast = () => {
	const { toasts, removeToast } = useToastContext();

	return (
		<div className="toast-viewport" aria-live="polite" aria-atomic="true">
			{toasts.map((toast) => (
				<div key={toast.id} className={`toast toast--${toast.type}${toast.closing ? ' toast--closing' : ''}`}>
					<div className="toast__icon">{icons[toast.type] ?? icons.info}</div>
					<div className="toast__body">
						<p className="toast__message">{toast.message}</p>
						{toast.actionLabel ? (
							<button
								type="button"
								className="toast__action"
								onClick={() => {
									toast.onAction?.();
									removeToast(toast.id);
								}}
							>
								{toast.actionLabel}
							</button>
						) : null}
					</div>
					<button className="toast__close" type="button" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
						×
					</button>
				</div>
			))}
		</div>
	);
};

export default Toast;
