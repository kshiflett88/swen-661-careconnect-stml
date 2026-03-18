import { sizing, typography, priority } from '../constants/accessibility';

export function PriorityBadge({ level }) {
  const config = priority[level];

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizing.spaceXs,
    padding: `${sizing.spaceXs}px ${sizing.spaceSm}px`,
    borderRadius: sizing.borderRadiusSm,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightMedium,
    backgroundColor: config.backgroundColor,
    color: config.color,
    border: `1px solid ${config.color}`,
  };

  return (
    <span style={badgeStyles} aria-label={config.label} role="status">
      <span aria-hidden="true">{config.badge}</span>
      <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
    </span>
  );
}
