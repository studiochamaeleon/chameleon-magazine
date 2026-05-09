import { Category, Subcategory, CATEGORY_CONFIGS, SUBCATEGORY_CONFIGS } from '../data/categories';

interface CategoryLabelProps {
  category?: Category | null;
  subcategory?: Subcategory | null;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryLabel({ category, subcategory, size = 'sm', className = '' }: CategoryLabelProps) {
  let label = '';
  let color = '#000000';
  let textColor = '#ffffff';

  if (subcategory && SUBCATEGORY_CONFIGS[subcategory]) {
    const cfg = SUBCATEGORY_CONFIGS[subcategory];
    label = cfg.label.toUpperCase();
    color = cfg.color;
    textColor = cfg.textColor;
  } else if (category && CATEGORY_CONFIGS[category]) {
    const cfg = CATEGORY_CONFIGS[category];
    label = cfg.label.toUpperCase();
    color = cfg.color;
    textColor = cfg.textColor;
  }

  if (!label) return null;

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-block font-bold tracking-widest leading-none ${sizeClass} ${className}`}
      style={{ backgroundColor: color, color: textColor, fontFamily: 'var(--font-body)' }}
    >
      {label}
    </span>
  );
}

interface EditorPickLabelProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function EditorPickLabel({ size = 'sm', className = '' }: EditorPickLabelProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span
      className={`inline-block font-bold tracking-widest leading-none border border-black ${sizeClass} ${className}`}
      style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'var(--font-body)' }}
    >
      EDITOR'S PICK
    </span>
  );
}
