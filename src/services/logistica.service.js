import axios from "./_base";
import { saveAs } from "file-saver";

export const getNomesDistribuidores = async () =>
  await axios.get("/terceirizadas/lista-nomes-distribuidores/");

export const getNumerosRequisicoes = async () =>
  await axios.get("/solicitacao-remessa/lista-numeros/");

export const getRequisicoesDoFiltro = async queryparams => {
  let url = `/solicitacao-remessa/lista-requisicoes-para-envio/`;
  if (queryparams) url += "?" + queryparams + "&&param=01/";
  return await axios.get(url);
};

export const getRequisicoesListagem = async params => {
  const url = `/solicitacao-remessa/`;
  return await axios.get(url, { params });
};

export const getNomesUnidadesEscolares = async params => {
  const url = "/guias-da-requisicao/unidades-escolares/";
  return await axios.get(url, { params });
};

export const distribuidorConfirma = async uuid => {
  const url = `/solicitacao-remessa/${uuid}/distribuidor-confirma/`;
  return await axios.patch(url);
};

export const distribuidorConfirmaTodos = async () => {
  const url = `/solicitacao-remessa/distribuidor-confirma-todos/`;
  return await axios.patch(url);
};

export const getConsolidadoAlimentos = async uuid => {
  const url = `/solicitacao-remessa/${uuid}/consolidado-alimentos/`;
  return await axios.get(url);
};

export const distribuidorAltera = async payload => {
  const url = `/solicitacao-de-alteracao-de-requisicao/`;
  return await axios.post(url, payload);
};

export const gerarPDFDistribuidorSolicitacao = async uuid => {
  const url = `/solicitacao-remessa/${uuid}/gerar-pdf-distribuidor/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "guia_de_remessa.pdf");
};

export const gerarPDFDistribuidorSolicitacoes = async params => {
  const url = `/solicitacao-remessa/gerar-pdf-distribuidor-geral/`;
  const { data } = await axios.get(url, { params, responseType: "blob" });
  saveAs(data, "guia_de_remessa.pdf");
};

export const gerarExcelSolicitacoes = async params => {
  const url = `/solicitacao-remessa/exporta-excel-visao-analitica/`;
  const { data } = await axios.get(url, { params, responseType: "blob" });
  saveAs(data, "visao_analitica.xlsx");
};

export const gerarPDFDistribuidorGuia = async uuid => {
  const url = `/guias-da-requisicao/${uuid}/gerar-pdf-distribuidor/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "guia_de_remessa.pdf");
};

export const getListagemSolicitacaoAlteracao = async params => {
  const url = `/solicitacao-de-alteracao-de-requisicao/`;
  return await axios.get(url, { params });
};

export const dilogAceitaAlteracao = async (uuid, params) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/${uuid}/dilog-aceita-alteracao/`;
  return await axios.patch(url, params);
};

export const dilogNegaAlteracao = async (uuid, params) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/${uuid}/dilog-nega-alteracao/`;
  return await axios.patch(url, params);
};

export const getGuiasRemessaParaInsucesso = async params => {
  const url = `/guias-da-requisicao/lista-guias-para-insucesso/`;
  return await axios.get(url, { params });
};

export const getGuiasInconsistencias = async params => {
  const url = `/guias-da-requisicao/inconsistencias/`;
  return await axios.get(url, { params });
};

export const vinculaGuiasComEscolas = async params => {
  const url = `/guias-da-requisicao/vincula-guias/`;
  return await axios.patch(url, { params });
};

export const getGuiasEscola = async params => {
  const url = `/guias-da-requisicao/guias-escola/`;
  return await axios.get(url, { params });
};
