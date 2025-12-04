// src/api/products.ts
export type CreateProductPayload = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  skt: string; // son kullanma tarihi (ISO string)
};

// Şimdilik gerçek sunucuya gitmiyoruz, sadece log atıyoruz
export async function createProduct(payload: CreateProductPayload): Promise<void> {
  console.log("[Outbox] createProduct çağrıldı:", payload);
  // İleride burada gerçek API isteği gönderebiliriz
}
