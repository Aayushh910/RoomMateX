import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { reports } from '../data/admin';

export const AdminReports = () => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'info';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Reports</h1>

        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getSeverityColor(report.severity)}>
                      {report.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="info">{report.type}</Badge>
                    <Badge variant={report.status === 'resolved' ? 'success' : 'warning'}>
                      {report.status}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">
                    {report.targetName}
                  </h3>
                  <p className="text-sm text-dark-600">
                    Reported by {report.reporterName} • {report.date}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <span className="font-medium">Reason: </span>
                  <span className="text-dark-700">{report.reason}</span>
                </div>
                <div>
                  <span className="font-medium">Description: </span>
                  <span className="text-dark-700">{report.description}</span>
                </div>
              </div>
              {report.status === 'pending' && (
                <div className="flex gap-3">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Mark Resolved</Button>
                  <Button size="sm" variant="danger">Take Action</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
