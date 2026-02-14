# Barkod Oluşturucu (QR + Code128)

Tarayıcıda çalışan, **kurulumsuz** barkod üretici: **QR** ve **Code128** oluşturur.  
✅ **Renk seçimi** (çizgi/arka plan) · ✅ **QR ortasına logo ekleme** · ✅ **PNG indir**

---

## Özellikler

- **QR** ve **Code128** üretimi
- **Renk seçimi**: Çizgi rengi + arkaplan
- **QR logo**: Ortaya logo basma (boyut ayarlı, opsiyonel “zemin/padding”)
- **Animasyonlu, modern arayüz**
- **Offline çalışır** (kütüphaneler CDN’den gelir; istersen indirip lokal de kullanabilirsin)
- **PNG olarak indirme**
  - QR: canvas → PNG (logo + renk dahil)
  - Code128: SVG → canvas → PNG (renk dahil)

---

## Proje Yapısı

```
.
├─ index.html
├─ style.css
└─ app.js
```

---

## Çalıştırma

1. Dosyaları aynı klasöre koy:
   - `index.html`
   - `style.css`
   - `app.js`

2. `index.html` dosyasına çift tıkla (tarayıcıda açılır) ✅

> İstersen daha “düzgün” geliştirme için VS Code + Live Server eklentisiyle açabilirsin.

---

## Kullanım

1. **Metin/Link** gir
2. Tür seç:
   - **QR** (link / uzun metin için ideal)
   - **Code128** (kısa kodlar için ideal)
3. Renkleri seç:
   - Çizgi rengi (**fg**)
   - Arkaplan (**bg**)
4. (QR için) Logo yükle:
   - `Logo Boyutu` ile % ayarla
   - `Logo Arkaplanı` → “Beyaz zemin” (okunabilirlik için önerilir)
5. **Oluştur** → önizleme
6. **PNG İndir**

---

## İpuçları

- QR’a logo eklediğinde, QR okuyucuların daha iyi okuması için:
  - “Logo Arkaplanı”nı **Beyaz zemin** bırak
  - Çok büyük logo kullanma (genelde %18–%24 arası sweet spot)
- Code128 bazı karakterleri destekler; çok “özel” karakterlerde sorun çıkarsa farklı bir metin dene.

---

## Lokal Kütüphane (CDN yerine)

Projeyi tamamen offline yapmak istersen bu iki dosyayı indirip projeye ekleyebilirsin:
- `qrcode.min.js`
- `JsBarcode.all.min.js`

Sonra `index.html` içindeki CDN scriptlerini yerel dosyalara çevirmen yeterli.

---

## Lisans

Bu proje **MIT License** ile paylaşılabilir. İstersen `LICENSE` dosyası ekleyip GitHub’a koyabilirsin.

---
## Katkı

PR/issue açarak katkı yapabilirsin. ✨
