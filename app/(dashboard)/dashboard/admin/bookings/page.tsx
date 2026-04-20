"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  name: string;
  email: string;
  company: string | null;
  teamSize: string | null;
  date: string;
  time: string;
  message: string | null;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/demo-booking")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-hero-heading">Demo Bookings</h1>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-hero-heading">Demo Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="liquid-glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No demo bookings yet.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Bookings from the /contact page will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="liquid-glass rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-hero-heading">{booking.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[booking.status] || statusColors.pending}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{booking.email}</p>
                  {booking.company && (
                    <p className="text-sm text-muted-foreground">{booking.company} {booking.teamSize ? `(${booking.teamSize} employees)` : ""}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-sm text-primary font-medium">{booking.time} AEST</p>
                </div>
              </div>
              {booking.message && (
                <p className="mt-3 text-sm text-muted-foreground border-t border-border/30 pt-3">
                  {booking.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground/50 mt-3">
                Booked {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
