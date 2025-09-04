import React, { useEffect, useMemo, useState } from "react";

const PRESETS = [
  { key: "business-card", label: "Business Card", w: 3.5, h: 2 },
  { key: "postcard-4x6", label: "Postcard 4×6", w: 6, h: 4 },
  { key: "postcard-5x7", label: "Postcard 5×7", w: 7, h: 5 },
  { key: "postcard-5.5x8.5", label: "Postcard 5.5×8.5", w: 8.5, h: 5.5 },
  { key: "rack-card", label: "Rack Card 3.67×8.5", w: 3.67, h: 8.5 },
  { key: "flyer-letter", label: "Flyer 8.5×11", w: 8.5, h: 11 },
  { key: "tabloid-poster", label: "Poster 11×17", w: 11, h: 17 },
  { key: "square-5", label: "Square 5×5", w: 5, h: 5 },
  { key: "env-10", label: "#10 Envelope", w: 9.5, h: 4.125 },
  { key: "ncr-letter", label: "NCR Set (Letter)", w: 8.5, h: 11 },
];

const PRICING = {
  "business-card": {
    50: { U: 22.0, T: 31.0, G: 41.0, SF: 48.67 },
    100: { U: 43.0, T: 61.0, G: 82.0, SF: 95.77 },
    200: { U: 74.0, T: 105.0, G: 141.0, SF: 164.85 },
    400: { U: 129.0, T: 185.0, G: 235.0, SF: 290.45 },
    600: { U: 163.0, T: 229.0, G: 328.0, SF: 359.53 },
    800: { U: 217.0, T: 305.0, G: 376.0, SF: 478.85 },
    1000: { U: 250.0, T: 343.0, G: 410.0, SF: 538.51 },
    1200: { U: 300.0, T: 411.0, G: 492.0, SF: 645.27 },
    1600: { U: 400.0, T: 546.0, G: 656.0, SF: 857.22 },
    2000: { U: 500.0, T: 682.0, G: 820.0, SF: 1070.74 },
    3000: { U: 750.0, T: 1023.0, G: 1230.0, SF: 1606.11 },
    4000: { U: 1000.0, T: 1364.0, G: 1640.0, SF: 2141.48 },
    5000: { U: 1250.0, T: 1704.0, G: 2050.0, SF: 2675.28 },
    6000: { U: 1500.0, T: 2045.0, G: 2460.0, SF: 3210.65 },
    8000: { U: 2000.0, T: 2726.0, G: 3280.0, SF: 4279.82 },
  },
  "postcard-4x6": {
    25: { U: 23.0, T: 31.0, G: 56.0, SF: 62.0 },
    50: { U: 39.0, T: 58.0, G: 104.0, SF: 115.0 },
    100: { U: 58.0, T: 79.0, G: 173.0, SF: 191.0 },
    250: { U: 95.0, T: 142.0, G: 256.0, SF: 283.0 },
    500: { U: 142.0, T: 204.0, G: 382.0, SF: 418.0 },
    1000: { U: 181.0, T: 262.0, G: 512.0, SF: 575.0 },
    2500: { U: 367.0, T: 534.0, G: 931.0, SF: 1035.0 },
    5000: { U: 617.0, T: 766.0, G: 1708.0, SF: 1915.0 },
    10000: { U: 1098.0, T: 1393.0, G: 2897.0, SF: 3778.0 },
  },
  "postcard-5x7": {
    25: { U: 26.0, T: 38.0, G: 62.0, SF: 69.0 },
    50: { U: 46.0, T: 69.0, G: 115.0, SF: 126.0 },
    100: { U: 76.0, T: 115.0, G: 198.0, SF: 220.0 },
    250: { U: 125.0, T: 188.0, G: 334.0, SF: 366.0 },
    500: { U: 208.0, T: 313.0, G: 553.0, SF: 607.0 },
    1000: { U: 272.0, T: 394.0, G: 825.0, SF: 910.0 },
    2500: { U: 543.0, T: 828.0, G: 1548.0, SF: 1702.0 },
    5000: { U: 812.0, T: 1178.0, G: 2417.0, SF: 2660.0 },
    10000: { U: 1551.0, T: 2195.0, G: 4036.0, SF: 4438.0 },
  },
  "postcard-5.5x8.5": {
    25: { U: 34.0, T: 51.0, G: 82.0, SF: 91.0 },
    50: { U: 58.0, T: 90.0, G: 153.0, SF: 168.0 },
    100: { U: 100.0, T: 152.0, G: 267.0, SF: 293.0 },
    250: { U: 167.0, T: 250.0, G: 449.0, SF: 494.0 },
    500: { U: 282.0, T: 417.0, G: 731.0, SF: 805.0 },
    1000: { U: 344.0, T: 522.0, G: 1103.0, SF: 1213.0 },
    2500: { U: 724.0, T: 1086.0, G: 2069.0, SF: 2277.0 },
    5000: { U: 1035.0, T: 1475.0, G: 3235.0, SF: 3561.0 },
    10000: { U: 1920.0, T: 2747.0, G: 5439.0, SF: 5983.0 },
  },
  "rack-card": {
    25: { U: 25.0, T: 36.0, G: 60.0, SF: 67.0 },
    50: { U: 45.0, T: 66.0, G: 111.0, SF: 122.0 },
    100: { U: 68.0, T: 110.0, G: 194.0, SF: 215.0 },
    250: { U: 121.0, T: 177.0, G: 319.0, SF: 352.0 },
    500: { U: 194.0, T: 298.0, G: 518.0, SF: 569.0 },
    1000: { U: 246.0, T: 361.0, G: 789.0, SF: 868.0 },
    2500: { U: 513.0, T: 772.0, G: 1496.0, SF: 1645.0 },
    5000: { U: 725.0, T: 1035.0, G: 2334.0, SF: 2567.0 },
    10000: { U: 1289.0, T: 1910.0, G: 3897.0, SF: 4296.0 },
  },
  "flyer-8.5x11": {
    50: { U: 49.0, T: 49.0, G: 79.0 },
    100: { U: 89.0, T: 89.0, G: 129.0 },
    250: { U: 149.0, T: 149.0, G: 229.0 },
    500: { U: 199.0, T: 199.0, G: 299.0 },
    1000: { U: 295.0, T: 295.0, G: 469.0 },
    2500: { U: 579.0, T: 579.0, G: 1050.0 },
    5000: { U: 1149.0, T: 1149.0, G: 2100.0 },
    10000: { U: 2299.0, T: 2299.0, G: 4200.0 },
  },
  "flyer-11x17": {
    25: { U: 63.0, T: 75.75, G: 91.0, SF: 91.0 },
    50: { U: 98.5, T: 118.0, G: 141.5, SF: 141.5 },
    100: { U: 160.0, T: 191.0, G: 229.0, SF: 229.0 },
    250: { U: 245.0, T: 292.5, G: 352.5, SF: 352.5 },
    500: { U: 320.0, T: 385.0, G: 460.0, SF: 460.0 },
    750: { U: 345.0, T: 412.5, G: 495.0, SF: 495.0 },
    1000: { U: 390.0, T: 470.0, G: 560.0, SF: 560.0 },
  },
  "notepad-4x6": {
    50: { U: 250.0, T: 350.0 },
    100: { U: 450.0, T: 650.0 },
    250: { U: 1000.0, T: 1500.0 },
    500: { U: 1875.0, T: 2750.0 },
  },
  "notepad-5x7": {
    50: { U: 325.0, T: 400.0 },
    100: { U: 600.0, T: 750.0 },
    250: { U: 1375.0, T: 1750.0 },
    500: { U: 2500.0, T: 3250.0 },
  },
};

function pricingKeyForPreset(presetKey) {
  if (!presetKey) return null;
  switch (presetKey) {
    case "business-card":
    case "postcard-4x6":
    case "postcard-5x7":
    case "postcard-5.5x8.5":
    case "rack-card":
      return presetKey;
    case "flyer-letter":
      return "flyer-8.5x11";
    case "tabloid-poster":
      return "flyer-11x17";
    default:
      return null;
  }
}

function nearestPricedPreset(w, h) {
  let best = null;
  for (const p of PRESETS) {
    const pk = pricingKeyForPreset(p.key);
    if (!pk) continue;
    const d1 = Math.abs(w - p.w) + Math.abs(h - p.h);
    const d2 = Math.abs(w - p.h) + Math.abs(h - p.w);
    const dist = Math.min(d1, d2);
    if (!best || dist < best.dist) best = { preset: p, pk, dist };
  }
  return best ? { preset: best.preset, pk: best.pk } : null;
}

function fmt(v) {
  return parseFloat(Number(v).toFixed(3)).toString();
}

function fmtUSD(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

export default function PrintSpecsForm() {
  const roundingIncrement = 1 / 16;
  const [wIn, setWIn] = useState(3.5);
  const [hIn, setHIn] = useState(2);
  const [selectedPreset, setSelectedPreset] = useState("business-card");

  const stockOptions = [
    { key: "uncoated", label: "Uncoated", col: "U" },
    { key: "thick", label: "Thick", col: "T" },
    { key: "gloss", label: "Gloss", col: "G" },
  ];
  const colorOptions = [
    { key: "none", label: "None (0)", code: 0 },
    { key: "cmyk", label: "CMYK (4)", code: 4 },
    { key: "black", label: "Black (1)", code: 1 },
  ];
  const codeOf = (k) => colorOptions.find((o) => o.key === k).code;

  const [stock, setStock] = useState(stockOptions[0].key);
  const [sideAKey, setSideAKey] = useState("cmyk");
  const [sideBKey, setSideBKey] = useState("none");
  const [qty, setQty] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedPreset) return;
    const p = PRESETS.find((x) => x.key === selectedPreset);
    if (p) {
      setWIn(p.w);
      setHIn(p.h);
    }
  }, [selectedPreset]);

  useEffect(() => {
    const match = PRESETS.find((p) => {
      return (
        (Math.abs(p.w - wIn) < 1e-6 && Math.abs(p.h - hIn) < 1e-6) ||
        (Math.abs(p.w - hIn) < 1e-6 && Math.abs(p.h - wIn) < 1e-6)
      );
    });
    setSelectedPreset(match ? match.key : null);
  }, [wIn, hIn]);

  const pricingBasis = useMemo(() => {
    const exactPk = pricingKeyForPreset(selectedPreset);
    if (exactPk) {
      const preset = PRESETS.find((p) => p.key === selectedPreset) || null;
      return { pk: exactPk, preset, approximated: false };
    }
    const near = nearestPricedPreset(wIn, hIn);
    if (near) return { pk: near.pk, preset: near.preset, approximated: true };
    return { pk: null, preset: null, approximated: true };
  }, [selectedPreset, wIn, hIn]);

  const activePricingKey = pricingBasis.pk;
  const qtyOptions = useMemo(() => {
    if (!activePricingKey) return [];
    return Object.keys(PRICING[activePricingKey])
      .map((k) => parseInt(k, 10))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);
  }, [activePricingKey]);

  useEffect(() => {
    if (!activePricingKey) {
      setQty(null);
      return;
    }
    if (qty === null || !qtyOptions.includes(qty)) setQty(qtyOptions[0] ?? null);
  }, [activePricingKey, qtyOptions]);

  function getPrice(pk, stockKey, quantity) {
    if (!pk || quantity == null) return null;
    const row = PRICING[pk]?.[quantity];
    if (!row) return null;
    const col = stockOptions.find((s) => s.key === stockKey)?.col;
    if (!col) return null;
    const val = row[col];
    return typeof val === "number" ? val : null;
  }

  function computeTotalPrice(pk, stockKey, quantity, a, b) {
    const base = getPrice(pk, stockKey, quantity);
    if (base == null) return null;
    const surcharge = (a === "cmyk" ? 5 : 0) + (b === "cmyk" ? 5 : 0);
    return base + surcharge;
  }

  const price = computeTotalPrice(activePricingKey, stock, qty, sideAKey, sideBKey);
  const colorsSpec = `${codeOf(sideAKey)}/${codeOf(sideBKey)}`;
  const orientation = wIn >= hIn ? "Landscape" : "Portrait";

  const specLines = [];
  specLines.push(`Trim: ${fmt(wIn)}" × ${fmt(hIn)}"`);
  specLines.push(`Orientation: ${orientation}`);
  specLines.push(`Stock: ${stockOptions.find((s) => s.key === stock)?.label ?? ""}`);
  specLines.push(`Colors: ${colorsSpec}`);
  if (pricingBasis.approximated && pricingBasis.preset) {
    specLines.push(
      `Pricing based on: ${pricingBasis.preset.label} ${pricingBasis.preset.w}″ × ${pricingBasis.preset.h}″`
    );
  }
  if (qty != null) specLines.push(`Quantity: ${qty}`);
  specLines.push(`Price: ${price != null ? fmtUSD(price) : "N/A"}`);

  function copySpecs() {
    const text = specLines.join("\n");
    const tryAsync = async () => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    };
    const tryFallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
      return ok;
    };
    (async () => {
      const ok = (navigator?.clipboard && (await tryAsync())) || tryFallback();
      if (ok) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }
    })();
  }

  function setNumber(setter) {
    return (e) => {
      const v = parseFloat(e.target.value || "0");
      const r = Math.round(v / roundingIncrement) * roundingIncrement;
      setter(Math.max(0.01, r));
    };
  }

  return (
    <div className="w-full h-full p-4 bg-zinc-950 text-zinc-100">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200">Common sizes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPreset(p.key)}
                className={`rounded-lg border px-3 py-2 text-left hover:bg-zinc-800 ${
                  selectedPreset === p.key ? "border-emerald-500" : "border-zinc-700"
                }`}
                title={`${p.label} ${p.w}\" × ${p.h}\"`}
              >
                <div className="text-sm text-zinc-100">{p.label}</div>
                <div className="text-xs text-zinc-400">{p.w}" × {p.h}"</div>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-zinc-200">Custom size (inches)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              W
              <input
                type="number"
                step={roundingIncrement}
                min={0}
                value={wIn}
                onChange={(e) => {
                  setSelectedPreset(null);
                  setNumber(setWIn)(e);
                }}
                className="w-24 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-right"
              />
            </label>
            <span>×</span>
            <label className="inline-flex items-center gap-2 text-sm">
              H
              <input
                type="number"
                step={roundingIncrement}
                min={0}
                value={hIn}
                onChange={(e) => {
                  setSelectedPreset(null);
                  setNumber(setHIn)(e);
                }}
                className="w-24 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-right"
              />
            </label>
          </div>

          <h3 className="text-sm font-semibold text-zinc-200">Print options</h3>
          <div className="grid grid-cols-1 text-sm divide-y divide-zinc-700">
            <label className="flex w-full items-center justify-between gap-2 py-2">
              <span className="text-zinc-300">Paper</span>
              <select
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-44 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1"
              >
                {stockOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex w-full items-center justify-between gap-2 py-2">
              <span className="text-zinc-300">Side A color</span>
              <select
                value={sideAKey}
                onChange={(e) => setSideAKey(e.target.value)}
                className="w-44 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1"
              >
                {colorOptions.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex w-full items-center justify-between gap-2 py-2">
              <span className="text-zinc-300">Side B color</span>
              <select
                value={sideBKey}
                onChange={(e) => setSideBKey(e.target.value)}
                className="w-44 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1"
              >
                {colorOptions.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex w-full items-center justify-between gap-2 py-2">
              <span className="text-zinc-300">Quantity</span>
              <select
                value={qty ?? ""}
                onChange={(e) => setQty(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-44 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1"
                disabled={!activePricingKey || qtyOptions.length === 0}
              >
                {!activePricingKey || qtyOptions.length === 0 ? (
                  <option value="">—</option>
                ) : (
                  qtyOptions.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))
                )}
              </select>
            </label>
            {pricingBasis.approximated && pricingBasis.preset && (
              <p className="text-xs text-amber-400/90">Pricing approximated to nearest standard size.</p>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">Specifications</h3>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-3 text-xs text-zinc-300 space-y-1">
            {specLines.map((line, i) => {
              const isQty = line.startsWith("Quantity:");
              const isPrice = line.startsWith("Price:");
              const cls = isPrice
                ? "text-2xl font-bold text-zinc-100 tracking-tight"
                : isQty
                ? "text-lg font-semibold text-zinc-200"
                : "";
              return (
                <div key={i} className={cls}>
                  {line}
                </div>
              );
            })}
          </div>
          <button
            onClick={copySpecs}
            className="rounded-md border border-emerald-600 px-3 py-1 text-sm hover:bg-emerald-600/10 text-emerald-400"
            title="Copy specs to clipboard"
          >
            {copied ? "Copied" : "Copy specs"}
          </button>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Price includes +$5 per CMYK side when selected. If size is off-standard, pricing is approximated by the nearest preset.
          </p>
        </aside>
      </div>
    </div>
  );
}
