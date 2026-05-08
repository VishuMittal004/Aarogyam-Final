'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, Phone, Clock, MapPin, Star, Loader2, Ambulance, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EmergencyService {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  emergency: string;
  specialties: string[];
  rating: number;
  distance: string;
  openHours: string;
}

const emergencyNumbers = [
  { name: 'National Emergency', number: '112', icon: <AlertTriangle className="h-5 w-5" /> },
  { name: 'Ambulance', number: '108', icon: <Ambulance className="h-5 w-5" /> },
  { name: 'Health Helpline', number: '104', icon: <Phone className="h-5 w-5" /> },
  { name: 'Women Helpline', number: '1091', icon: <Phone className="h-5 w-5" /> },
  { name: 'Child Helpline', number: '1098', icon: <Phone className="h-5 w-5" /> },
  { name: 'Mental Health', number: '08046110007', icon: <Phone className="h-5 w-5" /> },
];

export default function EmergencyPage() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetch('/api/emergency')
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = ['all', ...new Set(services.map((s) => s.type))];
  const filtered = typeFilter === 'all' ? services : services.filter((s) => s.type === typeFilter);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Emergency Services</h1>
        <p className="text-muted-foreground text-lg">Quick access to emergency contacts and nearby hospitals</p>
      </div>

      {/* Emergency Numbers */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Emergency Helplines</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {emergencyNumbers.map((en) => (
            <Card key={en.number} className="border-border/50 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2 text-red-500">{en.icon}</div>
                <p className="text-lg font-bold text-foreground">{en.number}</p>
                <p className="text-xs text-muted-foreground">{en.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              typeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-card/50 text-muted-foreground hover:bg-card border border-border/50'
            }`}>
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      {/* Hospitals List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading services...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-12 text-center">
            <Hospital className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No services found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((service) => (
            <Card key={service.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{service.name}</CardTitle>
                    <CardDescription className="text-primary text-xs font-medium">{service.type}</CardDescription>
                  </div>
                  {service.rating > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-500">{service.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{service.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.openHours}</span>
                  </div>
                </div>
                {service.emergency && (
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-red-500/5 border border-red-500/20">
                    <Ambulance className="h-4 w-4 text-red-500" />
                    <span className="text-red-400 font-medium">Emergency: {service.emergency}</span>
                  </div>
                )}
                {service.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {service.specialties.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>
                    ))}
                  </div>
                )}
                {service.distance && (
                  <p className="text-xs text-muted-foreground">📍 Approx. {service.distance} away</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
