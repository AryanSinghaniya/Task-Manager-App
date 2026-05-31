import { useEffect, useId, useRef } from 'react';

const sizeMap = {
	sm: 'modal__panel--sm',
	md: 'modal__panel--md',
	lg: 'modal__panel--lg',
};

const focusableSelector =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
	const panelRef = useRef(null);
	const titleId = useId();

	useEffect(() => {
		if (!isOpen) return undefined;

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}

			if (event.key !== 'Tab') return;

			const panel = panelRef.current;
			if (!panel) return;

			const focusables = Array.from(panel.querySelectorAll(focusableSelector)).filter((element) => !element.hasAttribute('disabled'));
			if (!focusables.length) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		window.setTimeout(() => {
			const panel = panelRef.current;
			const firstFocusable = panel?.querySelector(focusableSelector);
			(firstFocusable ?? panel)?.focus?.();
		}, 0);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
			<div
				ref={panelRef}
				className={`modal__panel ${sizeMap[size] ?? sizeMap.md}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
			>
				<header className="modal__header">
					<h3 className="modal__title" id={titleId}>
						{title}
					</h3>
					<button type="button" className="modal__close" onClick={onClose} onMouseDown={(e) => e.preventDefault()} aria-label="Close modal">
						×
					</button>
				</header>
				<div className="modal__body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
