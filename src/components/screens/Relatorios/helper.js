export const mesInteiro = mes => {
  const mesInteiro = {
    Jan: "Janeiro",
    Dev: "Fevereiro",
    Mar: "Março",
    Abr: "Abril",
    Mai: "Maio",
    Jun: "Junho",
    Jul: "Julho",
    Ago: "Agosto",
    Set: "Setembro",
    Out: "Outubro",
    Nov: "Novembro",
    Dez: "Dezembro"
  };
  return mesInteiro[mes];
};

export const anoCorrente = () => {
  const date = new Date();
  return date.getFullYear();
};
