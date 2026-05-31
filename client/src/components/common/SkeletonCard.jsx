const SkeletonCard = () => {
	return (
		<div className="task-card task-card--skeleton" aria-hidden="true">
			<div className="skeleton skeleton__accent" />
			<div className="skeleton__top">
				<span className="skeleton skeleton__pill" />
				<span className="skeleton skeleton__pill skeleton__pill--small" />
			</div>
			<div className="skeleton skeleton__title" />
			<div className="skeleton skeleton__line" />
			<div className="skeleton skeleton__line skeleton__line--short" />
			<div className="skeleton__bottom">
				<span className="skeleton skeleton__meta" />
				<span className="skeleton skeleton__meta skeleton__meta--small" />
			</div>
		</div>
	);
};

export default SkeletonCard;
