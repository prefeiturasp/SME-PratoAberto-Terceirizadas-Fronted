import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  ENVIO_REQUISICOES_ENTREGA_AVANCADO,
  LOGISTICA
} from "configs/constants";
import FiltroRequisicaoDilogAvancado from "components/screens/Logistica/FiltroRequisicaoDilogAvancado";

const atual = {
  href: `/${LOGISTICA}/${ENVIO_REQUISICOES_ENTREGA_AVANCADO}`,
  titulo: "Consulta de Requisições de entrega"
};

const anteriores = [
  {
    href: `/`,
    titulo: "Logística"
  }
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <FiltroRequisicaoDilogAvancado />
  </Page>
);
