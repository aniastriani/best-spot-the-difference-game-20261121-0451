// Pointer and keyboard input for the two panels.
//
// A click is tested against the round's differences in panel coordinates:
// the canvas is drawn at its own pixel size, so a click's offset inside
// the canvas is already a panel coordinate. A hit marks the difference
// found on both panels at once.

export function attachPanelClicks(leftCanvas, rightCanvas, onPick) {
  const pick = (canvas) => (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    onPick(x, y);
  };
  leftCanvas.addEventListener('click', pick(leftCanvas));
  rightCanvas.addEventListener('click', pick(rightCanvas));
}

// The nearest unfound difference within its radius, or null.
export function hitTest(differences, found, x, y) {
  let best = null;
  let bestD = Infinity;
  for (const d of differences) {
    if (found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}
