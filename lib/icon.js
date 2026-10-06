// Ícone do app: dois círculos que se encontram (o "duplo sim") sobre fundo escuro.
// `safe` reduz o desenho para respeitar a "zona segura" de ícones maskable.
export function iconJsx(size, safe = 1) {
  const d = size * 0.4 * safe; // diâmetro de cada círculo
  const overlap = d * 0.38;
  const total = d * 2 - overlap;
  const left = (size - total) / 2;
  const top = (size - d) / 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        position: 'relative',
        background:
          'radial-gradient(circle at 80% 0%, rgba(130,60,255,0.6), transparent 60%), radial-gradient(circle at 0% 100%, rgba(255,60,160,0.5), transparent 60%), #0a0614',
      }}
    >
      <div style={{ position: 'absolute', left, top, width: d, height: d, borderRadius: d, background: '#9d5cff' }} />
      <div
        style={{
          position: 'absolute',
          left: left + d - overlap,
          top,
          width: d,
          height: d,
          borderRadius: d,
          background: '#ff4fa8',
          opacity: 0.88,
        }}
      />
    </div>
  );
}
