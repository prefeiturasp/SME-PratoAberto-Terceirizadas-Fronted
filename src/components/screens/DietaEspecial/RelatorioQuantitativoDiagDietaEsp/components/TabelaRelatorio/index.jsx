import React, { Fragment } from "react";

import { TIPO_PERFIL } from "constants/shared";

import "./styles.scss";

export default ({ dadosRelatorio, filtros }) => {
  if (dadosRelatorio.length === 0) return false;
  const primeiroRegistro = dadosRelatorio[0];
  const tipoUsuario = localStorage.getItem("tipo_perfil");
  const perfilGrid =
    tipoUsuario === TIPO_PERFIL.ESCOLA
      ? "escola"
      : tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL
      ? "dre"
      : "nutri";
  const tipoGrid = filtros.status ? "unico" : "todos";
  const classeGrid = `grid-${perfilGrid}-${tipoGrid}`;
  return (
    <section className="tabela-relatorio-quant-diag-dieta-esp">
      <div className={`header-quantitativo-por-terceirizada ${classeGrid}`}>
        {primeiroRegistro["dre"] && <div>Diretoria Regional</div>}
        {primeiroRegistro["escola"] && <div>Escola</div>}
        <div>Diagnóstico</div>
        <div>Ano Nasc. Aluno</div>
        {[undefined, "pendentes"].includes(filtros.status) && (
          <div>Dietas pendentes</div>
        )}
        {[undefined, "ativas"].includes(filtros.status) && (
          <div>Dietas ativas</div>
        )}
        {[undefined, "inativas"].includes(filtros.status) && (
          <div>Dietas inativas</div>
        )}
      </div>
      {dadosRelatorio.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className={`row-quantitativo-nome ${classeGrid}`}>
              {item.dre && <div>{item.dre}</div>}
              {item.escola && <div>{item.escola}</div>}
              <div>{item.diagnostico}</div>
              <div>{item.ano_nasc_aluno}</div>
              {[undefined, "pendentes"].includes(filtros.status) && (
                <div>{item.qtde_pendentes}</div>
              )}
              {[undefined, "ativas"].includes(filtros.status) && (
                <div>{item.qtde_ativas}</div>
              )}
              {[undefined, "inativas"].includes(filtros.status) && (
                <div>{item.qtde_inativas}</div>
              )}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
};
