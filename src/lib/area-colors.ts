/* Adjusted Area Colors for System Consistency */
  /* Criminal: Error (Red) */
  /* Cível: Processos (Teal) */
  /* Trabalhista: Warning (Orange) */
  /* Tributário: Info (Purple) */
  /* Previdenciário: Success (Green) */

export const AREA_COLORS: Record<string, { bg: string; text: string; border: string; light: string }> = {
  criminal: {
    bg: 'var(--color-error)',
    text: 'var(--color-error)',
    border: 'var(--color-error)',
    light: 'var(--color-error-light)',
  },
  civil: {
    bg: 'var(--color-processos)',
    text: 'var(--color-processos)',
    border: 'var(--color-processos)',
    light: 'var(--color-processos-light)',
  },
  trabalhista: {
    bg: 'var(--color-warning)',
    text: 'var(--color-warning)',
    border: 'var(--color-warning)',
    light: 'var(--color-warning-light)',
  },
  previdenciario: {
    bg: 'var(--color-success)',
    text: 'var(--color-success)',
    border: 'var(--color-success)',
    light: 'var(--color-success-light)',
  },
  tributario: {
    bg: 'var(--color-info)',
    text: 'var(--color-info)',
    border: 'var(--color-info)',
    light: 'var(--color-info-light)',
  },
};

export function getAreaColor(areaId: string) {
  const normalize = (str: string) => 
    str.toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .replace(/iv[ei]l/g, 'civel'); // Handle both Civil and Cível

  const id = normalize(areaId);
  
  // Direct mapping for normalized keys
  const colors = AREA_COLORS[id === 'civil' ? 'civel' : id as any] || 
                 AREA_COLORS[id] || 
                 AREA_COLORS['civil' as any]; // Fallback to civil if anything matches
  
  if (id === 'criminal' || id === 'penal') return AREA_COLORS.criminal;
  if (id === 'civel' || id === 'civil') return AREA_COLORS.civil;
  if (id === 'trabalhista' || id === 'trabalho') return AREA_COLORS.trabalhista;
  if (id === 'previdenciario' || id === 'previdencia') return AREA_COLORS.previdenciario;
  if (id === 'tributario' || id === 'fiscal') return AREA_COLORS.tributario;

  return colors || {
    bg: 'var(--color-chumbo)',
    text: 'var(--color-chumbo)',
    border: 'var(--color-chumbo)',
    light: 'var(--color-surface-high)',
  };
}
