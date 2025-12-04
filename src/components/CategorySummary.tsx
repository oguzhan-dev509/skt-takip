// src/components/CategorySummary.tsx

type CategoryStat = {
  key: string;    // kategori değeri (ör: "Süt Ürünleri")
  label: string;  // ekranda gösterilecek isim
  icon: string;   // 🥛 vb.
  count: number;  // o kategorideki ürün sayısı
};

type CategorySummaryProps = {
  stats: CategoryStat[];
};

function CategorySummary({ stats }: CategorySummaryProps) {
  // Hiç kategori yoksa göstermeyelim
  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginBottom: 20,
        padding: 12,
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        backgroundColor: "#fbfbfb",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 16 }}>
        Kategori Özeti
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {stats.map((item) => (
          <div
            key={item.key}
            style={{
              flex: 1,
              minWidth: 140,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export type { CategoryStat };
export default CategorySummary;
