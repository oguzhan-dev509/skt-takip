type AddProductFormProps = {
  name: string;
  category: string;
  quantity: string;
  minStock: string;
  expiryDate: string;
  unit: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onMinStockChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

function AddProductForm({
  name,
  category,
  quantity,
  minStock,
  expiryDate,
  unit,
  onNameChange,
  onCategoryChange,
  onQuantityChange,
  onMinStockChange,
  onUnitChange,
  onExpiryDateChange,
  onSubmit,
  isEditing,
}: AddProductFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 24 }}>
      
      {/* Ürün Adı */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Ürün Adı:{" "}
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Örn: Yoğurt, Ayran, Kaşar"
          />
        </label>
      </div>

      {/* Kategori */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Kategori:{" "}
          <input
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Örn: Kahvaltılık"
          />
        </label>
      </div>

      {/* Miktar */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Miktar:{" "}
          <input
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="Örn: 3"
          />
        </label>
      </div>

      {/* Minimum Stok */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Minimum Stok (opsiyonel):{" "}
          <input
            value={minStock}
            onChange={(e) => onMinStockChange(e.target.value)}
            placeholder="Örn: 1"
          />
        </label>
      </div>

      {/* Birim */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Birim:{" "}
          <select value={unit} onChange={(e) => onUnitChange(e.target.value)}>
            <option value="adet">Adet</option>
            <option value="kg">Kg</option>
            <option value="L">Litre</option>
            <option value="paket">Paket</option>
          </select>
        </label>
      </div>

      {/* SKT */}
      <div style={{ marginBottom: 8 }}>
        <label>
          Son Kullanma Tarihi (SKT):{" "}
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => onExpiryDateChange(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" style={{ marginTop: 12 }}>
        {isEditing ? "Ürünü Güncelle" : "Ürünü Ekle"}
      </button>
    </form>
  );
}

export default AddProductForm;
