import { useRef, useState, type PointerEvent, type RefObject } from "react";
import type { Direction, Location, Train } from "./api";

interface Props {
  train: Train;
  boardRef: RefObject<HTMLDivElement | null>;
  locations: Location[];
  menuOpen: boolean;
  onToggleMenu: () => void;
  onMove: (x: number, y: number) => void;
  onDirection: (direction: Direction) => void;
  onMoveTo: (locationId: number) => void;
  onDelete: () => void;
}

interface DragState {
  startX: number;
  startY: number;
  fromX: number;
  fromY: number;
  x: number;
  y: number;
  moved: boolean;
}

const DRAG_THRESHOLD_PX = 4;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const round4 = (v: number) => Math.round(v * 10000) / 10000;

function formatTime(sqliteUtc: string): string {
  const d = new Date(sqliteUtc.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime())
    ? sqliteUtc
    : d.toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
}

/* Ampang Line LRT car, drawn facing right. For "left" it is mirrored; the text is not. */
const SHELL = "M4 5 H110 Q117 6 118 13 V38 Q118 41 115 41 H4 Q2 41 2 39 V7 Q2 5 4 5 Z";
const CAB = "M103 5 H110 Q117 6 118 13 V38 Q118 41 115 41 H103 Z";
const WINDSCREEN = "M106 9 H111 Q115 10 115.5 14 V24 H106 Z";
const WINDOW_X = [6, 22, 38, 54, 70, 86];
const WHEEL_X = [16, 28, 80, 92];

function TrainGraphic({ code, direction }: { code: string; direction: Direction }) {
  const flip = direction === "left";
  return (
        <svg className="train-svg" viewBox="0 0 120 48" width="96" height="38.4" aria-hidden="true">
      <g transform={flip ? "matrix(-1 0 0 1 120 0)" : undefined}>
        <rect className="train-bogie" x="10" y="41" width="88" height="2.5" />
        <path className="train-body-fill" d={SHELL} />
        {WINDOW_X.map((wx) => (
          <rect key={wx} className="train-glass" x={wx} y="9" width="14" height="11" rx="1" />
        ))}
        <rect className="train-stripe" x="2" y="31" width="101" height="1.6" />
        <path className="train-red" d={CAB} />
        <path className="train-glass" d={WINDSCREEN} />
        <path className="train-outline" d={SHELL} />
        <ellipse className="train-light" cx="112" cy="30" rx="1.5" ry="1.1" />
        {WHEEL_X.map((cx) => (
          <circle key={cx} className="train-wheel" cx={cx} cy="44.5" r="3.4" />
        ))}
      </g>
            <text className="train-code" x={flip ? 67 : 53} y="29" textAnchor="middle">
        {code}
      </text>
    </svg>
  );
}

export default function TrainCard({
  train, boardRef, locations, menuOpen,
  onToggleMenu, onMove, onDirection, onMoveTo, onDelete,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const [livePos, setLivePos] = useState<{ x: number; y: number } | null>(null);

  const x = livePos?.x ?? train.x;
  const y = livePos?.y ?? train.y;
  const otherLocations = locations.filter((l) => l.id !== train.locationId);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX, startY: e.clientY,
      fromX: train.x, fromY: train.y,
      x: train.x, y: train.y,
      moved: false,
    };
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const board = boardRef.current;
    const body = bodyRef.current;
    if (!d || !board || !body) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    d.moved = true;

    const rect = board.getBoundingClientRect();
    d.x = clamp(d.fromX + dx / rect.width, 0, Math.max(0, 1 - body.offsetWidth / rect.width));
    d.y = clamp(d.fromY + dy / rect.height, 0, Math.max(0, 1 - body.offsetHeight / rect.height));
    setLivePos({ x: d.x, y: d.y });
  }

  function handlePointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) onMove(round4(d.x), round4(d.y));
    else onToggleMenu();
    setLivePos(null);
  }

  function handlePointerCancel() {
    drag.current = null;
    setLivePos(null);
  }

  return (
    <div
      className={menuOpen ? "train menu-open" : "train"}
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <div
        ref={bodyRef}
        className={livePos ? "train-body dragging" : "train-body"}
        role="button"
        tabIndex={0}
        aria-label={`${train.trainCode}, facing ${train.direction}. Drag to move, Enter for options.`}
        aria-expanded={menuOpen}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleMenu();
          }
        }}
      >
        <TrainGraphic code={train.trainCode} direction={train.direction} />
      </div>

      {menuOpen && (
        <div className="train-menu" onPointerDown={(e) => e.stopPropagation()}>
          <div className="menu-row">
            <button
              type="button"
              className="btn"
              disabled={train.direction === "left"}
              onClick={() => onDirection("left")}
            >
              ◀ Left
            </button>
            <button
              type="button"
              className="btn"
              disabled={train.direction === "right"}
              onClick={() => onDirection("right")}
            >
              Right ▶
            </button>
          </div>
          {otherLocations.length > 0 && (
            <select
              aria-label="Move to another location"
              value=""
              onChange={(e) => {
                if (e.target.value) onMoveTo(Number(e.target.value));
              }}
            >
              <option value="">Move to…</option>
              {otherLocations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          )}
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
          <p className="meta">
            Updated {formatTime(train.updatedAt)}
            {train.updatedBy ? ` by ${train.updatedBy}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}