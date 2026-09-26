import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../store/clientsSlice";
import { fetchProperties } from "../store/propertiesSlice";
import { fetchInteractions } from "../store/interactionsSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.items);
  const properties = useSelector((state) => state.properties.items);
  const interactions = useSelector((state) => state.interactions.items);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchProperties());
    dispatch(fetchInteractions());
  }, [dispatch]);

  const availableCount = properties.filter((p) => p.status === "available").length;
  const positiveLeads = interactions.filter((i) => i.sentiment === "positive").length;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>A quick read on where things stand today.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{clients.length}</div>
          <div className="stat-label">Clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{availableCount}</div>
          <div className="stat-label">Properties available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{positiveLeads}</div>
          <div className="stat-label">Positive-sentiment interactions</div>
        </div>
      </div>

      <div className="panel">
        <h2>Latest interactions</h2>
        {interactions.length === 0 && (
          <div className="empty-state">
            Nothing logged yet — head to Interactions to add your first one.
          </div>
        )}
        {interactions.slice(0, 6).map((interaction) => (
          <div className="list-row" key={interaction.id}>
            <div className={`list-accent sentiment-${interaction.sentiment}`} />
            <div className="list-main">
              <div className="list-title">
                {clients.find((c) => c.id === interaction.client_id)?.name ||
                  `Client #${interaction.client_id}`}
              </div>
              <div className="list-meta">{interaction.interaction_type}</div>
              <div className="list-notes">{interaction.notes}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
