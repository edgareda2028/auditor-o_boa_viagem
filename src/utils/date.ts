export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  // Se for uma string de data sem hora (ex: YYYY-MM-DD), adiciona o T00:00:00 para forçar o parsing no fuso horário local
  const normalized = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
  return new Date(normalized);
};
