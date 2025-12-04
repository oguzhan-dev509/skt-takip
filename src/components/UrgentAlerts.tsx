// src/components/UrgentAlerts.tsx
import type { Product } from "./ProductList";

type UrgentAlertsProps = {
  products: Product[];
  calculateRemainingDays: (expiryDate: string) => number;
};

function UrgentAlerts({ products, calculateRemainingDays }: UrgentAlertsProps) {
  // Her ürün için kalan günü hesaplayalım
  const withRemaining = products.map((p) => ({
    ...p,
    remainingDays: calculateRemainingDays(p.expiryDate),
  }));

  // Süresi geçmiş ürünler (en eski 3 tanesi)
  const expired = withRemaining
    .filter((p) => p.remainingDays < 0)
    .sort((a, b) => a.remainingDays - b.remainingDays) // -10, -5, -1...
    .slice(0, 3);

  // Kritik (0–3 gün kalan) ürünler (en acil 3 tanesi)
  const critical = withRemaining
    .filter((p) => p.remainingDays >= 0 && p.remainingDays <= 3)
    .sort((a, b) => a.remainingDays - b.remainingDays) // 0,1,2...
    .slice(0, 3);

  // Hiç acil durum yoksa paneli göstermeyelim
  if (expired.length === 0 && critical.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginTop: 8,
        marginBottom: 16,
        padding: 12,
        borderRadius: 10,
        border: "1px solid #ffe0e0",
        backgroundColor: "#fff8f8",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 10,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>🚨</span>
        <span>Acil Uyarılar</span>
      </h2>

      {/* Süresi geçmiş ürünler */}
      {expired.length > 0 && (
        <div style={{ marginBottom: critical.length > 0 ? 8 : 0 }}>
          <div
            style={{
              fontSize: 13,
              color: "#b71c1c",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Süresi geçmiş ürünler
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
            {expired.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — {p.expiryDate} ({" "}
                {Math.abs(p.remainingDays)} gün önce )
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Kritik ürünler (0–3 gün) */}
      {critical.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#e65100",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Çok yakında süresi dolacak ürünler (≤ 3 gün)
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
            {critical.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — {p.expiryDate} (
                {p.remainingDays === 0
                  ? "bugün son gün"
                  : `${p.remainingDays} gün kaldı`}
                )
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default UrgentAlerts;
