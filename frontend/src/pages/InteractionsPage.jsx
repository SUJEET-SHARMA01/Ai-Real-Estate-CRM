import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInteractions, createInteraction } from "../store/interactionsSlice";
import { fetchClients } from "../store/clientsSlice";
import { fetchProperties } from "../store/propertiesSlice";

const emptyForm = {
  client_id: "",
  property_id: "",
  interaction_type: "call",
  notes: "",
  sentiment: "unknown",
};

export default function InteractionsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.interactions);
  const clients = useSelector((state) => state.clients.items);
  const properties = useSelector((state) => state.properties.items);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchInteractions());
    dispatch(fetchClients());
    dispatch(fetchProperties());
  }, [dispatch]);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || `Client #${id}`;
  const propertyAddress = (id) =>
    properties.find((p) => p.id === id)?.address || `Property #${id}`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client_id) return;
    setSubmitting(true);
    const payload = {
      ...form,
      client_id: Number(form.client_id),
      property_id: form.property_id ? Number(form.property_id) : null,
    };
    const result = await dispatch(createInteraction(payload));
    if (createInteraction.fulfilled.match(result)) {
      setForm(emptyForm);
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="page-header">
        <h1>Interactions</h1>
        <p>Every call, visit, and message logged with your clients.</p>
      </div>

      <div className="panel">
        <h2>Log an interaction</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="client_id">Client</label>
              <select
                id="client_id"
                name="client_id"
                required
                value={form.client_id}
                onChange={handleChange}
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="property_id">Property (optional)</label>
              <select
                id="property_id"
                name="property_id"
                value={form.property_id}
                onChange={handleChange}
              >
                <option value="">None</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.address}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="interaction_type">Type</label>
              <select
                id="interaction_type"
                name="interaction_type"
                value={form.interaction_type}
                onChange={handleChange}
              >
                <option value="call">Call</option>
                <option value="visit">Visit</option>
                <option value="email">Email</option>
                <option value="message">Message</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="sentiment">Sentiment</label>
              <select
                id="sentiment"
                name="sentiment"
                value={form.sentiment}
                onChange={handleChange}
              >
                <option value="unknown">Not sure yet</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div className="field field-wide">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                required
                value={form.notes}
                onChange={handleChange}
                placeholder="What happened, what they said, what's next…"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Logging…" : "Log interaction"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Recent interactions</h2>
        {status === "loading" && <div className="empty-state">Loading…</div>}
        {status === "succeeded" && items.length === 0 && (
          <div className="empty-state">No interactions logged yet.</div>
        )}
        {items.map((interaction) => (
          <div className="list-row" key={interaction.id}>
            <div className={`list-accent sentiment-${interaction.sentiment}`} />
            <div className="list-main">
              <div className="list-title">
                {clients.length ? clientName(interaction.client_id) : `Client #${interaction.client_id}`}
              </div>
              <div className="list-meta">
                {interaction.interaction_type}
                {interaction.property_id &&
                  ` about ${properties.length ? propertyAddress(interaction.property_id) : `property #${interaction.property_id}`}`}
              </div>
              <div className="list-notes">{interaction.notes}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
