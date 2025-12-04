type Props = {
  total: number;
  critical: number;
  expired: number;
};

export default function StatsSummary({ total, critical, expired }: Props) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
      <div style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", minWidth: 150 }}>
        <strong>Toplam Ürün</strong>
        <div>{total}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, border: "1px solid #ff9800", minWidth: 150 }}>
        <strong>Kritik (≤ 3 gün)</strong>
        <div>{critical}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, border: "1px solid #f44336", minWidth: 150 }}>
        <strong>Süresi Geçmiş</strong>
        <div>{expired}</div>
      </div>
    </div>
  );
}
