type FiltersProps = {
  search: string;
  filterCategory: string;
  hideExpired: boolean;
  expiryFilter: string; // 👈 yeni
  onSearchChange: (value: string) => void;
  onFilterCategoryChange: (value: string) => void;
  onHideExpiredChange: (value: boolean) => void;
  onExpiryFilterChange: (value: string) => void; // 👈 yeni
};

function Filters({
  search,
  filterCategory,
  hideExpired,
  expiryFilter,
  onSearchChange,
  onFilterCategoryChange,
  onHideExpiredChange,
  onExpiryFilterChange,
}: FiltersProps) {
  return (
    <section
      style={{
        marginBottom: 16,
        marginTop: 8,
        padding: 12,
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 18 }}>
        Filtreler / Ayarlar
      </h2>

      {/* İsimde arama */}
      <div style={{ marginBottom: 8 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          İsimde ara:
        </label>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ürün adı..."
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
      </div>

      {/* Kategori filtresi */}
      <div style={{ marginBottom: 8 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          Kategori:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 250,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            backgroundColor: "#ffffff",
          }}
        >
          <option value="Tümü">Tümü</option>

          <optgroup label="Gıda">
            <option value="Süt Ürünleri">Süt Ürünleri</option>
            <option value="Et ve Tavuk Ürünleri">Et ve Tavuk Ürünleri</option>
            <option value="Unlu Mamuller">Unlu Mamuller</option>
            <option value="Kahvaltılık">Kahvaltılık</option>
            <option value="İçecekler">İçecekler</option>
            <option value="Atıştırmalık">Atıştırmalık</option>
            <option value="Bakliyat & Kuru Gıda">Bakliyat & Kuru Gıda</option>
            <option value="Dondurulmuş Ürünler">Dondurulmuş Ürünler</option>
            <option value="Konserve & Turşu">Konserve & Turşu</option>
          </optgroup>

          <optgroup label="Gıda Dışı">
            <option value="Temizlik Ürünleri">Temizlik Ürünleri</option>
            <option value="Kişisel Bakım / Kozmetik">
              Kişisel Bakım / Kozmetik
            </option>
            <option value="İlaç & Takviye">İlaç & Takviye</option>
            <option value="Bebek Ürünleri">Bebek Ürünleri</option>
            <option value="Evcil Hayvan Ürünleri">
              Evcil Hayvan Ürünleri
            </option>
          </optgroup>

          <optgroup label="Diğer">
            <option value="Diğer">Diğer</option>
          </optgroup>
        </select>
      </div>

      {/* SKT / Tarih filtresi */}
      <div style={{ marginBottom: 8 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          SKT filtresi:
        </label>
        <select
          value={expiryFilter}
          onChange={(e) => onExpiryFilterChange(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 250,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            backgroundColor: "#ffffff",
          }}
        >
          <option value="Hepsi">Hepsi</option>
          <option value="Kritik">Sadece kritik (≤ 3 gün)</option>
          <option value="YediGun">7 gün içinde bitecekler</option>
          <option value="BuAy">Bu ay içinde bitecekler</option>
          <option value="SuresiGecmis">Sadece süresi geçmişler</option>
        </select>
      </div>

      {/* Süresi geçmişleri gizle checkbox'ı */}
      <div>
        <label style={{ fontSize: 14 }}>
          <input
            type="checkbox"
            checked={hideExpired}
            onChange={(e) => onHideExpiredChange(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Süresi geçmiş ürünleri gizle
        </label>
      </div>
    </section>
  );
}

export default Filters;
