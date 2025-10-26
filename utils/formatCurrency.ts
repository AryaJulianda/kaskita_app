export const formatCurrency = (value: any, locals = "id-ID") => {
  return value
    ? new Intl.NumberFormat(locals, {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(parseInt(value, 10))
    : "0";
};
