import SymptomCheckerForm from './symptom-checker-form';

export default function SymptomCheckerPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          AI Symptom Checker
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe your symptoms and get AI-powered health insights and recommendations
        </p>
      </div>
      <SymptomCheckerForm />
    </div>
  );
}
