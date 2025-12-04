// src/components/CategoryChart.tsx

export type CategoryChartItem = {
  label: string; // ekranda görünen isim (Süt Ürünleri vb.)
  value: number; // toplam adet
};

type CategoryChartProps = {
  data: CategoryChartItem[];
};

function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

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
        Kategori Grafiği (Toplam Adet)
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {data.map((item) => {
          const widthPercent = (item.value / maxValue) * 100;

          return (
            <div key={item.label}>
              <div
                style={{
                  fontSize: 13,
                  marginBottom: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{item.label}</span>
                <span>{item.value} adet</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "#e3f2fd",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${widthPercent}%`,
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, #64b5f6, #1976d2)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryChart;
