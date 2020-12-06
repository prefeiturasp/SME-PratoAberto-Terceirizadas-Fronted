import moment from "moment";
import React, { useEffect, useReducer, useState, Fragment } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { SelectWithHideOptions } from "components/Shareable/SelectWithHideOptions";
import { InputComData } from "components/Shareable/DatePicker";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import "./style.scss";

import {
  getNomesDistribuidores,
  getNumerosRequisicoes,
  getInfosUnidadesEscolares,
  getNumeroGuiasRequisicao,
  getAlimentosDaGuia
  // getRequisicoesDoFiltroAvancado
} from "../../../../services/logistica.service.js";

const initialState = {
  dados: {},
  nomesDistribuidores: [],
  numerosRequisicoes: [],
  numerosGuiasRemessa: [],
  nomesProdutos: [],
  infosUnidadesEscolares: [],
  numerosCodigoCodae: [],
  nomesUnidadesEscolares: []
};

const FORM_NAME = "filtroRequisicoesAvancadoDilog";

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDadosGerais":
      return { ...state, dados: payload };
    case "atualizarFiltro": {
      if (!payload.searchText.length) {
        return { ...state, [payload.filtro]: [] };
      }
      const reg = new RegExp(payload.searchText, "i");
      const filtrado = state.dados[payload.filtro].filter(el => reg.test(el));
      return { ...state, [payload.filtro]: filtrado };
    }

    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      // eslint-disable-next-line no-console
      console.error("Invalid action type: ", actionType);
  }
}

const STATUS_OPCOES = [
  "Todos",
  "Aguardando envio",
  "Enviada",
  "Cancelada",
  "Confirmada",
  "Em análise"
];

const FiltroRequisicaoDilogAvancado = ({ initialValues }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState({
    opcoesStatus: STATUS_OPCOES,
    statusSelecionados: []
  });

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesDistribuidores(),
        getNumerosRequisicoes(),
        getInfosUnidadesEscolares(),
        getNumeroGuiasRequisicao(),
        getAlimentosDaGuia()
      ]).then(
        ([
          nomesDistribuidores,
          numerosRequisicoes,
          infosUnidadesEscolares,
          numerosGuiasRemessa,
          nomesProdutos
        ]) => {
          dispatch({
            type: "popularDadosGerais",
            payload: {
              nomesDistribuidores: nomesDistribuidores.data.results.map(
                el => el.nome_fantasia
              ),
              numerosRequisicoes: numerosRequisicoes.data.results.map(
                el => el.numero_solicitacao
              ),
              infosUnidadesEscolares: infosUnidadesEscolares.data.results,
              numerosCodigoCodae: infosUnidadesEscolares.data.results.map(
                el => el.codigo_unidade
              ),
              nomesUnidadesEscolares: infosUnidadesEscolares.data.results.map(
                el => el.nome_unidade
              ),
              numerosGuiasRemessa: numerosGuiasRemessa.data.results.map(
                el => el.numero_guia
              ),
              nomesProdutos: nomesProdutos.data.results.map(
                el => el.nome_alimento
              )
            }
          });
        }
      );
    }
    fetchData();
  }, []);

  const onSubmit = async () => {
    // values['status'].push(status.statusSelecionados)
    // const response = await getRequisicoesDoFiltroAvancado(values);
  };

  const onSearch = (filtro, searchText) => {
    dispatch({
      type: "atualizarFiltro",
      payload: {
        filtro,
        searchText
      }
    });
  };

  const onSelectStatus = value => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: [], statusSelecionados: ["Todos"] });
    } else {
      setStatus({
        opcoesStatus: STATUS_OPCOES,
        statusSelecionados: [...status.statusSelecionados, value]
      });
    }
  };

  const onDeselectStatus = value => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: STATUS_OPCOES, statusSelecionados: [] });
    } else {
      const filtered = status.statusSelecionados.filter(item => item !== value);
      setStatus({
        opcoesStatus: STATUS_OPCOES,
        statusSelecionados: filtered
      });
    }
  };

  return (
    <div className="card">
      <Fragment>
        <div className="card-body">
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            render={({ form, handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                <FinalFormToRedux form={FORM_NAME} />
                <header>Consulta encaminhamento de guias</header>
                <section className="formulario-busca">
                  <div className="tres-colunas">
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.numerosRequisicoes}
                      label="N° da requisição"
                      name="numero_requisicao"
                      placeholder="Digite o numero da requisição"
                      className="input-numeros"
                      onSearch={v => onSearch("numerosRequisicoes", v)}
                      type="number"
                    />
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.numerosGuiasRemessa}
                      label="Nº guia de remessa"
                      name="numero_guia"
                      placeholder="Digite nº guia"
                      className="input-numeros"
                      onSearch={v => onSearch("numerosGuiasRemessa", v)}
                      type="number"
                    />
                    <div>
                      <label className="label-formulario">Status</label>
                      <Field
                        component={SelectWithHideOptions}
                        options={status.opcoesStatus}
                        name="status"
                        selectedItems={status.statusSelecionados}
                        onSelect={value => onSelectStatus(value)}
                        onDeselect={value => onDeselectStatus(value)}
                      />
                    </div>
                  </div>
                  <div className="duas-colunas">
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.nomesProdutos}
                      label="Nome do produto"
                      name="nome_produto"
                      placeholder="Digite nome do produto"
                      onSearch={v => onSearch("nomesProdutos", v)}
                    />
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.nomesDistribuidores}
                      label="Nome distribuidor/fornecedor"
                      name="nome_distribuidor"
                      placeholder="Digite nome do distribuidor"
                      onSearch={v => onSearch("nomesDistribuidores", v)}
                    />
                  </div>

                  <div className="duas-colunas-custom">
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.numerosCodigoCodae}
                      label="Código CODAE da U.E"
                      name="codigo_eol"
                      placeholder="Digite código CODAE"
                      onSearch={v => onSearch("numerosCodigoCodae", v)}
                      type="number"
                      className="input-numeros"
                    />
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.nomesUnidadesEscolares}
                      label="Nome da Unidade Educacional"
                      name="nome_escola"
                      placeholder="Digite nome de Unidade Educacional"
                      onSearch={v => onSearch("nomesUnidadesEscolares", v)}
                    />
                  </div>

                  <div className="tres-colunas">
                    <Field
                      component={InputComData}
                      name="data_inicio"
                      className="data_inicio"
                      label="Período de Entrega"
                      labelClassName="datepicker-fixed-padding"
                      popperPlacement="bottom-end"
                      placeholder="De"
                      minDate={null}
                      maxDate={
                        values.data_fim
                          ? moment(values.data_fim, "DD/MM/YYYY")._d
                          : null
                      }
                    />
                    <div>
                      <label />
                      <Field
                        component={InputComData}
                        name="data_fim"
                        labelClassName="datepicker-fixed-padding"
                        popperPlacement="bottom-end"
                        placeholder="Até"
                        minDate={
                          values.data_inicio
                            ? moment(values.data_inicio, "DD/MM/YYYY")._d
                            : null
                        }
                        maxDate={null}
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <Botao
                    texto="Consultar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-right ml-3"
                    disabled={submitting}
                  />

                  <Botao
                    texto="Limpar Filtros"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-right ml-3"
                    onClick={() => {
                      form.reset({});
                      setStatus({
                        opcoesStatus: STATUS_OPCOES,
                        statusSelecionados: []
                      });
                    }}
                  />
                </section>
              </form>
            )}
          />
        </div>
      </Fragment>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    initialValues: state.finalForm[FORM_NAME]
  };
};

export default withRouter(
  connect(mapStateToProps)(FiltroRequisicaoDilogAvancado)
);
