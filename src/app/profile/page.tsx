'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar, Heart, Loader2, Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [allergiesStr, setAllergiesStr] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile(d.user);
          setAllergiesStr((d.user.allergies || []).join(', '));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          allergies: allergiesStr.split(',').map((a) => a.trim()).filter(Boolean),
        }),
      });
      if (res.ok) setMessage('Profile updated successfully!');
      else setMessage('Failed to update profile');
    } catch {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Please log in to view your profile</p>
        <Button onClick={() => router.push('/login')} className="mt-4">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your health profile and personal information</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-input/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={profile.email} disabled className="bg-input/30 border-border/50 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX" className="bg-input/50 border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, State" className="bg-input/50 border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  className="bg-input/50 border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                <SelectTrigger className="bg-input/50 border-border/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select value={profile.language} onValueChange={(v) => setProfile({ ...profile, language: v })}>
                <SelectTrigger className="bg-input/50 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Health Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" /> Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select value={profile.bloodGroup} onValueChange={(v) => setProfile({ ...profile, bloodGroup: v })}>
                <SelectTrigger className="bg-input/50 border-border/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Input value={profile.emergencyContact} onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  placeholder="Emergency contact number" className="bg-input/50 border-border/50" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Known Allergies</Label>
              <Input value={allergiesStr} onChange={(e) => setAllergiesStr(e.target.value)}
                placeholder="e.g., Penicillin, Dust, Peanuts (comma separated)" className="bg-input/50 border-border/50" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
