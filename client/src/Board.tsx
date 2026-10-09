import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, errorText, type Location, type Train, type TrainChange } from "./api";
import TrainCard from "./TrainCard";

interface Props {
  location: Location;
  locations: Location[];
}

export default function Board({ location, locations }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [newCode, setNewCode] = useState("");
  const [imageOk, setImageOk] = useState(Boolean(location.backgroundImage));
  const [pendingDelete, setPendingDelete] = useState<Train | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .trains(location.code)
      .then((t) => { if (!cancelled) setTrains(t); })
      .catch((err) => { if (!cancelled) setError(errorText(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [location.code]);

  function replaceTrain(updated: Train) {
    setTrains((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function saveChange(train: Train, change: TrainChange) {
    setError(null);
    setTrains((prev) => prev.map((t) => (t.id === train.id ? { ...t, ...change } : t)));
    try {
      const updated = await api.updateTrain(train.id, change);
      if (updated.locationId !== location.id) {
        setTrains((prev) => prev.filter((t) => t.id !== train.id));
        setOpenMenuId(null);
      } else {
        replaceTrain(updated);
      }
    } catch (err) {
      replaceTrain(train);
      setError(`Could not save ${train.trainCode}: ${errorText(err)}`);
    }
  }

  function cancelDelete() {
    if (!deleting) setPendingDelete(null);
  }

  async function confirmDelete() {
    const train = pendingDelete;
    if (!train) return;
    setDeleting(true);
    setError(null);
    try {
      await api.deleteTrain(train.id);
      setTrains((prev) => prev.filter((t) => t.id !== train.id));
      setOpenMenuId(null);
    } catch (err) {
      setError(`Could not delete ${train.trainCode}: ${errorText(err)}`);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  async function addTrain(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trainCode = newCode.trim();
    if (!trainCode) return;
    setError(null);
    try {
      const created = await api.addTrain({ trainCode, locationId: location.id });
      setTrains((prev) => [...prev, created].sort((a, b) => a.trainCode.localeCompare(b.trainCode)));
      setNewCode("");
    } catch (err) {
      setError(errorText(err));
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  }

  return (
    <section className="board-page">
      <div className="toolbar">
        <h1>{location.name}</h1>
        <form className="add-train" onSubmit={addTrain}>
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Train ID, e.g. TR06"
            aria-label="New train ID"
            maxLength={20}
          />
          <button type="submit" className="btn btn-primary">Add train</button>
        </form>
        <button type="button" className="btn" onClick={toggleFullscreen}>Fullscreen</button>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div
        ref={boardRef}
        className={imageOk ? "board" : "board board--placeholder"}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setOpenMenuId(null);
        }}
      >
        {imageOk && location.backgroundImage && (
          <img
            className="board-image"
            src={`/boards/${location.backgroundImage}`}
            alt={`${location.name} track layout`}
            draggable={false}
            onError={() => setImageOk(false)}
          />
        )}
        {loading && <p className="board-message">Loading trains…</p>}
        {!loading && trains.length === 0 && <p className="board-message">No trains here yet.</p>}

        {trains.map((train) => (
          <TrainCard
            key={train.id}
            train={train}
            boardRef={boardRef}
            locations={locations}
            menuOpen={openMenuId === train.id}
            onToggleMenu={() => setOpenMenuId((id) => (id === train.id ? null : train.id))}
            onMove={(x, y) => void saveChange(train, { x, y })}
            onDirection={(direction) => void saveChange(train, { direction })}
            onMoveTo={(locationId) => void saveChange(train, { locationId })}
            onDelete={() => setPendingDelete(train)}
          />
        ))}
      </div>

      {pendingDelete && (
        <div className="modal-backdrop" onPointerDown={cancelDelete}>
          <div
            className="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelDelete();
            }}
          >
            <h2 id="delete-title">Delete {pendingDelete.trainCode}?</h2>
            <p id="delete-desc">
              This removes the train and its movement history. It cannot be undone.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn" autoFocus disabled={deleting} onClick={cancelDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={deleting}
                onClick={() => void confirmDelete()}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}