// Rastgele, benzersiz bir ID üretir (Örn: "k8l1m5n9")
export const generateID = () => {
  // Zaman damgası (timestamp) ve rastgele sayıyı birleştirir
  // .toString(36) sayıları harf/rakam karışımına çevirir
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};