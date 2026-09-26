import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, createClient } from "../store/clientsSlice";

const emptyForm = {
  name: "",
  contact: "",
  budget_min: "",
  budget_max: "",
  preferred_location: "",
  preferred_type: "residential",
};

export default function ClientsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.clients);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
    };
    const result = await dispatch(createClient(payload));
    if (createClient.fulfilled.match(result)) {
      setForm(emptyForm);
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="page-header">
        <h1>Clients</h1>
        <p>Everyone you're working with, and what they're looking for.</p>
      </div>

      <div className="panel">
        <h2>Add a client</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="contact">Contact</label>
              <input
                id="contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone or email"
              />
            </div>
            <div className="field">
              <label htmlFor="budget_min">Budget — min</label>
              <input
                id="budget_min"
                name="budget_min"
                type="number"
                value={form.budget_min}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="budget_max">Budget — max</label>
              <input
                id="budget_max"
                name="budget_max"
                type="number"
                value={form.budget_max}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="preferred_location">Preferred location</label>
              <input
                id="preferred_location"
                name="preferred_location"
                value={form.preferred_location}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="preferred_type">Preferred type</label>
              <select
                id="preferred_type"
                name="preferred_type"
                value={form.preferred_type}
                onChange={handleChange}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding…" : "Add client"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>All clients</h2>
        {status === "loading" && <div className="empty-state">Loading…</div>}
        {status === "succeeded" && items.length === 0 && (
          <div className="empty-state">No clients yet. Add your first one above.</div>
        )}
        {items.map((client) => (
          <div className="list-row" key={client.id}>
            <div className="list-accent" />
            <div className="list-main">
              <div className="list-title">{client.name}</div>
              <div className="list-meta">{client.contact || "No contact on file"}</div>
              <div className="list-meta">
                {client.preferred_location && `Looking in ${client.preferred_location}`}
                {client.preferred_location && (client.budget_min || client.budget_max) && ", "}
                {(client.budget_min || client.budget_max) &&
                  `budget ₹${client.budget_min ?? "?"} to ₹${client.budget_max ?? "?"}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
