"use client";

import { useState } from "react";
import Image from "next/image";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

const teamSizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ContactPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"calendar" | "details" | "confirmed">("calendar");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", teamSize: "", message: "" });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const isWeekend = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const handleDateClick = (day: number) => {
    if (isWeekend(day) || isPast(day)) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !form.name || !form.email) return;
    setSubmitting(true);
    try {
      await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDate.toISOString(),
          time: selectedTime,
        }),
      });
      setStep("confirmed");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="InpromptiFy" width={48} height={48} className="h-12 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-hero-heading">Demo Booked</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We will be in touch at <span className="text-foreground font-medium">{form.email}</span> to
          confirm your demo on{" "}
          <span className="text-foreground font-medium">
            {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>{" "}
          at <span className="text-foreground font-medium">{selectedTime} AEST</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-hero-heading sm:text-5xl">
          Book a Demo
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          See InpromptiFy in action. Pick a time that works for you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Calendar */}
        <div className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-hero-heading">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isWeekend(day) || isPast(day);
              const selected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={`
                    h-10 w-full rounded-lg text-sm font-medium transition-all
                    ${disabled ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:bg-primary/20 cursor-pointer"}
                    ${selected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="mt-6 border-t border-border/30 pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} — Select a time (AEST)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => { setSelectedTime(time); setStep("details"); }}
                    className={`
                      rounded-lg py-2 text-sm font-medium transition-all
                      ${selectedTime === time ? "bg-primary text-primary-foreground" : "bg-white/5 text-foreground hover:bg-primary/20"}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details form */}
        <div className="liquid-glass rounded-2xl p-6">
          {step === "details" ? (
            <>
              <h2 className="text-lg font-semibold text-hero-heading mb-1">Your Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {selectedTime} AEST
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Work Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Team Size</label>
                  <div className="flex flex-wrap gap-2">
                    {teamSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setForm({ ...form, teamSize: size })}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
                          form.teamSize === size ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Anything specific you want to see?</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    placeholder="e.g. ATS integration, team analytics..."
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || submitting}
                  className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
                <button
                  onClick={() => setStep("calendar")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to calendar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4 text-primary">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-hero-heading">Select a date and time</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Pick a day on the calendar, then choose a time slot. We will walk you through
                the full platform in 30 minutes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* General contact below */}
      <div className="mt-16 liquid-glass rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold text-hero-heading">Prefer email?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach us at{" "}
          <a href="mailto:hello@inpromptify.com" className="text-primary hover:underline">
            hello@inpromptify.com
          </a>
          {" "}and we will respond within 24 hours.
        </p>
      </div>
    </div>
  );
}
