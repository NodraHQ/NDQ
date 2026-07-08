import "./InventoryFilters.css";

export type SlotFilter = "all" | "weapon" | "armor";
export type SortMode = "tier" | "recent";

type InventoryFiltersProps = {
  slotFilter: SlotFilter;
  onSlotFilterChange: (value: SlotFilter) => void;
  sortMode: SortMode;
  onSortModeChange: (value: SortMode) => void;
  itemCount: number;
};

const SLOT_OPTIONS: { value: SlotFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "weapon", label: "Armas" },
  { value: "armor", label: "Armaduras" },
];

export default function InventoryFilters({
  slotFilter,
  onSlotFilterChange,
  sortMode,
  onSortModeChange,
  itemCount,
}: InventoryFiltersProps) {
  return (
    <div className="inventory-filters">
      <div className="inventory-filters__slots">
        {SLOT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`inventory-filters__pill ${slotFilter === opt.value ? "inventory-filters__pill--active" : ""}`}
            onClick={() => onSlotFilterChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="inventory-filters__right">
        <span className="inventory-filters__count">{itemCount} {itemCount === 1 ? "item" : "itens"}</span>
        <select
          className="inventory-filters__sort"
          value={sortMode}
          onChange={(e) => onSortModeChange(e.target.value as SortMode)}
        >
          <option value="tier">Maior tier</option>
          <option value="recent">Mais recente</option>
        </select>
      </div>
    </div>
  );
}
