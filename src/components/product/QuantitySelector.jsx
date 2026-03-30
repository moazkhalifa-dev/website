export function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  return (
    <div className="qty-selector">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span>{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
