import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  GESTAO_PRODUTO,
  AVALIAR_SOLICITACAO_CADASTRO_PRODUTO,
  ACOMPANHAR_SOLICITACAO_CADASTRO_PRODUTO,
  DIETA_ESPECIAL,
  CANCELAMENTO,
  CADASTRO_PROTOCOLO_PADRAO
} from "configs/constants";
import {
  usuarioEhTerceirizada,
  usuarioEhCODAEDietaEspecial,
  usuarioEhDRE,
  usuarioEhEscola,
  usuarioEhNutricionistaSupervisao,
  usuarioEhCODAEGestaoAlimentacao
} from "helpers/utilities";
import { getNomeCardAguardandoAutorizacao } from "helpers/dietaEspecial";

const MenuDietaEspecial = () => {
  const exibePainelInicial =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE() ||
    usuarioEhEscola() ||
    usuarioEhTerceirizada();
  const exibeNovaSolicitacao = usuarioEhEscola();
  const exibeConsultaDieta =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscola() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE();
  const exibeAtivasInativas =
    usuarioEhCODAEDietaEspecial() || usuarioEhNutricionistaSupervisao();
  const exibeAvaliarSolicitacaoCadastroProduto = usuarioEhTerceirizada();
  const exibeAcompanharSolicitacaoCadastroProduto = usuarioEhCODAEDietaEspecial();
  const exibeCadastroProtocoloPadrao = usuarioEhCODAEDietaEspecial();

  return (
    <Menu id="DietaEspecial" icon="fa-utensils" title={"Dieta Especial"}>
      {exibePainelInicial && (
        <LeafItem to="/painel-dieta-especial">Painel de Solicitações</LeafItem>
      )}
      {exibeNovaSolicitacao && (
        <LeafItem to={`/escola/dieta-especial`}>Nova Solicitação</LeafItem>
      )}
      {exibeNovaSolicitacao && (
        <LeafItem to={`/escola/dieta-especial-alteracao-ue`}>
          Alteração U.E
        </LeafItem>
      )}
      {exibeConsultaDieta && (
        <LeafItem to={`/dieta-especial/ativas-inativas`}>
          Consulta de Dieta do Aluno
        </LeafItem>
      )}
      {exibeAtivasInativas && (
        <LeafItem to={`/solicitacoes-dieta-especial/solicitacoes-pendentes`}>
          {getNomeCardAguardandoAutorizacao()}
        </LeafItem>
      )}
      {exibeAvaliarSolicitacaoCadastroProduto && (
        <LeafItem
          to={`/${GESTAO_PRODUTO}/${AVALIAR_SOLICITACAO_CADASTRO_PRODUTO}`}
        >
          Avaliar solic. cad. produto
        </LeafItem>
      )}
      {exibeAcompanharSolicitacaoCadastroProduto && (
        <LeafItem
          to={`/${GESTAO_PRODUTO}/${ACOMPANHAR_SOLICITACAO_CADASTRO_PRODUTO}`}
        >
          Acompanhar solic. novos produtos
        </LeafItem>
      )}
      {usuarioEhEscola() && (
        <LeafItem to={`/${DIETA_ESPECIAL}/${CANCELAMENTO}`}>
          Cancel. Dieta Especial
        </LeafItem>
      )}
      {exibeCadastroProtocoloPadrao && (
        <LeafItem to={`/${DIETA_ESPECIAL}/${CADASTRO_PROTOCOLO_PADRAO}`}>
          Cadastro de Protocolo Padrão
        </LeafItem>
      )}
    </Menu>
  );
};

export default MenuDietaEspecial;
