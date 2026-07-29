import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FiUsers, FiBox, FiFileText, FiClock, FiAlertTriangle, FiUserPlus } from 'react-icons/fi';
import { dashboardApi } from '../../api/dashboard.api';
import { DashboardSummary as DashboardSummaryType } from '../../types';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/common/Loader/Loader';
import Card from '../../components/common/Card/Card';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';

export default function DashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    dashboardApi
      .summary()
      .then(({ data }) => {
        if (mounted) setSummary(data.data ?? null);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader label="Loading dashboard..." />;
  if (!summary) return null;

  return (
    <div>
      <h1 className="merp-page-title">Dashboard</h1>
      <p className="merp-page-subtitle mb-4">Operations overview across all modules</p>

      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Total Customers" value={summary.customers.total} icon={<FiUsers size={20} />} accent="#4f46e5" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Active Customers" value={summary.customers.active} icon={<FiUsers size={20} />} accent="#16a34a" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Leads" value={summary.customers.leads} icon={<FiUserPlus size={20} />} accent="#d97706" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Follow-ups Due Today" value={summary.followupsDueToday} icon={<FiClock size={20} />} accent="#0ea5e9" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Total Products" value={summary.products.total} icon={<FiBox size={20} />} accent="#4f46e5" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Low Stock Items" value={summary.products.lowStock} icon={<FiAlertTriangle size={20} />} accent="#dc2626" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Draft Challans" value={summary.challans.draft} icon={<FiFileText size={20} />} accent="#6b7280" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard label="Confirmed Challans" value={summary.challans.confirmed} icon={<FiFileText size={20} />} accent="#16a34a" />
        </Col>
      </Row>

      <Card title="Quick actions">
        <Row className="g-2">
          <Col xs={6} md={3}>
            <a href="/customers" className="btn btn-outline-primary w-100">
              + Add Customer
            </a>
          </Col>
          <Col xs={6} md={3}>
            <a href="/products" className="btn btn-outline-primary w-100">
              + Add Product
            </a>
          </Col>
          <Col xs={6} md={3}>
            <a href="/inventory" className="btn btn-outline-primary w-100">
              Stock In/Out
            </a>
          </Col>
          <Col xs={6} md={3}>
            <a href="/challans" className="btn btn-outline-primary w-100">
              + New Challan
            </a>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
