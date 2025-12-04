// src/App.tsx
import React, { useState, useEffect } from "react";
import StatsSummary from "./components/StatsSummary";
import AddProductForm from "./components/AddProductForm";
import Filters from "./components/Filters";
import ProductList, { Product } from "./components/ProductList";
import CategorySummary, { CategoryStat } from "./components/CategorySummary";
import UrgentAlerts from "./components/UrgentAlerts";
import CategoryChart, { CategoryChartItem } from "./components/CategoryChart";
import IntroPanel from "./components/IntroPanel";
import CalendarView from "./components/CalendarView";

// Outbox / API
import { createProduct } from "./api/products";

// SKT'ye kalan gün sayısını hesaplayan yardımcı fonksiyon
const calculateRemainingDays = (expiryDate: string) => {
  if (!expiryDate) return 0;

  const expiry = new Date(expiryDate).getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = expiry - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

function App() {
  // DARK MODE
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // TARAYICI BİLDİRİM DURUMU
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">(() => {
      if (typeof window === "undefined") return "unsupported";
      if (typeof Notification === "undefined") return "unsupported";
      return Notification.permission;
    });

  const [lastNotificationDate, setLastNotificationDate] = useState<
    string | null
  >(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lastNotificationDate");
  });

  // GÜNLÜK OTOMATİK KONTROL SAATİ (HH:MM)
  const [notificationTime, setNotificationTime] = useState<string>(() => {
    if (typeof window === "undefined") return "21:00";
    return localStorage.getItem("notificationTime") ?? "21:00";
  });

  // ÜRÜNLERİ LOCALSTORAGE'DAN OKUYAN STATE
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("products");
    try {
      if (!saved) return [];
      const raw = JSON.parse(saved) as any[];
      return raw.map((p) => ({
        ...p,
        quantity:
          typeof p.quantity === "number" && p.quantity > 0
            ? p.quantity
            : 1,
        minStock:
          typeof p.minStock === "number" && p.minStock >= 0
            ? p.minStock
            : 0,
        unit:
          typeof (p as any).unit === "string" && (p as any).unit.length > 0
            ? (p as any).unit
            : "adet",
      })) as Product[];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [unit, setUnit] = useState<"adet" | "kg" | "L" | "paket">("adet");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [hideExpired, setHideExpired] = useState(false);
  const [expiryFilter, setExpiryFilter] = useState("Hepsi");
  const [editingId, setEditingId] = useState<number | null>(null);

  // TEMA DEĞİŞTİKÇE LOCALSTORAGE
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ÜRÜNLER DEĞİŞTİKÇE LOCALSTORAGE
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // BİLDİRİM SAATİ DEĞİŞTİKÇE LOCALSTORAGE
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("notificationTime", notificationTime);
  }, [notificationTime]);

  // YENİ ÜRÜN EKLEME / GÜNCELLEME
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !expiryDate || !quantity.trim()) {
      return;
    }

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return;
    }

    const parsedMin = parseInt(minStock, 10);
    const safeMin = isNaN(parsedMin) || parsedMin < 0 ? 0 : parsedMin;

    if (editingId === null) {
      // Yeni ürün
      const newProduct: Product = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        quantity: parsedQty,
        minStock: safeMin,
        expiryDate,
        // yeni eklenen alan
        unit,
      };

      // 1) UI'yi güncelle
      setProducts((prev) => [...prev, newProduct]);

      // 2) Outbox / API için payload
      const payload = {
        id: String(newProduct.id),
        name: newProduct.name,
        category: newProduct.category,
        quantity: newProduct.quantity,
        skt: newProduct.expiryDate,
        // şimdilik unit backend'e gönderilmese de olur, istersen eklersin
      };

      // 3) Arka planda gönder / kuyruğa yaz
      createProduct(payload).catch(() => {
        // Hata olursa sessizce geçiyoruz
      });
    } else {
      // Düzenleme modu
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: name.trim(),
                category: category.trim(),
                quantity: parsedQty,
                minStock: safeMin,
                expiryDate,
                unit,
              }
            : p
        )
      );
    }

    // Formu sıfırla
    setName("");
    setCategory("");
    setQuantity("");
    setMinStock("");
    setExpiryDate("");
    setUnit("adet");
    setEditingId(null);
  };

  // ÜRÜN SİLME
  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // DÜZENLEME MODU
  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setQuantity(product.quantity.toString());
    setMinStock(product.minStock.toString());
    setExpiryDate(product.expiryDate);
    setUnit((product as any).unit ?? "adet");
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date(today);

  // FİLTRELENMİŞ LİSTE
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchCategory =
      filterCategory === "Tümü" || p.category === filterCategory;

    const remainingDays = calculateRemainingDays(p.expiryDate);
    const isExpired = remainingDays < 0 || p.expiryDate < today;

    const matchExpiredCheckbox = hideExpired ? !isExpired : true;

    let matchExpiryFilter = true;
    if (expiryFilter === "Kritik") {
      matchExpiryFilter = remainingDays >= 0 && remainingDays <= 3;
    } else if (expiryFilter === "YediGun") {
      matchExpiryFilter = remainingDays >= 0 && remainingDays <= 7;
    } else if (expiryFilter === "BuAy") {
      const expiry = new Date(p.expiryDate);
      matchExpiryFilter =
        remainingDays >= 0 &&
        expiry.getFullYear() === todayDate.getFullYear() &&
        expiry.getMonth() === todayDate.getMonth();
    } else if (expiryFilter === "SuresiGecmis") {
      matchExpiryFilter = isExpired;
    }

    return (
      matchSearch &&
      matchCategory &&
      matchExpiredCheckbox &&
      matchExpiryFilter
    );
  });

  // ÖZET SAYILAR
  const totalCount = products.length;

  const criticalCount = products.filter((p) => {
    const remainingDays = calculateRemainingDays(p.expiryDate);
    return remainingDays >= 0 && remainingDays <= 3;
  }).length;

  const expiredCount = products.filter((p) => {
    const remainingDays = calculateRemainingDays(p.expiryDate);
    return remainingDays < 0;
  }).length;

  const lowStockCount = products.filter(
    (p) => p.minStock > 0 && p.quantity <= p.minStock
  ).length;

  // KATEGORİ KONFİG
  const CATEGORY_CONFIG: { key: string; label: string; icon: string }[] = [
    // Gıda
    { key: "Süt Ürünleri", label: "Süt Ürünleri", icon: "🥛" },
    { key: "Et ve Tavuk Ürünleri", label: "Et ve Tavuk Ürünleri", icon: "🍖" },
    { key: "Unlu Mamuller", label: "Unlu Mamuller", icon: "🥐" },
    { key: "Kahvaltılık", label: "Kahvaltılık", icon: "🍯" },
    { key: "İçecekler", label: "İçecekler", icon: "🥤" },
    { key: "Atıştırmalık", label: "Atıştırmalık", icon: "🍪" },
    { key: "Bakliyat & Kuru Gıda", label: "Bakliyat & Kuru Gıda", icon: "🌾" },
    { key: "Dondurulmuş Ürünler", label: "Dondurulmuş Ürünler", icon: "🧊" },
    { key: "Konserve & Turşu", label: "Konserve & Turşu", icon: "🥫" },

    // Gıda dışı
    { key: "Temizlik Ürünleri", label: "Temizlik Ürünleri", icon: "🧼" },
    {
      key: "Kişisel Bakım / Kozmetik",
      label: "Kişisel Bakım / Kozmetik",
      icon: "💄",
    },
    { key: "İlaç & Takviye", label: "İlaç & Takviye", icon: "💊" },
    { key: "Bebek Ürünleri", label: "Bebek Ürünleri", icon: "👶" },
    {
      key: "Evcil Hayvan Ürünleri",
      label: "Evcil Hayvan Ürünleri",
      icon: "🐾",
    },
  ];

  const categoryStats: CategoryStat[] = CATEGORY_CONFIG.map((cfg) => {
    const count = products.filter((p) => p.category === cfg.key).length;
    return {
      key: cfg.key,
      label: cfg.label,
      icon: cfg.icon,
      count,
    };
  }).filter((item) => item.count > 0);

  const categoryChartData: CategoryChartItem[] = CATEGORY_CONFIG.map((cfg) => {
    const value = products
      .filter((p) => p.category === cfg.key)
      .reduce((sum, p) => sum + (p.quantity ?? 1), 0);
    return { label: cfg.label, value };
  }).filter((item) => item.value > 0);

  // 🔔 BİLDİRİM KONTROLÜ
  function checkAndNotify(options?: { auto?: boolean }) {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    const todayKey = new Date().toISOString().slice(0, 10);

    if (options?.auto && lastNotificationDate === todayKey) {
      return;
    }

    const expiringSoon = products
      .map((p) => ({
        product: p,
        remaining: calculateRemainingDays(p.expiryDate),
      }))
      .filter((x) => x.remaining >= 0 && x.remaining <= 3);

    if (expiringSoon.length === 0) {
      if (!options?.auto && typeof window !== "undefined") {
        window.alert("Yakında süresi dolacak (≤ 3 gün) ürün yok.");
      }
      return;
    }

    let body: string;

    if (expiringSoon.length === 1) {
      const x = expiringSoon[0];
      body = `${x.product.name} — ${x.product.expiryDate} (${x.remaining} gün kaldı)`;
    } else {
      body = `${expiringSoon.length} ürünün süresi 3 gün içinde dolacak.`;
    }

    try {
      new Notification("SKT Uyarısı", {
        body,
      });

      const todayKeyAfter = new Date().toISOString().slice(0, 10);
      setLastNotificationDate(todayKeyAfter);
      if (typeof window !== "undefined") {
        localStorage.setItem("lastNotificationDate", todayKeyAfter);
      }
    } catch {
      // ignore
    }
  }

  const handleRequestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      if (typeof window !== "undefined") {
        window.alert("Tarayıcın bildirimleri desteklemiyor.");
      }
      setNotificationPermission("unsupported");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === "granted") {
        checkAndNotify();
      }
    } catch {
      // ignore
    }
  };

  // 🔁 SEÇİLEN SAATTE GÜNLÜK OTOMATİK KONTROL
  useEffect(() => {
    if (notificationPermission !== "granted") return;
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);

      // Aynı günde zaten bildirim gönderdiysek tekrar gönderme
      if (lastNotificationDate === todayKey) return;

      const [hStr, mStr] = notificationTime.split(":");
      const targetMinutes =
        parseInt(hStr, 10) * 60 + parseInt(mStr || "0", 10);
      if (isNaN(targetMinutes)) return;

      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // Seçilen saat veya sonrasına geldiysek otomatik kontrol yap
      if (nowMinutes >= targetMinutes) {
        checkAndNotify({ auto: true });
      }
    }, 60 * 1000); // her dakika kontrol

    return () => clearInterval(interval);
  }, [notificationPermission, notificationTime, lastNotificationDate, products]);

  // CSV export
  const handleExportCsv = () => {
    if (filteredProducts.length === 0) {
      if (typeof window !== "undefined") {
        window.alert(
          "Dışa aktarılacak ürün bulunamadı (filtreleri kontrol et)."
        );
      }
      return;
    }

    const escapeCsv = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const header =
      "Ürün Adı,Kategori,Miktar,SKT,Kalan Gün,Durum\n";

    const rows = filteredProducts
      .map((p) => {
        const remaining = calculateRemainingDays(p.expiryDate);
        let status = "Güvenli";
        if (remaining < 0) status = "Süresi geçmiş";
        else if (remaining <= 3) status = "Kritik (≤ 3 gün)";
        else if (remaining <= 7) status = "Yakında bitecek (≤ 7 gün)";

        return [
          escapeCsv(p.name),
          escapeCsv(p.category),
          p.quantity.toString(),
          p.expiryDate,
          remaining.toString(),
          escapeCsv(status),
        ].join(",");
      })
      .join("\n");

    const csv = header + rows;

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `stok-raporu-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // TAKVİMDEN GÜN SEÇİLDİĞİNDE FORMUN SKT ALANINI DOLDUR
  const handleCalendarSelectDate = (isoDate: string | null) => {
    if (!isoDate) return;

    // Eğer bir ürünü düzenliyorsak, formun SKT'sini zorla değiştirmeyelim
    if (editingId !== null) return;

    setExpiryDate(isoDate);

    if (typeof window !== "undefined") {
      const el = document.getElementById("add-product-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#020617" : "#f5f5f5",
        padding: 16,
        color: darkMode ? "#e5e7eb" : "#111827",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          backgroundColor: darkMode ? "#0b1120" : "#ffffff",
          padding: 16,
          borderRadius: 12,
          boxShadow: darkMode
            ? "0 4px 20px rgba(0,0,0,0.7)"
            : "0 4px 10px rgba(0,0,0,0.06)",
          border: darkMode ? "1px solid #1f2937" : "none",
        }}
      >
        {/* Bildirim durumu + tema */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #4b5563",
              backgroundColor: darkMode ? "#111827" : "#f3f4f6",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {notificationPermission === "unsupported" && (
              <span>🔕 Bildirim desteklenmiyor</span>
            )}
            {notificationPermission === "default" && (
              <>
                <span>🔔 Bildirimler kapalı</span>
                <button
                  onClick={handleRequestNotificationPermission}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "3px 8px",
                    fontSize: 11,
                    cursor: "pointer",
                    backgroundColor: "#3b82f6",
                    color: "#f9fafb",
                  }}
                >
                  İzin ver
                </button>
              </>
            )}
            {notificationPermission === "denied" && (
              <span>
                🚫 Bildirim izni reddedildi (tarayıcı ayarlarından açılabilir).
              </span>
            )}
            {notificationPermission === "granted" && (
              <>
                <span>✅ Bildirimler açık</span>
                <button
                  onClick={() => checkAndNotify()}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "3px 8px",
                    fontSize: 11,
                    cursor: "pointer",
                    backgroundColor: "#10b981",
                    color: "#ecfdf5",
                  }}
                >
                  Şimdi kontrol et
                </button>
                <span
                  style={{
                    fontSize: 11,
                    marginLeft: 4,
                  }}
                >
                  Günlük kontrol saati:
                </span>
                <input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  style={{
                    fontSize: 11,
                    padding: "2px 4px",
                    borderRadius: 999,
                    border: "1px solid #9ca3af",
                    backgroundColor: darkMode ? "#111827" : "#ffffff",
                  }}
                />
              </>
            )}
          </div>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #9ca3af",
              backgroundColor: darkMode ? "#374151" : "#f3f4f6",
              color: darkMode ? "#e5e7eb" : "#111827",
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {darkMode ? "☀️ Açık Tema" : "🌙 Koyu Tema"}
          </button>
        </div>

        {/* Özet kutuları */}
        <StatsSummary
          totalCount={totalCount}
          criticalCount={criticalCount}
          expiredCount={expiredCount}
          lowStockCount={lowStockCount}
        />

        {/* Acil uyarılar */}
        <UrgentAlerts
          products={products}
          calculateRemainingDays={calculateRemainingDays}
        />

        {/* Kategori özeti + grafik + takvim */}
        <CategorySummary stats={categoryStats} />
        <CategoryChart data={categoryChartData} />
        <CalendarView
          products={products}
          calculateRemainingDays={calculateRemainingDays}
          onEditProduct={handleEditProduct}
          onSelectDate={handleCalendarSelectDate}
        />

        {/* Yeni ürün ekleme alanı */}
        <div id="add-product-form">
          <h1 style={{ marginTop: 0, marginBottom: 16 }}>Yeni Ürün Ekle</h1>

          <IntroPanel />

          <AddProductForm
            name={name}
            category={category}
            quantity={quantity}
            minStock={minStock}
            expiryDate={expiryDate}
            unit={unit}
            onNameChange={setName}
            onCategoryChange={setCategory}
            onQuantityChange={setQuantity}
            onMinStockChange={setMinStock}
            onUnitChange={setUnit}
            onExpiryDateChange={setExpiryDate}
            onSubmit={handleAddProduct}
            isEditing={editingId !== null}
          />
        </div>

        <Filters
          search={search}
          filterCategory={filterCategory}
          hideExpired={hideExpired}
          expiryFilter={expiryFilter}
          onSearchChange={setSearch}
          onFilterCategoryChange={setFilterCategory}
          onHideExpiredChange={setHideExpired}
          onExpiryFilterChange={setExpiryFilter}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 8,
          }}
        >
          <button
            onClick={handleExportCsv}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #1976d2",
              backgroundColor: darkMode ? "#1d4ed8" : "#e3f2fd",
              color: darkMode ? "#e5e7eb" : "#0d47a1",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📄 Gün Sonu Raporu (CSV)
          </button>
        </div>

        <ProductList
          products={filteredProducts}
          calculateRemainingDays={calculateRemainingDays}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
}

export default App;
