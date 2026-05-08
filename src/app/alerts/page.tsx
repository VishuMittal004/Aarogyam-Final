'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, ShieldAlert, Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  severity: string;
  category: string;
}

const severityConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  critical: { icon: <ShieldAlert className="h-6 w-6" />, color: 'text-red-500', bg: 'bg-red-500/10' },
  high: { icon: <AlertTriangle className="h-6 w-6" />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  medium: { icon: <Bell className="h-6 w-6" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  info: { icon: <Info className="h-6 w-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((d) => setAlerts(d.alerts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);
  const categories = ['all', 'critical', 'high', 'medium', 'info'];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Health Alerts</h1>
        <p className="text-muted-foreground text-lg">Real-time public health warnings and advisories</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/50 text-muted-foreground hover:bg-card border border-border/50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading alerts...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No alerts found</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            return (
              <Card key={alert.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                      <span className={config.color}>{config.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                          {alert.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-foreground">{alert.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {alert.date} — {alert.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-foreground leading-relaxed">{alert.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
