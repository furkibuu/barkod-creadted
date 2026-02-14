const $ = (sel) => document.querySelector(sel);
const elText = $("#text");
const elType = $("#type");
const elSize = $("#size");
const elThickness = $("#thickness");
const elHeight = $("#height");
const elFg = $("#fg");
const elBg = $("#bgc");
const fgHex = $("#fgHex");
const bgHex = $("#bgHex");
const elLogoFile = $("#logoFile");
const elLogoEnable = $("#logoEnable");
const elLogoSize = $("#logoSize");
const elLogoPad = $("#logoPad");
const elLogoRemoveBtn = $("#logoRemoveBtn");
const logoSizeVal = $("#logoSizeVal");
const sizeVal = $("#sizeVal");
const thickVal = $("#thickVal");
const heightVal = $("#heightVal");
const genBtn = $("#genBtn");
const downloadBtn = $("#downloadBtn");
const clearBtn = $("#clearBtn");
const copyBtn = $("#copyBtn");
const randomBtn = $("#randomBtn");
const qrCanvas = $("#qrCanvas");
const barcodeSvg = $("#barcodeSvg");
const placeholder = $("#placeholder");
const outBox = $("#outBox");
const statusChip = $("#statusChip");
const hintChip = $("#hintChip");
const metaType = $("#metaType");
const metaSize = $("#metaSize");
const metaState = $("#metaState");
let lastRendered = { kind: null, text: "" };
let logoImg = null; 

function setStatus(text, mode = "normal") {
  statusChip.textContent = text;
  statusChip.style.borderColor =
    mode === "ok" ? "rgba(43,228,167,.45)" :
    mode === "warn" ? "rgba(255,204,102,.45)" :
    "rgba(255,255,255,.12)";

  statusChip.style.background =
    mode === "ok" ? "rgba(43,228,167,.10)" :
    mode === "warn" ? "rgba(255,204,102,.10)" :
    "rgba(255,255,255,.05)";
}

function syncRanges() {
  sizeVal.textContent = `${elSize.value}px`;
  thickVal.textContent = `${elThickness.value}`;
  heightVal.textContent = `${elHeight.value}`;
  logoSizeVal.textContent = `${elLogoSize.value}%`;
}
syncRanges();

["input", "change"].forEach(evt => {
  elSize.addEventListener(evt, syncRanges);
  elThickness.addEventListener(evt, syncRanges);
  elHeight.addEventListener(evt, syncRanges);
  elLogoSize.addEventListener(evt, syncRanges);
});

function syncColors() {
  fgHex.textContent = elFg.value.toLowerCase();
  bgHex.textContent = elBg.value.toLowerCase();
}
syncColors();
elFg.addEventListener("input", syncColors);
elBg.addEventListener("input", syncColors);

elText.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });

clearBtn.addEventListener("click", () => {
  elText.value = "";
  elText.focus();
  softResetPreview();
  setStatus("Hazır", "normal");
  hintChip.textContent = "Metin gir → Oluştur";
});

copyBtn.addEventListener("click", async () => {
  const t = elText.value.trim();
  if (!t) return setStatus("Kopyalanacak metin yok", "warn");
  try { await navigator.clipboard.writeText(t); setStatus("Kopyalandı ✅", "ok"); }
  catch { setStatus("Kopyalama engellendi", "warn"); }
});

randomBtn.addEventListener("click", () => {
  const samples = [
    "https://furki.dev",
    "https://x.com/furkibu_",
    "https://github.com/furkibuu",
    "discord.gg/aikodevelopment",
   
  ];
  elText.value = samples[Math.floor(Math.random() * samples.length)];
  hintChip.textContent = "Hazırsın → Oluştur";
  elText.focus();
});

elType.addEventListener("change", () => {
  hintChip.textContent = elType.value === "qr"
    ? "QR: link/uzun metin için ideal (logo destekli)"
    : "Code128: kısa kodlar için ideal";
});

genBtn.addEventListener("click", generate);
downloadBtn.addEventListener("click", downloadPng);

elLogoFile.addEventListener("change", handleLogoFile);
elLogoRemoveBtn.addEventListener("click", () => {
  logoImg = null;
  elLogoFile.value = "";
  setStatus("Logo kaldırıldı", "ok");
});

function handleLogoFile() {
  const file = elLogoFile.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      logoImg = img;
      setStatus("Logo yüklendi ✅", "ok");
    };
    img.onerror = () => setStatus("Logo okunamadı", "warn");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function softResetPreview() {
  outBox.style.display = "none";
  placeholder.style.display = "flex";
  qrCanvas.style.display = "none";
  barcodeSvg.style.display = "none";

  metaType.textContent = "-";
  metaSize.textContent = "-";
  metaState.textContent = "-";
  lastRendered = { kind: null, text: "" };
}

function showOutput(kind, size) {
  placeholder.style.display = "none";
  outBox.style.display = "grid";
  metaType.textContent = kind.toUpperCase();
  metaSize.textContent = `${size}px`;
}

async function generate() {
  const text = elText.value.trim();
  const kind = elType.value;

  const size = Number(elSize.value);
  const thickness = Number(elThickness.value);
  const height = Number(elHeight.value);

  const fg = elFg.value;
  const bg = elBg.value;

  if (!text) {
    setStatus("Metin boş", "warn");
    hintChip.textContent = "Bir şey yaz 🫡";
    softResetPreview();
    return;
  }

  setStatus("Üretiliyor…", "normal");
  metaState.textContent = "Üretiliyor…";
  qrCanvas.getContext("2d").clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  barcodeSvg.innerHTML = "";

  try {
    if (kind === "qr") {
      qrCanvas.style.display = "block";
      barcodeSvg.style.display = "none";

      await QRCode.toCanvas(qrCanvas, text, {
        width: size,
        margin: 1,
        color: { dark: fg, light: bg }
      });
      if (elLogoEnable.checked && logoImg) {
        drawLogoOnQr(qrCanvas, logoImg, Number(elLogoSize.value), elLogoPad.value === "on", bg);
      }

      outBox.style.background = bg;

      showOutput("QR", size);
      metaState.textContent = "Hazır";
      setStatus("Hazır ✅", "ok");
    } else {
      qrCanvas.style.display = "none";
      barcodeSvg.style.display = "block";

      JsBarcode(barcodeSvg, text, {
        format: "CODE128",
        width: thickness,
        height: height,
        margin: 10,
        displayValue: true,
        fontSize: 16,
        lineColor: fg,
        background: bg
      });

      outBox.style.background = bg;

      showOutput("CODE128", size);
      metaState.textContent = "Hazır";
      setStatus("Hazır ✅", "ok");
    }

    lastRendered = { kind, text };
  } catch (err) {
    console.error(err);
    setStatus("Hata oluştu", "warn");
    metaState.textContent = "Hata";
  }
}


function drawLogoOnQr(canvas, img, logoPercent, pad, bgColor) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const logoSize = Math.floor((W * logoPercent) / 100);
  const x = Math.floor((W - logoSize) / 2);
  const y = Math.floor((H - logoSize) / 2);

  if (pad) {
    const padSize = Math.floor(logoSize * 1.18);
    const px = Math.floor((W - padSize) / 2);
    const py = Math.floor((H - padSize) / 2);
    const radius = Math.floor(padSize * 0.18);

    ctx.save();
    ctx.fillStyle = bgColor;
    roundRect(ctx, px, py, padSize, padSize, radius);
    ctx.fill();
    ctx.restore();
  }


  ctx.save();
  ctx.imageSmoothingEnabled = true;

  const iw = img.width;
  const ih = img.height;
  const scale = Math.min(logoSize / iw, logoSize / ih);
  const dw = Math.floor(iw * scale);
  const dh = Math.floor(ih * scale);
  const dx = Math.floor((W - dw) / 2);
  const dy = Math.floor((H - dh) / 2);

  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

async function downloadPng() {
  const { kind, text } = lastRendered;
  if (!kind || !text) {
    setStatus("Önce oluştur", "warn");
    return;
  }

  setStatus("PNG hazırlanıyor…", "normal");

  try {
    let dataUrl;

    if (kind === "qr") {
     
      dataUrl = qrCanvas.toDataURL("image/png");
    } else {
      
      dataUrl = await svgToPngDataUrl(barcodeSvg, 2, elBg.value);
    }

    const a = document.createElement("a");
    a.download = `barcode_${kind}_${Date.now()}.png`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setStatus("İndirildi ✅", "ok");
  } catch (e) {
    console.error(e);
    setStatus("İndirme hatası", "warn");
  }
}

function svgToPngDataUrl(svgEl, scale = 2, bgColor = "#ffffff") {
  return new Promise((resolve, reject) => {
    const svg = svgEl.cloneNode(true);

    const bbox = svgEl.getBBox();
    const width = Math.ceil(bbox.width + 20);
    const height = Math.ceil(bbox.height + 20);

    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.drawImage(img, 10, 10);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
