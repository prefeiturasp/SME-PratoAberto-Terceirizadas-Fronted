import { Row, Col, Spin } from "antd";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";

import { required } from "helpers/fieldValidators";
import { obterRelatorioQuantitativo } from "helpers/terceirizadas";

import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { InputComData } from "components/Shareable/DatePicker";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";

import { getNomesTerceirizadas } from "services/produto.service";
import { getPdfRelatorioQuantitativo } from "services/terceirizada.service";

import "./style.scss";

const gerarLabelPorFiltro = filtros => {
  if (filtros.data_inicial && filtros.data_final) {
    return `Veja resultados período "${moment(
      filtros.data_inicial,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")} à ${moment(filtros.data_final, "DD/MM/YYYY").format(
      "DD/MM/YYYY"
    )}":`;
  } else if (filtros.data_inicial) {
    return `Veja resultados apartir de "${moment(
      filtros.data_inicial,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else if (filtros.data_final) {
    return `Veja resultados até "${moment(
      filtros.data_final,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else {
    return "Veja resultados da busca:";
  }
};

const TabelaQuantitativoPorTerceirizada = ({ dadosRelatorio }) => {
  if (!dadosRelatorio) return false;
  return (
    <section className="tabela-quantitativo-por-terceirizada">
      <div className="header-quantitativo-por-terceirizada">
        <div>Terceirizada</div>
        <div>Período (dias)</div>
        <div>Quantidade total de produtos</div>
      </div>
      {dadosRelatorio.detalhes.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className="row-quantitativo-nome">
              <div>{item.nomeTerceirizada}</div>
              <div>{dadosRelatorio.qtdeDias}</div>
              <div>{item.totalProdutos}</div>
            </div>
            <div className="row-quantitativo-card">
              <div className="row-quantitativo-status">
                <div className="status-flex-container">
                  <div>Produtos homologados</div>
                  <div>{item.qtdePorStatus.PRODUTOS_HOMOLOGADOS}</div>
                </div>
                <div className="status-flex-container">
                  <div>Produtos não homologados</div>
                  <div>{item.qtdePorStatus.PRODUTOS_NAO_HOMOLOGADOS}</div>{" "}
                </div>
                <div className="status-flex-container">
                  <div>Produtos pendentes de homologação</div>
                  <div>{item.qtdePorStatus.PRODUTOS_PENDENTES_HOMOLOGACAO}</div>
                </div>
                <div className="status-flex-container">
                  <div>Produtos aguardando análise sensorial</div>
                  <div>
                    {item.qtdePorStatus.PRODUTOS_AGUARDANDO_ANALISE_SENSORIAL}
                  </div>
                </div>
              </div>
              <div className="row-quantitativo-status">
                <div className="status-flex-container">
                  <div>Produtos aguardando correção</div>
                  <div>{item.qtdePorStatus.PRODUTOS_AGUARDANDO_CORRECAO}</div>
                </div>
                <div className="status-flex-container">
                  <div>Reclamação de produto</div>
                  <div>{item.qtdePorStatus.RECLAMACAO_DE_PRODUTO}</div>
                </div>
                <div className="status-flex-container">
                  <div>Produtos em análise de reclamação</div>
                  <div>{item.qtdePorStatus.PRODUTOS_ANALISE_RECLAMACAO}</div>
                </div>
                <div className="status-flex-container">
                  <div>Produtos suspensos</div>
                  <div>{item.qtdePorStatus.PRODUTOS_SUSPENSOS}</div>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
};

const RelatorioQuantitativoPorTerdeirizada = () => {
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [terceirizadas, setTerceirizadas] = useState([]);
  const [terceirizadasFiltrado, setTerceirizadasFiltrado] = useState([]);
  const [filtros, setFiltros] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const onSearch = searchText => {
    if (!searchText.length) {
      setTerceirizadasFiltrado(terceirizadas);
    }
    const reg = new RegExp(searchText, "i");
    setTerceirizadasFiltrado(terceirizadas.filter(el => reg.test(el)));
  };

  useEffect(() => {
    async function fetchData() {
      getNomesTerceirizadas().then(response => {
        const results = response.data.results.map(el => el.nome_fantasia);
        setTerceirizadas(results);
        setTerceirizadasFiltrado(results);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!filtros) return;
    async function fetchData() {
      setCarregando(true);
      const response = await obterRelatorioQuantitativo(filtros);
      setCarregando(false);
      setDadosRelatorio(response);
    }
    fetchData();
  }, [filtros, setDadosRelatorio]);

  const onSubmitForm = formValues => {
    setFiltros(formValues);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 page-relatorio-quantitativo-por-terceirizada">
        <div className="card-body">
          <h3 className="font-weight-bold">
            Relatório quantitativo de produtos por terceirizadas
          </h3>
          <Form
            onSubmit={onSubmitForm}
            render={({ form, handleSubmit, submitting, values }) => (
              <form
                onSubmit={handleSubmit}
                className="busca-produtos-formulario-shared"
              >
                <Row gutter={[16, 16]}>
                  <Col md={24} lg={12} xl={16}>
                    <Field
                      component={AutoCompleteField}
                      dataSource={terceirizadasFiltrado}
                      label="Nome da terceirizada"
                      onSearch={onSearch}
                      name="nome_terceirizada"
                    />
                  </Col>
                  <Col md={24} lg={6} xl={4}>
                    <Field
                      component={InputComData}
                      label="Período"
                      name="data_inicial"
                      className="data-inicial"
                      labelClassName="datepicker-fixed-padding"
                      placeholder="De"
                      minDate={null}
                      maxDate={
                        values.data_final
                          ? moment(values.data_final, "DD/MM/YYYY")._d
                          : null
                      }
                      validate={required}
                      required
                    />
                  </Col>
                  <Col md={24} lg={6} xl={4}>
                    <Field
                      component={InputComData}
                      label="&nbsp;"
                      name="data_final"
                      labelClassName="datepicker-fixed-padding"
                      popperPlacement="bottom-end"
                      placeholder="Até"
                      minDate={
                        values.data_inicial
                          ? moment(values.data_inicial, "DD/MM/YYYY")._d
                          : null
                      }
                      validate={required}
                    />
                  </Col>
                </Row>
                <div className="row row-botoes">
                  <div className="col-12 text-right col-botoes">
                    <Link to="/">
                      <Botao
                        texto="voltar"
                        titulo="voltar"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.BLUE_OUTLINE}
                        icon={BUTTON_ICON.ARROW_LEFT}
                        className="mr-3"
                      />
                    </Link>
                    <Botao
                      texto="Consultar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      disabled={submitting}
                    />
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>

      {dadosRelatorio && !dadosRelatorio.detalhes.length && (
        <div className="text-center mt-5">
          A consulta retornou 0 resultados.
        </div>
      )}

      <Modal
        dialogClassName="modal-90w"
        show={Boolean(dadosRelatorio && dadosRelatorio.detalhes.length)}
        onHide={() => {}}
      >
        <section className="m-3">
          <h4 className="font-weight-normal text-secondary">
            Relatório quantitativo de produtos por terceirizadas
          </h4>
          <p className="text-black font-weight-bold mb-1">
            {filtros && gerarLabelPorFiltro(filtros)}
          </p>
          <TabelaQuantitativoPorTerceirizada dadosRelatorio={dadosRelatorio} />
        </section>

        <section className="m-3">
          <Botao
            texto="voltar"
            titulo="voltar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.BLUE_OUTLINE}
            icon={BUTTON_ICON.ARROW_LEFT}
            onClick={() => {
              setFiltros(null);
              setDadosRelatorio(null);
            }}
            className="float-right"
          />
          <Botao
            style={BUTTON_STYLE.BLUE}
            icon={BUTTON_ICON.PRINT}
            texto="Imprimir"
            onClick={() => getPdfRelatorioQuantitativo(filtros)}
            type={BUTTON_TYPE.BUTTON}
            className="float-right mr-2"
          />
        </section>
      </Modal>
    </Spin>
  );
};

export default RelatorioQuantitativoPorTerdeirizada;