import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties, createProperty } from "../store/propertiesSlice";

const emptyForm = {
  address: "",
  property_type: "residential",
  price: "",
  status: "available",
  description: "",
};

export default function PropertiesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.properties);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, price: Number(form.price) };
    const result = await dispatch(createProperty(payload));
    if (createProperty.fulfilled.match(result)) {
      setForm(emptyForm);
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="page-header">
        <h1>Properties</h1>
        <p>Listings your clients are viewing and negotiating on.</p>
      </div>

      <div className="panel">
        <h2>Add a property</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field field-wide">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="property_type">Type</label>
              <select
                id="property_type"
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                required
                value={form.price}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="under_negotiation">Under negotiation</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="field field-wide">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding…" : "Add property"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>All properties</h2>
        {status === "loading" && <div className="empty-state">Loading…</div>}
        {status === "succeeded" && items.length === 0 && (
          <div className="empty-state">No properties listed yet.</div>
        )}
        {items.map((property) => (
          <div className="list-row" key={property.id}>
            <div className="list-accent" />
            <div className="list-main">
              <div className="list-title">{property.address}</div>
              <div className="list-meta">
                {property.property_type === "residential" ? "Residential" : "Commercial"}
                {" · "}₹{property.price.toLocaleString("en-IN")}
              </div>
              {property.description && (
                <div className="list-notes">{property.description}</div>
              )}
            </div>
            <span className={`badge badge-${property.status}`}>
              {property.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
