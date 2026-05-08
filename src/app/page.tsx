'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell, Languages, Stethoscope, Syringe, Activity, Users, Zap,
  TrendingUp, ArrowRight, HeartPulse, Info, Loader2, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface DashboardStats {
  consultations: { value: number; change: string };
  aiInteractions: { value: number; change: string };
  symptomChecks: { value: number; change: string };
  healthInsights: { value: number; change: string };
}

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
}

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tipsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/health-tips'),
        ]);
        if (statsRes.ok) {
          const d = await statsRes.json();
          setStats(d.stats);
        }
        if (tipsRes.ok) {
          const d = await tipsRes.json();
          setTips(d.tips || []);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setSeeded(true);
        window.location.reload();
      }
    } catch (e) {
      console.error('Seed failed', e);
    } finally {
      setSeeding(false);
    }
  };

  const metricsData = [
    { title: 'Consultations', value: stats?.consultations.value ?? '—', change: stats?.consultations.change ?? '', icon: <Activity className="h-5 w-5" /> },
    { title: 'AI Interactions', value: stats?.aiInteractions.value ?? '—', change: stats?.aiInteractions.change ?? '', icon: <Users className="h-5 w-5" /> },
    { title: 'Symptom Checks', value: stats?.symptomChecks.value ?? '—', change: stats?.symptomChecks.change ?? '', icon: <Zap className="h-5 w-5" /> },
    { title: 'Health Insights', value: stats?.healthInsights.value ?? '—', change: stats?.healthInsights.change ?? '', icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const features = [
    { title: 'Symptom Checker', description: 'AI-powered symptom analysis', href: '/symptom-checker', icon: <Stethoscope className="h-6 w-6" /> },
    { title: 'Vaccine Info', description: 'Schedules & details', href: '/vaccines', icon: <Syringe className="h-6 w-6" /> },
    { title: 'Health Alerts', description: 'Real-time warnings', href: '/alerts', icon: <Bell className="h-6 w-6" /> },
    { title: 'AI Chat', description: 'Multilingual assistant', href: '/chat', icon: <Languages className="h-6 w-6" /> },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">
          {user ? `Welcome, ${user.name.split(' ')[0]}!` : 'Hi there!'}
        </h1>
        <p className="text-muted-foreground text-lg">Your health dashboard at a glance</p>
      </div>

      {/* Seed Button - shown if no tips loaded */}
      {!loading && tips.length === 0 && !seeded && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Initialize Database</p>
                <p className="text-sm text-muted-foreground">Load vaccines, alerts, health tips & emergency data</p>
              </div>
            </div>
            <Button onClick={handleSeed} disabled={seeding} className="bg-primary hover:bg-primary/90">
              {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {seeding ? 'Seeding...' : 'Seed Database'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((m, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/10 hover:to-card/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{m.title}</p>
                  <p className="text-2xl font-bold text-foreground">{loading ? '—' : m.value}</p>
                  <p className="text-xs text-primary font-medium">{m.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 text-primary">{m.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Health Services</h2>
          <p className="text-muted-foreground">Access comprehensive health tools</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link href={f.href} key={f.title} className="group">
              <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:border-primary/30 group-hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">{f.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      {tips.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Daily Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.slice(0, 6).map((tip) => (
              <Card key={tip.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-sm">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{tip.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ backgroundSize: '200% 100%' }} />
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><HeartPulse className="h-6 w-6 text-primary" /></div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">AI-Powered</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Welcome to Aarogyam!</h2>
                <p className="text-muted-foreground">Your comprehensive health companion powered by AI. Get personalized health insights, symptom analysis, and multilingual support.</p>
              </div>
              <Link href="/chat">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <HeartPulse className="h-16 w-16 text-primary/60" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-secondary border border-border/50">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1"><Info className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-foreground">Important Note</h3>
            <p className="text-sm text-muted-foreground">This application provides AI-generated health information for educational purposes only. Always consult a qualified healthcare professional for medical advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
