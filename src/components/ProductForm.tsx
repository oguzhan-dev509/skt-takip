import React from "react";

type AddProductFormProps = {
  name: string;
  category: string;
  quantity: string;
  minStock: string;
  expiryDate: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onMinStockChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

// Kategori listesi (elle uğraşmana gerek kalmasın diye burada topladım)
const CATEGORIES = [
  // Gıda
  { value: "Süt Ürünleri", label: "Süt Ürünleri", group: "Gıda" },
  { value: "Et ve Tavuk Ürünleri", label: "Et ve Tavuk Ürünleri", group: "Gıda" },
  { value: "Unlu Mamuller", label: "Unlu Mamuller", group: "Gıda" },
  { value: "Kahvaltılık", label: "Kahvaltılık", group: "Gıda" },
  { value: "İçecekler", label: "İçecekler", group: "Gıda" },
  { value: "Atıştırmalık", label: "Atıştırmalık", group: "Gıda" },
  { value: "Bakliyat & Kuru Gıda", label: "Bakliyat & Kuru Gıda", group: "Gıda" },
  { value: "Dondurulmuş Ürünler", label: "Dondurulmuş Ürünler", group: "Gıda" },
  { value: "Konserve & Turşu", label: "Konserve & Turşu", group: "Gıda" },

  // Gıda dışı
  { value: "Temizlik Ürünleri", label: "Temizlik Ürünleri", group: "Gıda Dışı" },
  { value: "Kişisel Bakım / Kozmetik", label: "Kişisel Bakım / Kozmetik", group: "Gıda Dışı" },
  { value: "İlaç & Takviye", label: "İlaç & Takviye", group: "Gıda Dışı" },
  { value: "Bebek Ürünleri", label: "Bebek Ürünleri", group: "Gıda Dışı" },
  { value: "Evcil Hayvan Ürünleri", label: "Evcil Hayvan Ürünleri", group: "Gıda Dışı" },

  // Diğer
  { value: "Diğer", label: "Diğer", group: "Genel" },
];

const AddProductForm: React.FC<AddProductFormProps> = ({
  name,
  category,
  quantity,
  minStock,
  expiryDate,
  onNameChange,
  onCategoryChange,
  onQuantityChange,
  onMinStockChange,
  onExpiryDateChange,
  onSubmit,
  isEditing,
}) => {
  const foods = CATEGORIES.filter((c) => c.group === "Gıda");
  const nonFoods = CATEGORIES.filter((c) => c.group === "Gıda Dışı");
  const others = CATEGORIES.filter((c) => c.group === "Genel");

  // Kategori boşsa varsayılan olarak "Süt Ürünleri"ni seç
  const categoryValue = category || "Süt Ürünleri";

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "grid",
        gap: 12,
        marginTop: 12,
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        fontSize: 14,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <label style={{ display: "grid", gap: 4 }}>
          <span>Ürün Adı</span>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            placeholder="Örn: Yoğurt 1kg"
            style={{
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span>Kategori</span>
          <select
            value={categoryValue}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          >
            <optgroup label="Gıda">
              {foods.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </optgroup>

            <optgroup label="Gıda Dışı">
              {nonFoods.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </optgroup>

            {others.length > 0 && (
              <optgroup label="Diğer">
                {others.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <label style={{ display: "grid", gap: 4 }}>
          <span>Adet</span>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            style={{
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span>Minimum Stok (opsiyonel)</span>
          <input
            type="number"
            min={0}
            value={minStock}
            onChange={(e) => onMinStockChange(e.target.value)}
            style={{
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span>Son Kullanma Tarihi (SKT)</span>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => onExpiryDateChange(e.target.value)}
            required
            style={{
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
        </label>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 4,
        }}
      >
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: isEditing ? "#f97316" : "#16a34a",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isEditing ? "Ürünü Güncelle" : "Ürün Ekle"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
