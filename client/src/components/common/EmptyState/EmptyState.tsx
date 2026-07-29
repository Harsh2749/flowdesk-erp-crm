import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ message = 'No records found' }: { message?: string }) {
  return (
    <div className="merp-empty-state">
      <FiInbox size={32} className="mb-2" />
      <p className="mb-0">{message}</p>
    </div>
  );
}
