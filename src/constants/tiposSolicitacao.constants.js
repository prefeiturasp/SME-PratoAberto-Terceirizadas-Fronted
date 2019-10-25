import {
  ALTERACAO_CARDAPIO,
  INCLUSAO_ALIMENTACAO,
  INVERSAO_CARDAPIO,
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  SUSPENSAO_ALIMENTACAO
} from "../configs/constants";

export const TIPOS_SOLICITACAO_LABEL = {
  INCLUSAO_DE_ALIMENTACAO: "Inclusão de Alimentação",
  INCLUSAO_DE_ALIMENTACAO_CONTINUA: "Inclusão de Alimentação Contínua",
  ALTERACAO_DE_CARDAPIO: "Alteração de Cardápio",
  SOLICITACAO_DE_KIT_LANCHE_PASSEIO: "Kit Lanche Passeio",
  INVERSAO_DE_DIA_DE_CARDAPIO: "Inversão de dia de Cardápio",
  SOLICITACAO_UNIFICADA: "Kit Lanche Unificado",
  SUSPENSAO_DE_ALIMENTACAO: "Suspensão de Alimentação"
};

export const TIPOS_SOLICITACAO_LISTA = [
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INCLUSAO_DE_ALIMENTACAO,
    link: INCLUSAO_ALIMENTACAO
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.ALTERACAO_DE_CARDAPIO,
    link: ALTERACAO_CARDAPIO
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SOLICITACAO_DE_KIT_LANCHE_PASSEIO,
    link: SOLICITACAO_KIT_LANCHE
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INVERSAO_DE_DIA_DE_CARDAPIO,
    link: INVERSAO_CARDAPIO
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SOLICITACAO_UNIFICADA,
    link: SOLICITACAO_KIT_LANCHE_UNIFICADA
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SUSPENSAO_DE_ALIMENTACAO,
    link: SUSPENSAO_ALIMENTACAO
  }
];