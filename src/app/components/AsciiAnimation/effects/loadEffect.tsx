export type EffectConfig = {
  width?: number;
  height?: number;
  block?: number;
  back?: string;
  speed?: number;
};

export function loadEffect(ctx: CanvasRenderingContext2D, frame: number, config?: EffectConfig) {
  const width = config?.width ?? 400;
  const height = config?.height ?? 480;
  const block = config?.block ?? 20;
  const back = config?.back ?? '#1B1B1B';
  const speed = config?.speed ?? 0.5;

  const maxBlocksPerColumn = 16;
  const minBlocksPerColumn = 10;
  const minRam = 4;
  const minGap = 5;
  const blocksPerColumnDelta = 6;
  const ramDelta = 4;
  const updateInterval = 1;

  const cols = Math.floor(width / block);
  const rows = Math.floor(height / block);

  const map = {
    '0': { char: 'h', text: '#ffffff', bg: '#999999' },
    '1': { char: '0', text: '#ffffff', bg: '#1B1B1B' },
    '2': { char: '6', text: '#ffffff', bg: '#1B1B1B' },
    '3': { char: 'h', text: '#ffffff', bg: 'transparent' },
  };

  // --- локальные истории ---
  const historyKey = `history_${ctx.canvas.id || 'default'}`;
  let cpuHistory: number[] = (ctx as any)[`${historyKey}_cpu`] || [];
  let ramHistory: number[] = (ctx as any)[`${historyKey}_ram`] || [];
  let totalHistory: number[] = (ctx as any)[`${historyKey}_total`] || [];
  let lastUpdateTime: number = (ctx as any)[`${historyKey}_lastUpdateTime`] || 0;

  const t = frame * speed;

  if (t - lastUpdateTime > updateInterval) {
    lastUpdateTime = t;

    const lastTotal = totalHistory.length
      ? totalHistory[totalHistory.length - 1]
      : Math.floor((maxBlocksPerColumn + minBlocksPerColumn) / 2);
    const lastRam = ramHistory.length ? ramHistory[ramHistory.length - 1] : minRam;

    // --- Общая высота колонки (плавно) ---
    const targetTotal = Math.max(
      minBlocksPerColumn,
      Math.min(maxBlocksPerColumn, lastTotal + (Math.random() - 0.5) * blocksPerColumnDelta * 2)
    );
    const smoothingFactor = 0.5;
    let newTotal = lastTotal + (targetTotal - lastTotal) * smoothingFactor;
    newTotal = Math.round(Math.max(minBlocksPerColumn, Math.min(maxBlocksPerColumn, newTotal)));
    totalHistory.push(newTotal);
    if (totalHistory.length > cols) totalHistory.shift();

    // --- RAM (плавно) ---
    const targetRam = Math.max(
      minRam,
      Math.min(newTotal - minGap, lastRam + (Math.random() - 0.5) * ramDelta * 2)
    );
    const newRam = Math.round(lastRam + (targetRam - lastRam) * smoothingFactor);
    ramHistory.push(newRam);
    if (ramHistory.length > cols) ramHistory.shift();

    // --- CPU ---
    const newCpu = Math.max(minGap, newTotal - newRam);
    cpuHistory.push(newCpu);
    if (cpuHistory.length > cols) cpuHistory.shift();
  }

  // --- сохраняем локально ---
  (ctx as any)[`${historyKey}_cpu`] = cpuHistory;
  (ctx as any)[`${historyKey}_ram`] = ramHistory;
  (ctx as any)[`${historyKey}_total`] = totalHistory;
  (ctx as any)[`${historyKey}_lastUpdateTime`] = lastUpdateTime;

  // --- рисуем ---
  ctx.fillStyle = back;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < totalHistory.length; i++) {
    const ramBlocks = ramHistory[i] || minRam;
    const cpuBlocks = cpuHistory[i] || minGap;
    const x = i * block + block / 2;

    // RAM
    for (let r = rows - ramBlocks; r < rows; r++) {
      const y = r * block + block / 2;
      const cell = map['0'];
      if (!cell) continue;
      if (cell.bg !== 'transparent') ctx.fillStyle = cell.bg;
      ctx.fillRect(i * block, r * block, block, block);
      ctx.fillStyle = cell.text;
      ctx.fillText(cell.char, x, y);
    }

    // CPU
    for (let r = rows - cpuBlocks - ramBlocks; r < rows - ramBlocks; r++) {
      const y = r * block + block / 2;
      const cell = map['2'];
      if (!cell) continue;
      if (cell.bg !== 'transparent') ctx.fillStyle = cell.bg;
      ctx.fillRect(i * block, r * block, block, block);
      ctx.fillStyle = cell.text;
      ctx.fillText(cell.char, x, y);
    }
  }
}
