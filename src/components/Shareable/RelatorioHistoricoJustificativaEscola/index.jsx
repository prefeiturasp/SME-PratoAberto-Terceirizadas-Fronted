import React from "react";
import { TIPO_USUARIO } from "../../../constants/shared";
import "./style.scss";
import { existeLogDeCancelamentoDaEscola } from "./helper";

export const RelatorioHistoricoJustificativaEscola = props => {
  const { solicitacao } = props;
  const EXIBIR_HISTORICO = existeLogDeCancelamentoDaEscola(solicitacao);
  return (
    <div>
      {EXIBIR_HISTORICO && (
        <div className="question-history">
          <hr />
          <div className="row title">
            <div className="col-12">
              <p>Histórico de justificativas</p>
            </div>
          </div>
          {solicitacao.logs.map((log, key) => {
            return log.status_evento_explicacao === "Escola cancelou" ? (
              <div key={key} className="question-log">
                <div>
                  {log.criado_em} -{" "}
                  {log.usuario.tipo_usuario === TIPO_USUARIO.ESCOLA
                    ? "ESCOLA CANCELOU"
                    : "DRE CANCELOU"}
                  <div className="is-it-possible">
                    {log.justificativa && (
                      <div className="obs">
                        Observação do Cancelamento: {log.justificativa}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              log.status_evento_explicacao === "DRE cancelou" && (
                <div key={key} className="question-log">
                  <div>
                    {log.criado_em} -{" "}
                    {log.usuario.tipo_usuario === TIPO_USUARIO.ESCOLA
                      ? "ESCOLA"
                      : "DRE"}
                    <div className="is-it-possible">
                      <div className="title">Cancelou</div>
                      {log.justificativa && (
                        <div className="obs">
                          Observação do Cancelamento: {log.justificativa}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatorioHistoricoJustificativaEscola;
