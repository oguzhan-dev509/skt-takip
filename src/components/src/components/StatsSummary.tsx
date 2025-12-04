type StatsSummaryProps = {
  totalCount: number;
  criticalCount: number;
  expiredCount: number;
  lowStockCount: number; // 👈 yeni
};

function StatsSummary({
  totalCount,
  criticalCount,
  expiredCount,
  lowStockCount,
}: StatsSummaryProps) {
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
        }}
      >
        <div style={{ fontSize: 12, color: "#616161", marginBottom: 4 }}>
          Toplam Ürün
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{totalCount}</div>
        <div style={{ fontSize: 11, color: "#9e9e9e", marginTop: 4 }}>
          Stoktaki tüm kayıtlı ürünler.
        </div>
      </div>

      {/* Kritik SKT */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ffcc80",
          backgroundColor: "#fff3e0",
        }}
      >
        <div style={{ fontSize: 12, color: "#e65100", marginBottom: 4 }}>
          Kritik (≤ 3 gün)
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{criticalCount}</div>
        <div style={{ fontSize: 11, color: "#bf360c", marginTop: 4 }}>
          SKT&apos;si 3 günden az kalan ürünler.
        </div>
      </div>

      {/* Süresi geçmiş */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ef9a9a",
          backgroundColor: "#ffebee",
        }}
      >
        <div style={{ fontSize: 12, color: "#b71c1c", marginBottom: 4 }}>
          Süresi Geçmiş
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{expiredCount}</div>
        <div style={{ fontSize: 11, color: "#b71c1c", marginTop: 4 }}>
          SKT&apos;si geçmiş ürünler.
        </div>
      </div>

      {/* Düşük stokta */}
      <div
        style={{
          flex: 1,
          minWidth: 150,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ffe082",
          backgroundColor: "#fffde7",
        }}
      >
        <div style={{ fontSize: 12, color: "#f57f17", marginBottom: 4 }}>
          Düşük Stokta
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{lowStockCount}</div>
        <div style={{ fontSize: 11, color: "#757575", marginTop: 4 }}>
          Adedi minimum stok değerine eşit veya altında olan ürünler.
        </div>
      </div>
    </div>
  );
}

export default StatsSummary;
