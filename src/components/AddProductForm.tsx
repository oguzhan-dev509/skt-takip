import React, { useEffect, useState } from "react";

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

// Ürün adından kategori tahmini için basit kurallar
const guessCategoryFromName = (rawName: string): string | null => {
  const name = rawName.toLocaleLowerCase("tr-TR");
  const inText = (kw: string) => name.includes(kw);

  // Süt ürünleri
  if (
    inText("yoğurt") ||
    inText("yogurt") ||
    inText("süt") ||
    inText("sut") ||
    inText("peynir") ||
    inText("kaşar") ||
    inText("kefir") ||
    inText("krema")
  ) {
    return "Süt Ürünleri";
  }

  // Kahvaltılık
  if (
    inText("reçel") ||
    inText("bal") ||
    inText("pekmez") ||
    inText("tahin") ||
    inText("fındık ezmesi") ||
    inText("fıstık ezmesi") ||
    inText("zeytin")
  ) {
    return "Kahvaltılık";
  }

  // Et
  if (
    inText("kıyma") ||
    inText("köfte") ||
    inText("sucuk") ||
    inText("pastırma") ||
    inText("tavuk") ||
    inText("bonfile") ||
    inText("pirzola")
  ) {
    return "Et";
  }

  // İçecek
  if (
    inText("ayran") ||
    inText("kola") ||
    inText("gazoz") ||
    inText("meyve suyu") ||
    inText("meyve su") ||
    inText("şalgam") ||
    inText("su") ||
    inText("soda") ||
    inText("mineral")
  ) {
    return "İçecek";
  }

  // Meyve-Sebze
  if (
    inText("domates") ||
    inText("salatalık") ||
    inText("biber") ||
    inText("marul") ||
    inText("elma") ||
    inText("armut") ||
    inText("muz") ||
    inText("patates") ||
    inText("soğan") ||
    inText("ıspanak") ||
    inText("karnabahar")
  ) {
    return "Meyve-Sebze";
  }

  // Atıştırmalık
  if (
    inText("bisküvi") ||
    inText("cips") ||
    inText("kraker") ||
    inText("çikolata") ||
    inText("goffret") ||
    inText("gofret") ||
    inText("çekirdek") ||
    inText("kuruyemiş")
  ) {
    return "Atıştırmalık";
  }

  return null;
};

// Şimdilik sadece bu 6 kategoriyle devam ediyoruz
const CATEGORY_OPTIONS = [
  "Süt Ürünleri",
  "Kahvaltılık",
  "Et",
  "İçecek",
  "Meyve-Sebze",
  "Atıştırmalık",
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
  // Kullanıcı kategori alanına manuel dokundu mu?
  const [categoryTouched, setCategoryTouched] = useState(false);

  // Yeni ürün eklemeye geçildiğinde otomatik tahmine tekrar izin ver
  useEffect(() => {
    if (!isEditing) {
      if (!category) {
        setCategoryTouched(false);
      }
    } else {
      // düzenleme modunda kategori otomatik değişmesin
      setCategoryTouched(true);
    }
  }, [isEditing, category]);

  const today = new Date().toISOString().slice(0, 10);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onNameChange(value);

    // Sadece yeni ürün eklerken, kullanıcı kategoriye dokunmadıysa tahmin yap
    if (!isEditing && !categoryTouched && value.trim().length >= 2) {
      const suggestion = guessCategoryFromName(value);
      if (suggestion && suggestion !== category) {
        onCategoryChange(suggestion);
      }
    }
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryTouched(true);
    onCategoryChange(e.target.value);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 8,
        }}
      >
        {/* Ürün adı */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 2,
            }}
          >
            Ürün Adı
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Örn: Yoğurt, Ayran, Kaşar..."
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 2,
            }}
          >
            Kategori
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 13,
              backgroundColor: "#ffffff",
            }}
            required
          >
            <option value="">Seçiniz...</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p
            style={{
              margin: 0,
              marginTop: 2,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            Ürün adından kategori otomatik tahmin edilir, istersen
            değiştirebilirsin.
          </p>
        </div>
      </div>

      {/* Adet & minimum stok */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 2,
            }}
          >
            Adet
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
            required
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 2,
            }}
          >
            Minimum Stok (opsiyonel)
          </label>
          <input
            type="number"
            min={0}
            value={minStock}
            onChange={(e) => onMinStockChange(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
            placeholder="Örn: 3"
          />
        </div>
      </div>

      {/* SKT */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 12,
            marginBottom: 2,
          }}
        >
          Son Kullanma Tarihi (SKT)
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => onExpiryDateChange(e.target.value)}
          min={today}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 13,
          }}
          required
        />
      </div>

      {/* Buton */}
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
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#2563eb",
            color: "#f9fafb",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isEditing ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
