'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Syringe, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Vaccine {
  id: string;
  name: string;
  disease: string;
  schedule: string;
  purpose: string;
  ageGroup: string;
  sideEffects: string;
  importance: string;
}

const importanceBadge: Record<string, { label: string; color: string }> = {
  essential: { label: 'Essential', color: 'bg-green-500/10 text-green-500' },
  recommended: { label: 'Recommended', color: 'bg-blue-500/10 text-blue-500' },
  optional: { label: 'Optional', color: 'bg-gray-500/10 text-gray-400' },
};

export default function VaccinesPage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/vaccines')
      .then((r) => r.json())
      .then((d) => setVaccines(d.vaccines || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? vaccines : vaccines.filter((v) => v.importance === filter);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Vaccine Information</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive guide to vaccines, schedules, and health protection
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-green-500/5 cursor-pointer hover:bg-green-500/10 transition-colors" onClick={() => setFilter(filter === 'essential' ? 'all' : 'essential')}>
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{vaccines.filter((v) => v.importance === 'essential').length}</p>
              <p className="text-sm text-muted-foreground">Essential Vaccines</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 transition-colors" onClick={() => setFilter(filter === 'recommended' ? 'all' : 'recommended')}>
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{vaccines.filter((v) => v.importance === 'recommended').length}</p>
              <p className="text-sm text-muted-foreground">Recommended</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gray-500/5 cursor-pointer hover:bg-gray-500/10 transition-colors" onClick={() => setFilter(filter === 'optional' ? 'all' : 'optional')}>
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-2xl font-bold text-foreground">{vaccines.filter((v) => v.importance === 'optional').length}</p>
              <p className="text-sm text-muted-foreground">Optional</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading vaccines...</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {filtered.map((vaccine) => {
            const badge = importanceBadge[vaccine.importance] || importanceBadge.optional;
            return (
              <AccordionItem
                value={vaccine.id}
                key={vaccine.id}
                className="border border-border/50 bg-card/50 backdrop-blur-sm rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-3 text-left">
                    <Syringe className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-lg font-semibold text-foreground">{vaccine.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                        {vaccine.ageGroup && <span className="text-xs text-muted-foreground">• {vaccine.ageGroup}</span>}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 px-2 pb-6 text-base">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-sm">Prevents</h3>
                      <p className="text-muted-foreground text-sm">{vaccine.disease}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-sm">Schedule</h3>
                      <p className="text-muted-foreground text-sm">{vaccine.schedule}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-sm">Purpose</h3>
                    <p className="text-muted-foreground text-sm">{vaccine.purpose}</p>
                  </div>
                  {vaccine.sideEffects && (
                    <div className="space-y-1 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <h3 className="font-semibold text-amber-500 text-sm">Possible Side Effects</h3>
                      <p className="text-muted-foreground text-sm">{vaccine.sideEffects}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
