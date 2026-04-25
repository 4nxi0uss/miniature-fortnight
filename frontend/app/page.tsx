"use client";

import { FormEvent, useEffect, useState } from "react";

type TrainingPlan = {
  id: number;
  name: string;
  goal?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
};

type CreateTrainingPlanPayload = {
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  sessions: [];
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const emptyFormState = {
  name: "",
  goal: "",
  startDate: "",
  endDate: "",
  notes: ""
};

export default function HomePage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyFormState);

  async function loadPlans() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/plans`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as TrainingPlan[];
      setPlans(data);
    } catch (err) {
      setError(`Could not load plans: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateTrainingPlanPayload = {
      name: formState.name,
      goal: formState.goal || undefined,
      start_date: formState.startDate || undefined,
      end_date: formState.endDate || undefined,
      notes: formState.notes || undefined,
      sessions: []
    };

    try {
      const response = await fetch(`${apiBaseUrl}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setFormState(emptyFormState);
      await loadPlans();
    } catch (err) {
      setError(`Could not create plan: ${String(err)}`);
    }
  }

  async function removePlan(id: number) {
    try {
      const response = await fetch(`${apiBaseUrl}/plans/${id}`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP ${response.status}`);
      }

      setPlans((current) => current.filter((plan) => plan.id !== id));
    } catch (err) {
      setError(`Could not delete plan: ${String(err)}`);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Training App</p>
        <h1>Manage your workout plans in one place</h1>
        <p className="subtitle">
          Add goals, define training dates and keep your progress visible for the whole team.
        </p>
      </section>

      <section className="panel">
        <h2>Create plan</h2>
        <form className="plan-form" onSubmit={handleSubmit}>
          <label>
            Plan name
            <input
              required
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. Strength cycle"
            />
          </label>

          <label>
            Goal
            <input
              value={formState.goal}
              onChange={(event) => setFormState((current) => ({ ...current, goal: event.target.value }))}
              placeholder="e.g. Build lower-body power"
            />
          </label>

          <div className="date-grid">
            <label>
              Start date
              <input
                type="date"
                value={formState.startDate}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, startDate: event.target.value }))
                }
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={formState.endDate}
                onChange={(event) => setFormState((current) => ({ ...current, endDate: event.target.value }))}
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              rows={3}
              value={formState.notes}
              onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Optional context for this plan"
            />
          </label>

          <button type="submit">Save training plan</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Current plans</h2>
          <button type="button" onClick={loadPlans} className="secondary">
            Refresh
          </button>
        </div>

        {isLoading ? <p>Loading plans...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!isLoading && plans.length === 0 ? <p>No plans yet. Create your first one.</p> : null}

        <ul className="plan-list">
          {plans.map((plan) => (
            <li key={plan.id}>
              <article>
                <h3>{plan.name}</h3>
                {plan.goal ? <p>{plan.goal}</p> : null}
                <div className="meta">
                  <span>Start: {plan.start_date || "-"}</span>
                  <span>End: {plan.end_date || "-"}</span>
                </div>
                {plan.notes ? <p className="notes">{plan.notes}</p> : null}
                <button type="button" onClick={() => removePlan(plan.id)} className="danger">
                  Delete
                </button>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
