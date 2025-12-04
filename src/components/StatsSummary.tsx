type StatsSummaryProps = {
  totalCount: number;
  criticalCount: number;
  expiredCount: number;
};

function StatsSummary({
  totalCount,
  criticalCount,
  expiredCount,
}: StatsSummaryProps) {
  const safeTotal = totalCount || 0;
  const criticalRatio =
    safeTotal > 0 ? Math.round((criticalCount / safeTotal) * 100) : 0;
  const expiredRatio =
    safeTotal > 0 ? Math.round((expiredCount / safeTotal) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      {/* Toplam ürün */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#616161",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>📦</span>
          <span>Toplam Ürün</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{safeTotal}</div>
        <div style={{ fontSize: 11, color: "#757575" }}>
          Stoktaki tüm kayıtlı ürünler.
        </div>
      </div>

      {/* Kritik ürünler */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ffcc80",
          backgroundColor: "#fff3e0",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#e65100",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>⏰</span>
          <span>Kritik (≤ 3 gün)</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{criticalCount}</div>
        <div style={{ fontSize: 11, color: "#8d6e63" }}>
          {safeTotal > 0
            ? `%${criticalRatio}’i çok yakında süresi dolacak.`
            : "Şu an kritik ürün yok."}
        </div>
      </div>

      {/* Süresi geçmiş ürünler */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ef9a9a",
          backgroundColor: "#ffebee",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#b71c1c",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>⚠️</span>
          <span>Süresi Geçmiş</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{expiredCount}</div>
        <div style={{ fontSize: 11, color: "#b71c1c" }}>
          {safeTotal > 0
            ? `%${expiredRatio}’i süresi geçmiş durumda.`
            : "Henüz süresi geçmiş ürün yok."}
        </div>
      </div>
    </div>
  );
}

export default StatsSummary;
