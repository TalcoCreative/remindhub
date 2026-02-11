import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { kpiData, dummyLeads, statusLabels, type LeadStatus } from '@/data/dummy';
import {
  Users, TrendingUp, Recycle, DollarSign, Clock, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function StatCard({
  title, value, subtitle, icon: Icon, trend,
}: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; trend?: 'up' | 'down';
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-success" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-destructive" />}
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const funnelSteps: { key: LeadStatus; color: string }[] = [
  { key: 'new', color: 'bg-info' },
  { key: 'in_progress', color: 'bg-primary' },
  { key: 'picked_up', color: 'bg-accent' },
  { key: 'completed', color: 'bg-success' },
  { key: 'lost', color: 'bg-destructive' },
];

export default function Dashboard() {
  const funnelData = funnelSteps.map((s) => ({
    ...s,
    label: statusLabels[s.key],
    count: s.key === 'new' ? kpiData.newLeads : s.key === 'in_progress' ? kpiData.inProgress :
      s.key === 'picked_up' ? kpiData.pickedUp : s.key === 'completed' ? kpiData.deals : kpiData.lost,
  }));
  const maxFunnel = Math.max(...funnelData.map((d) => d.count));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of RemindHub operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={kpiData.totalLeads} subtitle="+12% vs last month" icon={Users} trend="up" />
        <StatCard title="Total KG Collected" value={`${kpiData.totalKg.toLocaleString()} kg`} subtitle="B2C: 3,200 · B2B: 9,250" icon={Recycle} />
        <StatCard title="Monthly Revenue" value={`Rp ${(kpiData.monthlyRevenue / 1e6).toFixed(0)}M`} subtitle="+8% vs last month" icon={DollarSign} trend="up" />
        <StatCard title="Conversion Rate" value={`${kpiData.conversionRate}%`} subtitle="Avg close: 4.2 days" icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" /> Lead Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelData.map((step) => (
              <div key={step.key} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm text-muted-foreground">{step.label}</span>
                <div className="flex-1">
                  <div className="h-7 rounded-md bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-md ${step.color} flex items-center px-2 text-xs font-semibold text-primary-foreground transition-all`}
                      style={{ width: `${Math.max((step.count / maxFunnel) * 100, 12)}%` }}
                    >
                      {step.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" /> Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="mt-1 text-xl font-bold">{kpiData.avgResponseTime}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Avg Close</p>
                <p className="mt-1 text-xl font-bold">{kpiData.avgCloseTime}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Best Source</p>
                <p className="mt-1 text-xl font-bold">{kpiData.bestSource}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Deals Closed</p>
                <p className="mt-1 text-xl font-bold">{kpiData.deals}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Recent Leads</p>
              <div className="space-y-2">
                {dummyLeads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.area} · {lead.estimatedKg} kg</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{statusLabels[lead.status]}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
