// src/components/CalendarView.tsx

import React, { useState, useEffect } from "react";
import { Product } from "./ProductList";

type CalendarViewProps = {
  products: Product[];
  calculateRemainingDays: (expiryDate: string) => number;
  onEditProduct?: (product: Product) => void;
  onSelectDate?: (isoDate: string | null) => void;
};

function CalendarView({
  products,
  calculateRemainingDays,
  onEditProduct,
  onSelectDate,
}: CalendarViewProps) {
  // Ekran genişliği (mobil ayarı için)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 480;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------- KATEGORİ RENKLERİ --------
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Süt Ürünleri": "#60a5fa",
      Kahvaltılık: "#f59e0b",
      Et: "#f97373",
      İçecek: "#22c55e",
      "Meyve-Sebze": "#34d399",
      Atıştırmalık: "#a855f7",
    };
    return colors[category] ?? "#6b7280";
  };

  // -------- TAKVİM ANA MANTIĞI --------
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-11

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getDateString = (day: number): string =>
    new Date(year, month, day).toISOString().slice(0, 10);

  const getItemsForDay = (day: number) => {
    const dateStr = getDateString(day);
    return products.filter((p) => p.expiryDate === dateStr);
  };

  const getColorForDay = (day: number) => {
    const items = getItemsForDay(day);
    if (items.length === 0) return "#e5e7eb"; // gri

    const worstStatus = Math.min(
      ...items.map((p) => calculateRemainingDays(p.expiryDate))
    );

    if (worstStatus < 0) return "#fecaca"; // kırmızı
    if (worstStatus <= 3) return "#fed7aa"; // turuncu
    if (worstStatus <= 7) return "#fef9c3"; // sarı
    return "#dcfce7"; // yeşil
  };

  const getTitleForDay = (day: number) => {
    const items = getItemsForDay(day);
    if (items.length === 0) {
      return "Bu gün için SKT'li ürün yok.";
    }
    return items
      .map((p) => {
        const remaining = calculateRemainingDays(p.expiryDate);
        const suffix =
          remaining < 0
            ? "süresi geçti"
            : remaining === 0
            ? "bugün"
            : `${remaining} gün`;
        return `${p.name} (${suffix})`;
      })
      .join(", ");
  };

  const weekdayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const handlePrevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setBaseDate(d);
    setSelectedDay(null);
    onSelectDate?.(null);
  };

  const handleNextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setBaseDate(d);
    setSelectedDay(null);
    onSelectDate?.(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    onSelectDate?.(getDateString(day));
  };

  const handleCloseDetails = () => {
    setSelectedDay(null);
    onSelectDate?.(null);
  };

  // -------- RENDER --------

  return (
    <section
      style={{
        marginTop: isSmallScreen ? 16 : 24,
        marginBottom: isSmallScreen ? 16 : 24,
        padding: isSmallScreen ? 8 : 12,
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Başlık ve ay navigasyonu */}
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: isSmallScreen ? 16 : 18,
            lineHeight: 1.3,
          }}
        >
          📅 SKT Takvimi —{" "}
          {baseDate.toLocaleString("tr-TR", { month: "long" })} {year}
        </h2>

        <div
          style={{
            display: "flex",
            gap: 6,
            alignSelf: isSmallScreen ? "stretch" : "auto",
            justifyContent: isSmallScreen ? "flex-end" : "flex-start",
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{
              padding: isSmallScreen ? "4px 8px" : "4px 10px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
              fontSize: isSmallScreen ? 11 : 12,
            }}
          >
            ◀ Önceki Ay
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              padding: isSmallScreen ? "4px 8px" : "4px 10px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
              fontSize: isSmallScreen ? 11 : 12,
            }}
          >
            Sonraki Ay ▶
          </button>
        </div>
      </div>

      {/* Gün adları */}
      <div style={{ overflowX: isSmallScreen ? "auto" : "visible" }}>
        <div
          style={{
            minWidth: isSmallScreen ? "420px" : undefined,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
            textAlign: "center",
            fontSize: isSmallScreen ? 11 : 12,
            marginBottom: 6,
            fontWeight: 600,
            color: "#4b5563",
          }}
        >
          {weekdayLabels.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      </div>

      {/* Takvim günleri */}
      <div style={{ overflowX: isSmallScreen ? "auto" : "visible" }}>
        <div
          style={{
            minWidth: isSmallScreen ? "420px" : undefined,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
          }}
        >
          {/* Boş hücreler */}
          {[...Array((firstDay + 6) % 7)].map((_, i) => (
            <div key={"empty-" + i} />
          ))}

          {/* Günler */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
            (day) => {
              const bg = getColorForDay(day);
              const title = getTitleForDay(day);
              const isSelected = selectedDay === day;
              const items = getItemsForDay(day);

              const maxBadges = isSmallScreen ? 2 : 3;
              const visibleItems = items.slice(0, maxBadges);
              const remainingCount = items.length - visibleItems.length;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  title={title}
                  style={{
                    padding: isSmallScreen ? "4px 2px" : "6px 3px",
                    borderRadius: 6,
                    backgroundColor: bg,
                    cursor: "pointer",
                    fontSize: isSmallScreen ? 11 : 13,
                    fontWeight: 600,
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : "1px solid #d1d5db",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: isSmallScreen ? 48 : 56,
                    boxSizing: "border-box",
                  }}
                >
                  {/* Gün numarası */}
                  <div>{day}</div>

                  {/* Ürün etiketleri */}
                  {visibleItems.length > 0 && (
                    <div
                      style={{
                        marginTop: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      {visibleItems.map((p) => {
                        const color = getCategoryColor(p.category);
                        return (
                          <span
                            key={p.id}
                            style={{
                              maxWidth: 60,
                              padding: "0 3px",
                              borderRadius: 999,
                              border: `1px solid ${color}`,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              fontSize: isSmallScreen ? 8 : 9,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                            {p.quantity > 1 ? `(${p.quantity})` : ""}
                          </span>
                        );
                      })}

                      {remainingCount > 0 && (
                        <span
                          style={{
                            padding: "0 3px",
                            borderRadius: 999,
                            border: "1px dashed #6b7280",
                            backgroundColor: "rgba(255,255,255,0.7)",
                            fontSize: isSmallScreen ? 8 : 9,
                          }}
                        >
                          +{remainingCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* GÜN DETAYLARI */}
      {selectedDay !== null && (
        <div
          style={{
            marginTop: 12,
            padding: isSmallScreen ? 10 : 12,
            borderRadius: 8,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 8,
              fontSize: isSmallScreen ? 14 : 15,
            }}
          >
            {selectedDay}{" "}
            {baseDate.toLocaleString("tr-TR", { month: "long" })} SKT&apos;li
            ürünler
          </h3>

          {getItemsForDay(selectedDay).length === 0 && (
            <p style={{ margin: 0, fontSize: isSmallScreen ? 12 : 13 }}>
              Bu gün için SKT&apos;li ürün yok.
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {getItemsForDay(selectedDay).map((p) => {
              const categoryColor = getCategoryColor(p.category);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onEditProduct?.(p)}
                  style={{
                    margin: 0,
                    padding: "6px 8px",
                    textAlign: "left",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                    cursor: onEditProduct ? "pointer" : "default",
                    fontSize: isSmallScreen ? 12 : 13,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: `inset 3px 0 0 0 ${categoryColor}`,
                  }}
                >
                  <span>{p.name}</span>
                  <strong>{p.quantity} adet</strong>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCloseDetails}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
              fontSize: isSmallScreen ? 11 : 12,
            }}
          >
            Kapat
          </button>
        </div>
      )}
    </section>
  );
}

export default CalendarView;
