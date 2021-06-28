import React, { useState, useEffect } from "react";
import { getDietaEspecial } from "services/dietaEspecial.service";
import { toastError } from "components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { ESCOLA } from "configs/constants";
import { statusEnum } from "constants/shared";
import "antd/dist/antd.css";
import { cabecalhoDieta } from "./helpers";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import EscolaCancelaDietaEspecial from "./componentes/EscolaCancelaDietaEspecial";
import { Spin } from "antd";
import "./style.scss";

const Relatorio = ({ visao }) => {
  const [dietaEspecial, setDietaEspecial] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const fetchData = uuid => {
    loadSolicitacao(uuid);
  };

  const loadSolicitacao = async uuid => {
    setCarregando(true);
    const responseDietaEspecial = await getDietaEspecial(uuid);
    if (responseDietaEspecial.status === HTTP_STATUS.OK) {
      setDietaEspecial(responseDietaEspecial.data);
      setCarregando(false);
    } else {
      toastError("Houve um erro ao carregar Solicitação");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      fetchData(uuid);
    }
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      {dietaEspecial && (
        <span className="page-title">{cabecalhoDieta(dietaEspecial)}</span>
      )}
      <div className="card mt-3">
        <div className="card-body">
          {dietaEspecial && (
            <>
              <CorpoRelatorio dietaEspecial={dietaEspecial} />
              {dietaEspecial.status_solicitacao ===
                statusEnum.CODAE_A_AUTORIZAR &&
                visao === ESCOLA && (
                  <EscolaCancelaDietaEspecial
                    uuid={dietaEspecial.uuid}
                    onCancelar={() => loadSolicitacao(dietaEspecial.uuid)}
                  />
                )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default Relatorio;
