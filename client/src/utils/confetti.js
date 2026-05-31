import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.5, y: 0.85 },
    colors: ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ec4899'],
    ticks: 200,
    gravity: 1.2,
    scalar: 0.9,
    shapes: ['circle', 'square'],
  });

  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.8 },
      colors: ['#6366f1', '#22c55e', '#f59e0b'],
      ticks: 150,
    });
  }, 50);

  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.8 },
      colors: ['#6366f1', '#22c55e', '#f59e0b'],
      ticks: 150,
    });
  }, 100);
}

export function fireSmallConfetti() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { x: 0.5, y: 0.7 },
    colors: ['#6366f1', '#22c55e'],
    ticks: 120,
    scalar: 0.7,
  });
}
