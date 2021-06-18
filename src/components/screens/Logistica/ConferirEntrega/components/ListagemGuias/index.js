import React from "react";
import "antd/dist/antd.css";
import "./styles.scss";
import { CONFERENCIA_GUIA, LOGISTICA, REPOSICAO_GUIA } from "configs/constants";
import { NavLink } from "react-router-dom";

const ListagemSolicitacoes = ({ guias }) => {
  const retornaBotaoAcao = guia => {
    if (["Recebimento parcial", "Não recebida"].includes(guia.status)) {
      return (
        <>
          <NavLink
            className="float-left"
            to={`/${LOGISTICA}/${REPOSICAO_GUIA}?uuid=${guia.uuid}`}
          >
            <span className="link-acoes green">
              <i className="fas fa-redo" />
              Repor
            </span>
          </NavLink>
          |
        </>
      );
    } else if (guia.status === "Pendente de conferência") {
      return (
        <>
          <NavLink
            className="float-left"
            to={`/${LOGISTICA}/${CONFERENCIA_GUIA}?uuid=${guia.uuid}`}
          >
            <span className="link-acoes green">
              <i className="fas fa-eye" />
              Conferir
            </span>
          </NavLink>
          |
        </>
      );
    }
  };

  return (
    <section className="resultado-conferir-entrega">
      <article>
        <div className="grid-table header-table">
          <div>Número da Guia</div>
          <div>Nome do Distribuidor</div>
          <div>Data de entrega</div>
          <div>Status</div>
          <div>Ações</div>
        </div>
        {guias.map(guia => {
          return (
            <>
              <div key={guia.uuid} className="grid-table body-table">
                <div>{guia.numero_guia}</div>
                <div>{guia.nome_distribuidor}</div>
                <div>{guia.data_entrega}</div>
                <div>{guia.status}</div>
                <div>
                  {retornaBotaoAcao(guia)}

                  <span className="link-acoes">
                    <i className="fas fa-print" />
                    Imprimir
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemSolicitacoes;
