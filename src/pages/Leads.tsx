import { useState, useMemo } from 'react';
import {
  dummyLeads, statusLabels, statusColors, sourceLabels,
  type Lead, type LeadStatus, type LeadSource, type LeadType,
} from '@/data/dummy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, LayoutGrid, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const kanbanColumns: LeadStatus[] = [
  'new', 'not_followed_up', 'followed_up', 'in_progress',
  'picked_up', 'sign_contract', 'completed', 'lost',
];

export default function Leads() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return dummyLeads.filter((l) => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, sourceFilter, typeFilter]);

  const formatRp = (v?: number) => v ? `Rp ${v.toLocaleString('id-ID')}` : '-';

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} leads found</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(sourceLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="b2c">B2C</SelectItem>
              <SelectItem value="b2b">B2B</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Views */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table" className="gap-1.5"><List className="h-4 w-4" /> Table</TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1.5"><LayoutGrid className="h-4 w-4" /> Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Est. KG</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>PIC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs uppercase">{lead.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusColors[lead.status])}>
                          {statusLabels[lead.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{sourceLabels[lead.source]}</TableCell>
                      <TableCell className="text-sm">{lead.area}</TableCell>
                      <TableCell className="text-right text-sm">{lead.estimatedKg}</TableCell>
                      <TableCell className="text-right text-sm">{formatRp(lead.potentialValue)}</TableCell>
                      <TableCell className="text-sm">{lead.assignedPic}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                        No leads found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((status) => {
              const leads = filtered.filter((l) => l.status === status);
              return (
                <div key={status} className="w-64 shrink-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', statusColors[status])}>
                      {statusLabels[status]}
                    </span>
                    <span className="text-xs text-muted-foreground">{leads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {leads.map((lead) => (
                      <Card
                        key={lead.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.area}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{lead.estimatedKg} kg</span>
                            <Badge variant="outline" className="text-[10px] uppercase">{lead.type}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {leads.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">No leads</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Phone:</span> {selectedLead.phone}</div>
                  <div><span className="text-muted-foreground">Type:</span> {selectedLead.type.toUpperCase()}</div>
                  {selectedLead.company && <div className="col-span-2"><span className="text-muted-foreground">Company:</span> {selectedLead.company}</div>}
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedLead.address}, {selectedLead.area}</div>
                  <div><span className="text-muted-foreground">Source:</span> {sourceLabels[selectedLead.source]}</div>
                  <div><span className="text-muted-foreground">PIC:</span> {selectedLead.assignedPic}</div>
                  <div><span className="text-muted-foreground">Status:</span>{' '}
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusColors[selectedLead.status])}>
                      {statusLabels[selectedLead.status]}
                    </span>
                  </div>
                  <div><span className="text-muted-foreground">Created:</span> {selectedLead.createdAt}</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Operational</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Est. KG: <strong>{selectedLead.estimatedKg}</strong></div>
                    <div>Actual KG: <strong>{selectedLead.actualKg ?? '-'}</strong></div>
                    <div>Pickup Date: <strong>{selectedLead.pickupDate ?? '-'}</strong></div>
                    <div>Pickup Status: <strong>{selectedLead.pickupStatus ?? '-'}</strong></div>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Value</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Potential: <strong>{formatRp(selectedLead.potentialValue)}</strong></div>
                    <div>Deal: <strong>{formatRp(selectedLead.dealValue)}</strong></div>
                    <div>Final: <strong>{formatRp(selectedLead.finalValue)}</strong></div>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notes:</span> {selectedLead.notes}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
