import { FiEdit2 } from 'react-icons/fi';
import { Followup } from '../../types';
import { formatDate, formatDateTime } from '../../utils/format';
import EmptyState from '../common/EmptyState/EmptyState';

interface FollowupHistoryProps {
  followups: Followup[];
  onEdit: (followup: Followup) => void;
  canEdit: boolean;
}

export default function FollowupHistory({ followups, onEdit, canEdit }: FollowupHistoryProps) {
  if (!followups.length) return <EmptyState message="No follow-ups recorded yet" />;

  return (
    <div className="d-flex flex-column gap-3">
      {followups.map((f) => (
        <div key={f.id} className="d-flex justify-content-between align-items-start border-bottom pb-3">
          <div>
            <div className="fw-medium">{formatDate(f.followUpDate)}</div>
            <p className="mb-1">{f.note}</p>
            <span className="text-muted small">Logged {formatDateTime(f.createdAt)}</span>
          </div>
          {canEdit && (
            <button className="btn btn-sm btn-light" onClick={() => onEdit(f)} title="Edit">
              <FiEdit2 />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
