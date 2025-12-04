import React from "react";

export type Product = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  // Yeni alan:
  unit?: string; // "adet" | "kg" | "L" | "paket"
};

type ProductListProps = {
  products: Product[];
  calculateRemainingDays: (expiryDate: string) => number;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

// Kategori → ikon
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    "Süt Ürünleri": "🥛",
    Kahvaltılık: "🍯",
    Et: "🍖",
    İçecek: "🥤",
    "Meyve-Sebze": "🥬",
    Atıştırmalık: "🍪",
  };
  return icons[category] ?? "📦";
};

// Kategori → ana renk (accent)
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Süt Ürünleri": "#60a5fa", // mavi
    Kahvaltılık: "#f59e0b", // turuncu
    Et: "#f97373", // kırmızımsı
    İçecek: "#22c55e", // yeşil
    "Meyve-Sebze": "#34d399", // açık yeşil
    Atıştırmalık: "#a855f7", // mor
  };
  return colors[category] ?? "#6b7280"; // gri
};

// SKT'ye göre satır arka planı
const getRowBackground = (remaining: number): string => {
  if (remaining < 0) return "#ffe6e6"; // süresi geçmiş
  if (remaining <= 3) return "#fff4e0"; // kritik
  if (remaining <= 7) return "#fffde7"; // yakında
  return "#e8f5e9"; // güvenli
};

// Durum renkleri
const getStatusColor = (remaining: number): string => {
  if (remaining < 0) return "#c62828";
  if (remaining <= 3) return "#ef6c00";
  if (remaining <= 7) return "#f9a825";
  return "#2e7d32";
};

function ProductList({
  products,
  calculateRemainingDays,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div
        style={{
          marginTop: 24,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#f0f0f0",
          fontSize: 14,
        }}
      >
        Henüz ürün yok veya filtrelere uyan ürün bulunamadı.
      </div>
    );
  }

  // Tarihe göre sıralama (en yakın SKT yukarıda)
  const sorted = [...products].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Ürün Listesi</h2>
      <div
        style={{
          borderRadius: 8,
          border: "1px solid #ddd",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f5f5f5",
              }}
            >
              <th style={{ textAlign: "left", padding: 8 }}>Ürün</th>
              <th style={{ textAlign: "left", padding: 8 }}>Kategori</th>
              <th style={{ textAlign: "right", padding: 8 }}>Miktar</th>
              <th style={{ textAlign: "left", padding: 8 }}>SKT</th>
              <th style={{ textAlign: "left", padding: 8 }}>Durum</th>
              <th style={{ textAlign: "right", padding: 8 }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const remaining = calculateRemainingDays(p.expiryDate);
              const bg = getRowBackground(remaining);
              const statusColor = getStatusColor(remaining);
              const categoryColor = getCategoryColor(p.category);

              let statusText = "";
              if (remaining < 0) statusText = "Süresi geçmiş";
              else if (remaining <= 3)
                statusText = `Kritik (${remaining} gün kaldı)`;
              else statusText = `${remaining} gün kaldı`;

              const lowStock =
                typeof p.minStock === "number" &&
                p.minStock > 0 &&
                p.quantity <= p.minStock;

              // Birim bilgisi yoksa varsayılan "adet"
              const unitLabel = p.unit && p.unit.length > 0 ? p.unit : "adet";
              const quantityText = `${p.quantity} ${unitLabel}`;

              return (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: bg,
                    // kategoriye göre ince sol çizgi
                    borderLeft: `4px solid ${categoryColor}`,
                  }}
                >
                  {/* Ürün + ikon */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>
                      {getCategoryIcon(p.category)}
                    </span>
                    <span>{p.name}</span>
                  </td>

                  {/* Kategori (renkli etiket) */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        backgroundColor: "#f9fafb",
                        border: `1px solid ${categoryColor}`,
                        color: "#111827",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: categoryColor,
                          marginRight: 6,
                        }}
                      />
                      {p.category}
                    </span>
                  </td>

                  {/* Miktar (adet/kg/L/paket) */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                      textAlign: "right",
                    }}
                  >
                    {quantityText}
                  </td>

                  {/* SKT */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    {p.expiryDate}
                  </td>

                  {/* Durum + düşük stok uyarısı */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                      color: statusColor,
                      fontWeight: 600,
                    }}
                  >
                    <div>{statusText}</div>
                    {lowStock && (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 12,
                          color: "#d32f2f",
                          fontWeight: 500,
                        }}
                      >
                        Düşük stok! (miktar: {quantityText}, min: {p.minStock})
                      </div>
                    )}
                  </td>

                  {/* İşlemler */}
                  <td
                    style={{
                      padding: 8,
                      borderTop: "1px solid #eee",
                      textAlign: "right",
                    }}
                  >
                    <button
                      onClick={() => onEdit(p)}
                      style={{
                        marginRight: 8,
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid #1976d2",
                        backgroundColor: "transparent",
                        color: "#1976d2",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#d32f2f",
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
