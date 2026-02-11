import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { statusLabels, type LeadStatus } from '@/data/dummy';
import { Users, TrendingUp, Recycle, DollarSign, BarChart3, ArrowUpRight, Loader2, MessageCircle, CheckCircle2, Eye, Clock, Timer, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLeads } from '@/hooks/useLeads';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const funnelOrder: LeadStatus[] = ['new', 'not_followed_up', 'followed_up', 'in_progress', 'picked_up', 'sign_contract', 'completed'];

function formatDuration(ms: number): string {
  if (ms <= 0) return '-';
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}

function StatCard({ title, value, subtitle, icon: Icon }: {
  title: string; value: string | number; subtitle?: string; icon: React.ElementType;
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
          {subtitle && <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><ArrowUpRight className="h-3 w-3 text-success" />{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const funnelSteps: { key: LeadStatus; color: string }[] = [
  { key: 'new', color: 'bg-info' },
  { key: 'not_followed_up', color: 'bg-warning' },
  { key: 'followed_up', color: 'bg-secondary' },
  { key: 'in_progress', color: 'bg-primary' },
  { key: 'picked_up', color: 'bg-accent' },
  { key: 'sign_contract', color: 'bg-primary' },
  { key: 'completed', color: 'bg-success' },
  { key: 'lost', color: 'bg-destructive' },
];

export default function Dashboard() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: chats = [] } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('chats').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_audit_log')
        .select('lead_id, old_value, new_value, created_at')
        .eq('field_name', 'status')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Filter leads created today
  const todayLeads = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    return leads.filter((l) => l.created_at >= startOfDay);
  }, [leads]);

  const stats = useMemo(() => {
    const totalKg = todayLeads.reduce((s, l) => s + (Number(l.actual_kg) || Number(l.estimated_kg) || 0), 0);
    const b2cKg = todayLeads.filter((l) => l.type === 'b2c').reduce((s, l) => s + (Number(l.actual_kg) || Number(l.estimated_kg) || 0), 0);
    const b2bKg = todayLeads.filter((l) => l.type === 'b2b').reduce((s, l) => s + (Number(l.actual_kg) || Number(l.estimated_kg) || 0), 0);
    const deals = todayLeads.filter((l) => l.status === 'completed');
    const revenue = todayLeads.reduce((s, l) => s + (Number(l.potential_value) || 0), 0);
    const conversion = todayLeads.length > 0 ? Math.round((deals.length / todayLeads.length) * 100) : 0;
    const answered = chats.filter((c) => c.is_answered).length;
    const unanswered = chats.filter((c) => !c.is_answered).length;

    // Avg response time from chats that have first_response_at
    const responseTimes = chats
      .filter((c) => c.first_response_at && c.created_at)
      .map((c) => new Date(c.first_response_at!).getTime() - new Date(c.created_at).getTime());
    const avgResponseMs = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;

    const sourceMap: Record<string, { count: number; kg: number; value: number }> = {};
    for (const l of todayLeads) {
      const src = l.source || 'manual';
      if (!sourceMap[src]) sourceMap[src] = { count: 0, kg: 0, value: 0 };
      sourceMap[src].count++;
      sourceMap[src].kg += Number(l.actual_kg) || Number(l.estimated_kg) || 0;
      sourceMap[src].value += Number(l.potential_value) || 0;
    }
    const topSource = Object.entries(sourceMap).sort((a, b) => b[1].count - a[1].count)[0];

    return { totalKg, b2cKg, b2bKg, revenue, conversion, deals: deals.length, sourceMap, topSource, answered, unanswered, avgResponseMs };
  }, [todayLeads, chats]);

  // Calculate per-transition funnel durations from audit log
  const transitionDurations = useMemo(() => {
    const durations: Record<string, number[]> = {};
    // Group audit logs by lead_id
    const byLead: Record<string, typeof auditLogs> = {};
    for (const log of auditLogs) {
      if (!byLead[log.lead_id]) byLead[log.lead_id] = [];
      byLead[log.lead_id].push(log);
    }

    for (const logs of Object.values(byLead)) {
      // logs are already sorted by created_at
      for (let i = 0; i < logs.length; i++) {
        const from = logs[i].old_value || '';
        const to = logs[i].new_value || '';
        const key = `${from}→${to}`;
        const prevTime = i === 0
          ? leads.find((l) => l.id === logs[i].lead_id)?.created_at
          : logs[i - 1].created_at;
        if (prevTime) {
          const dur = new Date(logs[i].created_at).getTime() - new Date(prevTime).getTime();
          if (dur > 0) {
            if (!durations[key]) durations[key] = [];
            durations[key].push(dur);
          }
        }
      }
    }

    // Filter to main funnel transitions and compute averages
    const results: { from: string; to: string; avgMs: number; count: number }[] = [];
    for (let i = 0; i < funnelOrder.length - 1; i++) {
      const key = `${funnelOrder[i]}→${funnelOrder[i + 1]}`;
      const times = durations[key];
      if (times && times.length > 0) {
        results.push({
          from: funnelOrder[i],
          to: funnelOrder[i + 1],
          avgMs: times.reduce((a, b) => a + b, 0) / times.length,
          count: times.length,
        });
      } else {
        results.push({ from: funnelOrder[i], to: funnelOrder[i + 1], avgMs: 0, count: 0 });
      }
    }
    return results;
  }, [auditLogs, leads]);

  const funnelData = funnelSteps.map((s) => ({
    ...s,
    label: statusLabels[s.key],
    count: todayLeads.filter((l) => l.status === s.key).length,
  }));
  const maxFunnel = Math.max(...funnelData.map((d) => d.count), 1);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Today's overview — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link to="/dashboard-detail">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Eye className="h-4 w-4" /> Detail & Charts
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Leads" value={todayLeads.length} icon={Users} />
        <StatCard title="Total KG (Today)" value={`${stats.totalKg.toLocaleString()} kg`} subtitle={`B2C: ${stats.b2cKg.toLocaleString()} · B2B: ${stats.b2bKg.toLocaleString()}`} icon={Recycle} />
        <StatCard title="Est. Revenue (Today)" value={`Rp ${(stats.revenue / 1e6).toFixed(1)}M`} icon={DollarSign} />
        <StatCard title="Conversion Rate" value={`${stats.conversion}%`} subtitle={`${stats.deals} deals closed`} icon={TrendingUp} />
      </div>

      {/* Chat Response Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Answered Chats" value={stats.answered} icon={CheckCircle2} />
        <StatCard title="Unanswered Chats" value={stats.unanswered} icon={MessageCircle} />
        <StatCard title="Avg Response Time" value={formatDuration(stats.avgResponseMs)} subtitle="All chats · first reply" icon={Clock} />
      </div>

      {/* Funnel Transition Durations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><Timer className="h-4 w-4 text-primary" /> Avg Funnel Duration per Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {transitionDurations.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i === 0 && (
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{statusLabels[t.from as LeadStatus]}</span>
                )}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-primary">{t.avgMs > 0 ? formatDuration(t.avgMs) : '-'}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {t.count > 0 && <span className="text-[10px] text-muted-foreground">{t.count}x</span>}
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{statusLabels[t.to as LeadStatus]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4 text-primary" /> Lead Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelData.map((step) => (
              <div key={step.key} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm text-muted-foreground">{step.label}</span>
                <div className="flex-1">
                  <div className="h-7 rounded-md bg-muted overflow-hidden">
                    <div className={`h-full rounded-md ${step.color} flex items-center px-2 text-xs font-semibold text-primary-foreground transition-all`} style={{ width: `${Math.max((step.count / maxFunnel) * 100, 12)}%` }}>
                      {step.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Source Attribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Source Attribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topSource && (
              <div className="rounded-lg bg-muted p-3 mb-3">
                <p className="text-sm text-muted-foreground">Top Source</p>
                <p className="text-xl font-bold capitalize">{stats.topSource[0]}</p>
                <p className="text-xs text-muted-foreground">{stats.topSource[1].count} leads · {stats.topSource[1].kg.toLocaleString()} kg</p>
              </div>
            )}
            <div className="space-y-2">
              {Object.entries(stats.sourceMap).sort((a, b) => b[1].count - a[1].count).slice(0, 6).map(([src, data]) => (
                <div key={src} className="flex items-center justify-between rounded-lg border border-border p-2">
                  <div>
                    <p className="text-sm font-medium capitalize">{src}</p>
                    <p className="text-xs text-muted-foreground">{data.kg.toLocaleString()} kg · Rp {(data.value / 1e6).toFixed(1)}M</p>
                  </div>
                  <Badge variant="secondary">{data.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
