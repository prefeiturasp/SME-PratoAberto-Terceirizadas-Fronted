import axios from "./_base";

export const getNomesDistribuidores = async () =>
  await axios.get("/terceirizadas/lista-nomes-distribuidores/");

export const getNumerosRequisicoes = async () =>
  await axios.get("/solicitacao-remessa/lista-numeros/");

export const getInfosUnidadesEscolares = async () =>
  await axios.get("/guias-da-requisicao/unidades-escolares/");

export const getNumeroGuiasRequisicao = async () =>
  await axios.get("/guias-da-requisicao/lista-numeros/");

export const getAlimentosDaGuia = async () =>
  await axios.get("/alimentos-da-guia/lista-nomes/");

export const getRequisicoesDoFiltro = async queryparams => {
  let url = `/solicitacao-remessa/lista-requisicoes-para-envio/`;
  if (queryparams) url += "?" + queryparams + "&&param=01/";
  return await axios.get(url);
};

export const getRequisicoesDoFiltroAvancado = async data => {
  let url = `/solicitacao-remessa/consulta-requisicoes-de-entrega/`;

  return await axios.get(url, {
    params: data
  });
};
