// src/components/IntroPanel.tsx
function IntroPanel() {
  return (
    <section
      style={{
        marginBottom: 20,
        padding: 12,
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        backgroundColor: "#f9fafb",
        fontSize: 13,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 8,
          fontSize: 16,
        }}
      >
        Bu uygulama ne işe yarar?
      </h2>

      {/* Ücretsiz rozet satırı */}
      <p
        style={{
          margin: 0,
          marginBottom: 8,
          fontSize: 12,
          color: "#16a34a",
          fontWeight: 600,
        }}
      >
        ✅ Bu uygulama <strong>ücretsizdir</strong> ve kayıt gerektirmez.
      </p>

      <p
        style={{
          margin: 0,
          marginBottom: 8,
          lineHeight: 1.5,
        }}
      >
        Evdeki veya iş yerindeki gıda ürünlerinin{" "}
        <strong>son kullanma tarihlerini</strong> takip etmen için tasarlandı.
        Raf ömrü yaklaşan ürünleri, düşük stokları ve genel stok durumunu tek
        ekranda görmeni sağlar.
      </p>

      <ul
        style={{
          paddingLeft: 18,
          margin: 0,
          marginBottom: 8,
          lineHeight: 1.5,
        }}
      >
        <li>Ürün adını, kategorisini, adeti ve SKT&apos;yi ekle.</li>
        <li>
          Kritik (≤ 3 gün) ve süresi geçmiş ürünleri üstteki kutulardan ve
          listeden takip et.
        </li>
        <li>
          Minimum stok değeri girerek, adedi azalan ürünler için{" "}
          <strong>&quot;düşük stok&quot;</strong> uyarısı al.
        </li>
        <li>
          &quot;Gün Sonu Raporu (CSV)&quot; ile stok durumunu Excel&apos;e
          aktar.
        </li>
        <li>
          Bildirim izni verirsen, SKT&apos;si yaklaşan ürünler için masaüstü
          bildirimi al.
        </li>
      </ul>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        Şimdilik kişisel ve küçük işletme kullanımı için ideal. İleride, zincir
        marketler için çok şubeli profesyonel versiyona da dönüştürülebilir. 🚀
      </p>
    </section>
  );
}

export default IntroPanel;
