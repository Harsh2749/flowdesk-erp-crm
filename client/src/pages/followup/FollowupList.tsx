import { Link } from 'react-router-dom';
import { FiPhoneCall } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';

export default function FollowupList() {
  return (
    <div>
      <h1 className="merp-page-title">Follow-ups</h1>
      <p className="merp-page-subtitle mb-4">Track and manage customer follow-up activity</p>

      <Card>
        <div className="text-center py-4">
          <FiPhoneCall size={32} className="text-primary mb-3" />
          <p className="mb-3">
            Follow-ups are logged and tracked per customer. Open a customer's profile to view their
            full follow-up history and add new entries.
          </p>
          <Link to="/customers" className="btn btn-primary">
            Go to Customers
          </Link>
        </div>
      </Card>
    </div>
  );
}
