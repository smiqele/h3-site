import { config } from "../config";

export type EffectConfig = {
  width?: number;
  height?: number;
  block?: number;
  back?: string;
  speed?: number;
};

/**
 * Эффект "нагрузка CPU/RAM" в ASCII виде.
 * Использует сохранённую историю в контексте canvas.
 */
export function loadEffect(
  ctx: CanvasRenderingContext2D,
  frame: number,
  userConfig?: EffectConfig
) {
  const width = userConfig?.width ?? 400;
  const height = userConfig?.height ?? 400;
  const block = userConfig?.block ?? 24;
  const back = userConfig?.back ?? "#1B1B1B";
  const speed = userConfig?.speed ?? 0.5;

  const maxBlocksPerColumn = 16;
  const minBlocksPerColumn = 10;
  const minRam = 4;
  const minGap = 5;
  const blocksPerColumnDelta = 6;
  const ramDelta = 4;
  const updateInterval = 1;

  const cols = Math.floor(width / block);
  const rows = Math.floor(height / block);

  const map = config.map;

  // --- история по canvas ID ---
  const historyKey = `history_${ctx.canvas.id || "default"}`;
  const store = ctx as any;
  let cpuHistory: number[] = store[`${historyKey}_cpu`] || [];
  let ramHistory: number[] = store[`${historyKey}_ram`] || [];
  let totalHistory: number[] = store[`${historyKey}_total`] || [];
  let lastUpdateTime: number = store[`${historyKey}_lastUpdateTime`] || 0;

  const t = frame * speed;

  if (t - lastUpdateTime > updateInterval) {
    lastUpdateTime = t;

    const lastTotal = totalHistory.at(-1) ?? (maxBlocksPerColumn + minBlocksPerColumn) / 2;
    const lastRam = ramHistory.at(-1) ?? minRam;

    // --- Общая высота колонки (плавно) ---
    const targetTotal = Math.max(
      minBlocksPerColumn,
      Math.min(maxBlocksPerColumn, lastTotal + (Math.random() - 0.5) * blocksPerColumnDelta * 2)
    );
    const smoothing = 0.5;
    let newTotal = lastTotal + (targetTotal - lastTotal) * smoothing;
    newTotal = Math.round(Math.max(minBlocksPerColumn, Math.min(maxBlocksPerColumn, newTotal)));
    totalHistory.push(newTotal);
    if (totalHistory.length > cols) totalHistory.shift();

    // --- RAM (плавно) ---
    const targetRam = Math.max(
      minRam,
      Math.min(newTotal - minGap, lastRam + (Math.random() - 0.5) * ramDelta * 2)
    );
    const newRam = Math.round(lastRam + (targetRam - lastRam) * smoothing);
    ramHistory.push(newRam);
    if (ramHistory.length > cols) ramHistory.shift();

    // --- CPU ---
    const newCpu = Math.max(minGap, newTotal - newRam);
    cpuHistory.push(newCpu);
    if (cpuHistory.length > cols) cpuHistory.shift();
  }

  // --- сохраняем ---
  store[`${historyKey}_cpu`] = cpuHistory;
  store[`${historyKey}_ram`] = ramHistory;
  store[`${historyKey}_total`] = totalHistory;
  store[`${historyKey}_lastUpdateTime`] = lastUpdateTime;

  // --- рисуем фон ---
  ctx.fillStyle = back;
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${block * 0.8}px monospace`;

  // --- рисуем колонки ---
  for (let i = 0; i < totalHistory.length; i++) {
    const ramBlocks = ramHistory[i] ?? minRam;
    const cpuBlocks = cpuHistory[i] ?? minGap;
    const x = i * block + block / 2;

    // RAM
    const cellRam = map["0"];
    for (let r = rows - ramBlocks; r < rows; r++) {
      const y = r * block + block / 2;
      if (cellRam.bg !== "transparent") {
        ctx.fillStyle = cellRam.bg;
        ctx.fillRect(i * block, r * block, block, block);
      }
      ctx.fillStyle = cellRam.text;
      ctx.fillText(cellRam.char, x, y);
    }

    // CPU
    const cellCpu = map["2"];
    for (let r = rows - cpuBlocks - ramBlocks; r < rows - ramBlocks; r++) {
      const y = r * block + block / 2;
      if (cellCpu.bg !== "transparent") {
        ctx.fillStyle = cellCpu.bg;
        ctx.fillRect(i * block, r * block, block, block);
      }
      ctx.fillStyle = cellCpu.text;
      ctx.fillText(cellCpu.char, x, y);
    }
  }
}