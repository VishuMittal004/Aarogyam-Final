'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Stethoscope, Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HealthRecord {
  id: string;
  symptoms: string;
  possibleConditions: string;
  recommendedActions: string;
  severity: string;
  createdAt: string;
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health-records')
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const severityColor: Record<string, string> = {
    low: 'text-green-500 bg-green-500/10',
    moderate: 'text-amber-500 bg-amber-500/10',
    high: 'text-red-500 bg-red-500/10',
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return dateStr; }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground text-lg">Your symptom check history and AI analysis results</p>
        </div>
        <Link href="/symptom-checker">
          <Button className="bg-primary hover:bg-primary/90">
            <Stethoscope className="mr-2 h-4 w-4" />
            New Check
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{records.length}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {records.length > 0 ? formatDate(records[0].createdAt).split(',')[0] : '—'}
              </p>
              <p className="text-sm text-muted-foreground">Last Check</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {records.filter((r) => r.severity === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground">High Severity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No health records yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Use the Symptom Checker to create your first record</p>
            <Link href="/symptom-checker">
              <Button className="bg-primary hover:bg-primary/90">
                <Stethoscope className="mr-2 h-4 w-4" />
                Check Symptoms
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Symptom Analysis</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor[record.severity] || 'bg-muted text-muted-foreground'}`}>
                      {record.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(record.createdAt)}</span>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  <strong>Symptoms:</strong> {record.symptoms}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Possible Conditions</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.possibleConditions}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-semibold text-foreground mb-1">Recommended Actions</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.recommendedActions}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
