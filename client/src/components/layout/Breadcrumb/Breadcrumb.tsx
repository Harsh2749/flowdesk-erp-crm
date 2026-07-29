import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 small">
        {items.map((item, idx) => (
          <li
            key={item.label}
            className={`breadcrumb-item ${idx === items.length - 1 ? 'active' : ''}`}
            aria-current={idx === items.length - 1 ? 'page' : undefined}
          >
            {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
