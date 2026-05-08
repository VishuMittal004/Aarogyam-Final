'use client';

import { photoDetection, type PhotoDetectionOutput } from '@/ai/flows/photo-detection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Camera, Loader2, ShieldAlert, Activity, Lightbulb } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function PhotoDetectionPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PhotoDetectionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) return;
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await photoDetection({
          imageDescription: description,
          additionalInfo: additionalInfo || undefined,
        });
        setResult(res);
      } catch (err) {
        setError('Analysis failed. Please try again.');
        console.error(err);
      }
    });
  };

  const urgencyColor: Record<string, string> = {
    low: 'text-green-500 bg-green-500/10',
    medium: 'text-amber-500 bg-amber-500/10',
    high: 'text-red-500 bg-red-500/10',
  };

  const severityColor: Record<string, string> = {
    mild: 'text-green-500 bg-green-500/10',
    moderate: 'text-amber-500 bg-amber-500/10',
    severe: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Skin Condition Analyzer</h1>
        <p className="text-muted-foreground text-lg">
          Describe a skin condition and get AI-powered analysis and recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Describe the Condition
            </CardTitle>
            <CardDescription>
              Provide a detailed description of the skin condition you want to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Condition Description *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Red, itchy patches on my forearms that appeared 3 days ago. The patches are about 2cm in diameter, slightly raised, and have dry, flaky skin on top..."
                  className="min-h-[150px] bg-input/50 border-border/50"
                  required
                  minLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Additional Information (optional)</Label>
                <Input
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Duration, triggers, medications tried, family history..."
                  className="bg-input/50 border-border/50"
                />
              </div>
              <Button type="submit" disabled={isPending || description.trim().length < 10} className="w-full bg-primary hover:bg-primary/90">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {isPending ? 'Analyzing...' : 'Analyze Condition'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {isPending && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-foreground font-medium">AI is analyzing the condition...</p>
                <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-foreground">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Severity & Urgency */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Severity</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${severityColor[result.severity?.toLowerCase()] || 'text-muted-foreground bg-muted'}`}>
                      {result.severity}
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Urgency</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${urgencyColor[result.urgency?.toLowerCase()] || 'text-muted-foreground bg-muted'}`}>
                      {result.urgency}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* Possible Conditions */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Possible Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">{result.possibleConditions}</p>
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">{result.recommendedActions}</p>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-600">
                    This is an AI-generated analysis for educational purposes only. It is NOT a medical diagnosis. Please consult a dermatologist or healthcare professional for accurate diagnosis and treatment.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {!isPending && !result && !error && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-12 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Describe a skin condition to get started</p>
                <p className="text-sm text-muted-foreground mt-1">Include details like color, texture, size, location, and duration</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
