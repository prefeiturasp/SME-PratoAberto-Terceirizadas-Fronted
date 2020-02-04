import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Field } from "redux-form";
import { ToggleExpandir } from "../../../../../Shareable/ToggleExpandir";
import { Botao } from "../../../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON
} from "../../../../../Shareable/Botao/constants";
import { withRouter } from "react-router-dom";
import { ToggleSwitch } from "../../../../../Shareable/ToggleSwitch";
import InputFile from "../../../../../Shareable/Input/InputFile";
import { TextAreaWYSIWYG } from "../../../../../Shareable/TextArea/TextAreaWYSIWYG";

export class SolicitacaoVigente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitacoesVigentes: null
    };
  }

  componentDidMount() {
    if (this.props.solicitacoesVigentes !== this.state.solicitacoesVigentes) {
      this.setState({ solicitacoesVigentes: this.props.solicitacoesVigentes });
    }
  }

  componentDidUpdate() {
    if (this.props.solicitacoesVigentes !== this.state.solicitacoesVigentes) {
      this.setState({ solicitacoesVigentes: this.props.solicitacoesVigentes });
    }
  }

  activateSolicitacao(key) {
    let solicitacoesVigentes = this.state.solicitacoesVigentes;
    solicitacoesVigentes[key].active = !solicitacoesVigentes[key].active;
    this.setState({ solicitacoesVigentes });
  }

  toggleSolicitacao(key) {
    let solicitacoesVigentes = this.state.solicitacoesVigentes;
    solicitacoesVigentes[key].toggled = !solicitacoesVigentes[key].toggled;
    this.setState({ solicitacoesVigentes });
  }

  render() {
    const { solicitacoesVigentes } = this.state;
    const { uuid } = this.props;
    return (
      <div className="current-diets">
        {!solicitacoesVigentes || solicitacoesVigentes.length === 0 ? (
          !uuid && (
            <div className="pt-2 no-diets">
              Não há solicitações vigentes para este aluno.
            </div>
          )
        ) : (
          <div>
            <p className="pt-3 title">Dietas Ativas/Inativas</p>
            {solicitacoesVigentes.map((solicitacaoVigente, key) => {
              let texto = "";
              let iconClassName = "";
              let corIcone = "";
              solicitacaoVigente.ativo
                ? (texto = "Dieta ativa")
                : (texto = "Dieta inativa");
              solicitacaoVigente.ativo
                ? (iconClassName = "fas fa-check-circle")
                : (iconClassName = "fas fa-ban");
              solicitacaoVigente.ativo
                ? (corIcone = "green")
                : (corIcone = "red");
              return (
                <div className="pb-2" key={key}>
                  <div
                    className="school-container col-md-12 mr-4"
                    style={
                      solicitacaoVigente.active ? { background: "#F2FBFE" } : {}
                    }
                  >
                    <div className="row pt-2 pb-2 title">
                      <div className="col-4">
                        {`Solicitação: # ${solicitacaoVigente.id_externo}`}
                      </div>
                      <div className="col-8 text-right">
                        <i
                          style={{ color: corIcone }}
                          className={iconClassName}
                        />
                        <label className="ml-1 pr-3 ">{texto}</label>
                        <ToggleExpandir
                          onClick={() => this.activateSolicitacao(key)}
                          ativo={solicitacaoVigente.active}
                          className="float-right"
                        />
                      </div>
                    </div>
                    <Collapse isOpened={solicitacaoVigente.active}>
                      <hr />
                      <div className="container">
                        <section className="row attachments">
                          <div className="report-label-value col-8">
                            <p>Laudo Médico</p>
                            <p>
                              Para visualizar o(s) laudo(s) fornecido(s) pelo
                              prescritor, clique nos anexo(s)
                            </p>{" "}
                          </div>{" "}
                          <div className="col-4 report-label-value">
                            <p>Anexos</p>
                            {solicitacaoVigente.anexos
                              .filter(anexo => anexo.eh_laudo_medico)
                              .map((anexo, key) => {
                                return (
                                  <div key={key}>
                                    <a
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      href={anexo.arquivo}
                                      className="link"
                                    >
                                      {`Anexo ${key + 1}`}
                                    </a>
                                  </div>
                                );
                              })}
                          </div>
                        </section>
                        <div className="report-label-value">
                          <p>Observações</p>
                          <p
                            className="value"
                            dangerouslySetInnerHTML={{
                              __html: solicitacaoVigente.observacoes
                            }}
                          />
                        </div>
                        <div className="report-label-value">
                          <p>Relação por Diagnóstico</p>
                          {solicitacaoVigente.alergias_intolerancias.map(
                            (alergia, key) => {
                              return (
                                <div className="value" key={key}>
                                  {alergia.descricao}
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className="pb-3 report-label-value">
                          <p>Protocolo da Dieta Especial</p>
                          {solicitacaoVigente.anexos
                            .filter(anexo => !anexo.eh_laudo_medico)
                            .map((anexo, key) => {
                              return (
                                <div key={key}>
                                  <a
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={anexo.arquivo}
                                    className="link"
                                  >
                                    {anexo.nome}
                                  </a>
                                </div>
                              );
                            })}
                        </div>
                        <div className="row pb-3">
                          <div className="col-6">
                            <Botao
                              onClick={() =>
                                this.props.history.push(
                                  `/dieta-especial/relatorio?uuid=${
                                    solicitacaoVigente.uuid
                                  }`
                                )
                              }
                              texto="Visualizar Solicitação"
                              style={BUTTON_STYLE.BLUE_OUTLINE}
                              type={BUTTON_TYPE.BUTTON}
                              icon={BUTTON_ICON.FILE_ALT}
                              className="mr-3"
                            />
                          </div>
                          <div className="col-6 text-right">
                            <ToggleSwitch
                              onClick={() => this.toggleSolicitacao(key)}
                              texto="Solicitar inativação da Dieta Especial"
                            />
                          </div>
                        </div>
                        <div
                          className={`card mb-4 ${!solicitacaoVigente.toggled &&
                            "opaco"}`}
                        >
                          <div className="card-body">
                            <section className="row attachments">
                              <div className="col-9">
                                <div className="card-title font-weight-bold cinza-escuro mt-4">
                                  Laudo Médico
                                </div>
                                <div className="text">
                                  Anexe o laudo fornecido pelo médico acima. Sem
                                  ele, a solicitação de Dieta Especial será
                                  negada.
                                </div>
                                <div className="card-warning mt-2">
                                  <strong>IMPORTANTE:</strong> Envie um arquivo
                                  formato .doc, .docx, .pdf, .png, .jpg ou
                                  .jpeg, com até 10Mb. <br /> O Laudo deve ter
                                  sido emitido há, no máximo, 3 meses. Após a
                                  data de aprovação no sistema, o laudo terá
                                  validade de 12 meses
                                </div>
                              </div>
                              <div className="col-3 btn">
                                <Field
                                  component={InputFile}
                                  className="inputfile"
                                  texto="Anexar"
                                  name="files"
                                  accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                                  setFiles={this.setFiles}
                                  removeFile={this.removeFile}
                                  disabled={!solicitacaoVigente.toggled}
                                  multiple
                                />
                              </div>
                            </section>
                            <section className="row mt-5 mb-5">
                              <div className="col-12">
                                <Field
                                  component={TextAreaWYSIWYG}
                                  label="Justificativa"
                                  name="justificativa"
                                  className="form-control"
                                  disabled={!solicitacaoVigente.toggled}
                                />
                              </div>
                            </section>
                            <div className="row">
                              <div className="col-12 text-right">
                                <Botao
                                  texto="Enviar"
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                  type={BUTTON_TYPE.BUTTON}
                                  disabled={!solicitacaoVigente.toggled}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SolicitacaoVigente);
