export const formatCPF_CNPJ = (value: string | undefined | null) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 11) {
    // CPF masking as you type
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    // CNPJ masking
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
};

export const formatPhone = (value: string | undefined | null) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 10) {
    // (00) 0000-0000
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // (00) 00000-0000
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

export const formatCurrencyInput = (value: string) => {
  if (!value) return '0,00';
  const digits = value.replace(/\D/g, '');
  const numValue = (parseInt(digits) / 100).toFixed(2);
  const parts = numValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(',');
};

export const formatCurrency = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  let numValue = 0;
  if (typeof value === 'string') {
    const digits = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
    numValue = isNaN(digits) ? 0 : digits;
  } else {
    numValue = value;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numValue);
};
