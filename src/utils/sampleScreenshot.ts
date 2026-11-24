/**
 * Generates a realistic WhatsApp electricity-bill scam screenshot on an HTML5 canvas
 * so users can instantly test multimodal screenshot scanning without needing an external file.
 */
export function generateSampleScamScreenshotDataUrl(): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // WhatsApp chat wallpaper background
  ctx.fillStyle = '#ECE5DD';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle top status bar
  ctx.fillStyle = '#075E54';
  ctx.fillRect(0, 0, canvas.width, 118);

  // Avatar circle
  ctx.fillStyle = '#128C7E';
  ctx.beginPath();
  ctx.arc(58, 66, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('MS', 42, 74);

  // Sender title & phone
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('+91 93728 41902', 102, 58);
  ctx.fillStyle = '#D1FAE5';
  ctx.font = '18px sans-serif';
  ctx.fillText('MSEDCL Bill Officer (Unknown Contact)', 102, 86);

  // Date chip
  ctx.fillStyle = '#E1F3FB';
  roundRect(ctx, 255, 144, 130, 34, 10);
  ctx.fill();
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('TODAY', 292, 167);

  // Incoming scam bubble
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 28, 200, 560, 420, 18);
  ctx.fill();

  // Bubble red urgency header
  ctx.fillStyle = '#B91C1C';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('URGENT ELECTRICITY NOTICE!', 52, 248);

  // Body lines
  ctx.fillStyle = '#111827';
  ctx.font = '21px sans-serif';
  const lines = [
    'Dear Consumer,',
    'Your Nagpur MSEDCL electricity power',
    'will be DISCONNECTED TONIGHT at',
    '9:30 PM because last month bill was',
    'not updated in our system.',
    '',
    'Immediately pay Rs. 12 verification',
    'charge using this link:',
  ];
  let y = 292;
  for (const line of lines) {
    ctx.fillText(line, 52, y);
    y += 30;
  }

  // Fake shortened link
  ctx.fillStyle = '#1D4ED8';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('http://bit.ly/mseb-bill-update-now', 52, 542);

  // Fake officer phone
  ctx.fillStyle = '#111827';
  ctx.font = '20px sans-serif';
  ctx.fillText('Or call Electricity Officer: 9372841902', 52, 584);

  // Timestamp
  ctx.fillStyle = '#6B7280';
  ctx.font = '16px sans-serif';
  ctx.fillText('8:14 PM', 506, 608);

  // Second follow-up bubble
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 28, 646, 470, 96, 18);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = '21px sans-serif';
  ctx.fillText('Download QuickSupport App & share code', 52, 686);
  ctx.fillText('in 10 mins or meter will be cut!', 52, 718);

  return canvas.toDataURL('image/png');
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
