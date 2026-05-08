'use client';

import { symptomChecker, type SymptomCheckerOutput } from '@/ai/flows/symptom-checker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Lightbulb, Loader2, CheckCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  symptoms: z
    .string()
    .min(10, { message: 'Please describe your symptoms in at least 10 characters.' })
    .max(1000, { message: 'Please keep your description under 1000 characters.' }),
});

export default function SymptomCheckerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { symptoms: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const res = await symptomChecker(values);
        setResult(res);

        // Save to health records in MongoDB
        try {
          const saveRes = await fetch('/api/health-records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              symptoms: values.symptoms,
              possibleConditions: res.possibleConditions,
              recommendedActions: res.recommendedActions,
              severity: 'moderate',
            }),
          });
          if (saveRes.ok) setSaved(true);
        } catch (saveErr) {
          console.error('Failed to save health record:', saveErr);
        }
      } catch (e) {
        setError('An error occurred. Please try again.');
        console.error(e);
      }
    });
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-foreground">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Headache and fever for 2 days', 'persistent cough and chest pain', 'skin rash and itching on my arms', 'stomach pain and nausea after eating'."
                        className="min-h-[150px] text-base bg-input/50 border-border/50 focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isPending && (
        <div className="mt-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">AI is analyzing your symptoms...</p>
        </div>
      )}

      {error && (
        <Card className="mt-8 border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Analysis Result</h2>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" /> Saved to records
              </span>
            )}
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Possible Conditions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Based on the symptoms you provided, here are some possibilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">{result.possibleConditions}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Recommended Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Here are some suggested next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">{result.recommendedActions}</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardHeader className="flex flex-row items-center gap-4">
              <Lightbulb className="h-6 w-6 text-amber-600" />
              <CardTitle className="text-lg text-amber-600">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-600">
              This is an AI-generated analysis and not a substitute for professional medical advice.
              Please consult a doctor for an accurate diagnosis.
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
