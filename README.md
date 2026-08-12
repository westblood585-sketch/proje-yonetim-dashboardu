# 🗺️ Proje Yönetim Dashboard'u (ATLAS — Proje Atlası)

<div align="center">

  ![ATLAS Banner](https://img.shields.io/badge/ATLAS-5EC8E8?style=for-the-badge&logo=blueprint&logoColor=black)
  
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  <p align="center">
    Mühendislik paftası ve teknik çizim hassasiyetiyle tasarlanmış; ilişkisel veri modeli, Gantt benzeri zaman çizelgesi, pusula ilerleme göstergesi ve canlı mimari pafta bloğu sunan gelişmiş proje takip dashboard'u.
  </p>

  <!-- Ekran Çıktıları -->
  <div align="center">
    <img src="resim1.png" alt="ATLAS Genel Bakış ve Pusula Göstergesi" width="100%" style="max-width: 650px; border-radius: 16px; margin-bottom: 12px;">
    <br>
    <img src="resim2.png" alt="ATLAS Bölgeler ve Görev Yönetimi" width="100%" style="max-width: 650px; border-radius: 16px; margin-bottom: 12px;">
    <br>
    <img src="resim3.png" alt="ATLAS Gantt Zaman Çizelgesi" width="100%" style="max-width: 650px; border-radius: 16px; margin-bottom: 12px;">
    <br>
    <img src="resim4.png" alt="ATLAS Raporlar ve Donut Grafiği" width="100%" style="max-width: 650px; border-radius: 16px; margin-bottom: 12px;">
    <br>
    <img src="resim5.png" alt="ATLAS Negatif Baskı Teması ve Modallar" width="100%" style="max-width: 650px; border-radius: 16px; margin-bottom: 12px;">
    <br>
    <img src="resim6.png" alt="ATLAS Mobil Uyumluluk ve Detay Görünümü" width="100%" style="max-width: 650px; border-radius: 16px;">
  </div>

</div>

---

## 🌟 Öne Çıkan Özellikler

- **📐 Mimari Pafta Estetiği:** Teknik dökümantasyon konseptli grid arka planı, boyut çizgili (Dimension-line) ilerleme çubukları ve canlı Pafta No / Ölçek bilgilendirme bloğu (Title Block).
- **🔗 İlişkisel Veri Modeli:** Bölge (Proje) ve Görevler arasında bire-çok (1:N) ilişkisel ilişki yönetimi ve kaskad silme mimarisi.
- **📅 Gantt Zaman Çizelgesi:** Başlangıç ve bitiş tarihlerini dinamik yatay çubuklarla haritalandıran, bugünün çizgisini işaretleyen zaman çizgisi paneli.
- **📊 Saf SVG Raporlama:** Dış kütüphane kullanmadan tamamen elle çizdirilen 14 günlük eğilim çizgisi, donut durum grafiği ve pusula (Compass Gauge) göstergesi.
- **🖨️ Pozitif / Negatif Baskı Modu:** Klasik blueprint mavisi ve ters tonlu teknik pafta renk paletleri arasında geçiş imkanı.
- **🔍 Gelişmiş Arama ve Filtreleme:** Proje adı, görev metni ve proje durumuna göre anlık arama motoru.
- **⌨️ Hızlı Kısayollar:** `N` ile hızlı bölge oluşturma, `/` ile aramaya odaklanma ve `Esc` ile modalları kapatma.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için depoyu klonlayıp `index.html` dosyasını tarayıcınızda açmanız yeterlidir:

```bash
git clone [https://github.com/westblood585-sketch/proje-yonetim-dashboardu.git](https://github.com/westblood585-sketch/proje-yonetim-dashboardu.git)
cd proje-yonetim-dashboardu