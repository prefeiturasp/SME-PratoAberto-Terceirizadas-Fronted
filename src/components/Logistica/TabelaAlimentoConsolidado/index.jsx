import React from "react";

export default ({ alimentosConsolidado, className }) => {
  const filtraEmbalagemPorTipo = (embalagens, tipo) => {
    const embalagensFiltradas = embalagens.filter(value => {
      return value.tipo_embalagem === tipo;
    });
    if (embalagensFiltradas.length) return embalagensFiltradas[0];
    else return false;
  };

  return (
    <table
      className={`table table-bordered table-consolidado-alimentos mt-3 ${className}`}
    >
      <thead>
        <tr>
          <th scope="col" rowSpan="2" className="align-middle">
            Alimento
          </th>
          <th scope="col" colSpan="2" className="text-center">
            Embalagem Fechada
          </th>
          <th scope="col" colSpan="2" className="text-center">
            Embalagem Fracionada
          </th>
          <th scope="col" rowSpan="2" className="align-middle">
            Peso total
          </th>
        </tr>
        <tr>
          <th scope="col">Qtde</th>
          <th scope="col">Capacidade</th>
          <th scope="col">Qtde</th>
          <th scope="col">Capacidade</th>
        </tr>
      </thead>
      <tbody>
        {alimentosConsolidado.map(item => {
          const fracionada = filtraEmbalagemPorTipo(
            item.total_embalagens,
            "FRACIONADA"
          );
          const fechada = filtraEmbalagemPorTipo(
            item.total_embalagens,
            "FECHADA"
          );
          return (
            <>
              <tr>
                <td>{item.nome_alimento}</td>
                <td>{fechada && fechada.qtd_volume}</td>
                <td>
                  {fechada ? (
                    <>
                      {fechada.descricao_embalagem}.{" "}
                      {fechada.capacidade_embalagem}
                      {fechada.unidade_medida}
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td>{fracionada && fracionada.qtd_volume}</td>
                <td>
                  {fracionada ? (
                    <>
                      {fracionada.descricao_embalagem}.{" "}
                      {fracionada.capacidade_embalagem}
                      {fracionada.unidade_medida}
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {item.peso_total}
                  {item.total_embalagens[0].unidade_medida}
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};
