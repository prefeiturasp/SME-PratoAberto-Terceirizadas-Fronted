import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Field, reduxForm, FormSection } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { required } from "../../../../helpers/fieldValidators";
import "../style.scss";
import { getLotes } from "../../../../services/diretoriaRegional.service";
import {
  createTerceirizada,
  getTerceirizadaUUID,
  updateTerceirizada
} from "../../../../services/terceirizada.service";
import {
  transformaObjetos,
  fieldCnpj,
  fieldCep,
  retornaJsonDaRequisisicao
} from "./helper";
import { toastSuccess, toastError } from "../../../Shareable/Toast/dialogs";
import TelefoneOuCelular from "./InputTelefone";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import { Botao } from "../../../Shareable/Botao";
import { InputText } from "../../../Shareable/Input/InputText";
import { loadEmpresa } from "../../../../reducers/empresa.reducer";

const ENTER = 13;
class CadastroEmpresa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lotes: "",
      lotesSelecionados: [],
      lotesNomesSelecionados: [],
      formValido: false,
      contatosEmpresaForm: ["contatoEmpresa_0"],
      contatosTerceirizadaForm: ["contatoTerceirizada_0"],
      editaisContratosForm: ["editalContrato_0"],

      contatosEmpresa: [
        {
          telefone: null,
          email: null
        }
      ],

      uuid: null,
      redirect: false,

      contatosNutricionista: [
        {
          telefone: null,
          responsavel: null,
          crn: null,
          email: null
        }
      ],

      telefoneRepresentante: null
    };
    this.setaContatosEmpresa = this.setaContatosEmpresa.bind(this);
    this.setaContatoRepresentante = this.setaContatoRepresentante.bind(this);
    this.setaContatosNutricionista = this.setaContatosNutricionista.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect: true
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/configuracoes/cadastros/empresas-cadastradas" />;
    }
  };

  nomeFormContatoEmpresa() {
    const indiceDoFormAtual = `contatoEmpresa_${
      this.state.contatosEmpresaForm.length
    }`;
    let contatosEmpresaForm = this.state.contatosEmpresaForm;
    contatosEmpresaForm.push(indiceDoFormAtual);
    this.setState({ contatosEmpresaForm });
  }

  nomeFormContatoTerceirizada() {
    const indiceDoFormAtual = `contatoTerceirizada_${
      this.state.contatosTerceirizadaForm.length
    }`;
    let contatosTerceirizadaForm = this.state.contatosTerceirizadaForm;
    contatosTerceirizadaForm.push(indiceDoFormAtual);
    this.setState({ contatosTerceirizadaForm });
  }

  nomeFormContatoEdital() {
    const indiceDoFormAtual = `editalContrato_${
      this.state.editaisContratosForm.length
    }`;
    let editaisContratosForm = this.state.editaisContratosForm;
    editaisContratosForm.push(indiceDoFormAtual);
    this.setState({ editaisContratosForm });
  }

  setaContatosEmpresa(input, event, indice) {
    let contatosEmpresa = this.state.contatosEmpresa;
    contatosEmpresa[indice][input] = event;
    this.setState({ contatosEmpresa });
  }

  setaContatosNutricionista(input, event, indice) {
    let contatosNutricionista = this.state.contatosNutricionista;
    contatosNutricionista[indice][input] = event;
    this.setState({ contatosNutricionista });
  }

  setaContatoRepresentante(event) {
    let telefoneRepresentante = this.state.telefoneRepresentante;
    telefoneRepresentante = event;
    this.setState({ telefoneRepresentante });
  }

  adicionaContatoEmpresa() {
    this.setState({
      contatosEmpresa: this.state.contatosEmpresa.concat([
        {
          telefone: null,
          email: null
        }
      ])
    });
  }

  adicionaContatoNutricionista() {
    this.setState({
      contatosNutricionista: this.state.contatosNutricionista.concat([
        {
          telefone: null,
          responsavel: null,
          crn: null,
          email: null
        }
      ])
    });
  }

  atribuiContatosEmpresaForm(contatos) {
    contatos.forEach((contato, indice) => {
      let contatosEmpresaForm = this.state.contatosEmpresaForm;
      let contatosEmpresa = this.state.contatosEmpresa;
      if (indice !== 0 && contatos.length > contatosEmpresaForm.length) {
        contatosEmpresaForm.push(`contatoEmpresa_${indice}`);
        contatosEmpresa.push({
          telefone: null,
          email: null
        });
      }
      this.setState({ contatosEmpresaForm });

      contatosEmpresa[indice]["email"] = contato.email;
      contatosEmpresa[indice]["telefone"] = contato.telefone;

      this.setState({ contatosEmpresa });

      this.props.change(
        `contatoEmpresa_${indice}.telefone_empresa_${indice}`,
        contato.telefone
      );
      this.props.change(
        `contatoEmpresa_${indice}.email_empresa_${indice}`,
        contato.email
      );
    });
  }

  atribuiNutricionistaEmpresaForm(nutricionistas) {
    nutricionistas.forEach((nutri, indice) => {
      let contatosNutricionista = this.state.contatosNutricionista;
      let contatosTerceirizadaForm = this.state.contatosTerceirizadaForm;
      if (
        indice !== 0 &&
        nutricionistas.length > contatosNutricionista.length
      ) {
        contatosTerceirizadaForm.push(`contatoTerceirizada_${indice}`);
        contatosNutricionista.push({
          telefone: null,
          responsavel: null,
          crn: null,
          email: null
        });
      }
      contatosNutricionista[indice]["telefone"] = nutri.contatos[0].telefone;
      contatosNutricionista[indice]["responsavel"] = nutri.nome;
      contatosNutricionista[indice]["crn"] = nutri.crn;
      contatosNutricionista[indice]["email"] = nutri.contatos[0].email;

      this.setState({ contatosNutricionista });

      this.props.change(
        `contatoTerceirizada_${indice}.nutricionista_nome_${indice}`,
        nutri.nome
      );
      this.props.change(
        `contatoTerceirizada_${indice}.nutricionista_crn_${indice}`,
        nutri.nome
      );
      this.props.change(
        `contatoTerceirizada_${indice}.telefone_terceirizada_${indice}`,
        nutri.contatos[0].telefone
      );
      this.props.change(
        `contatoTerceirizada_${indice}.email_terceirizada_${indice}`,
        nutri.contatos[0].email
      );
    });
  }

  setaValoresForm(data) {
    this.props.change("cep", data.cep);
    this.props.change("cnpj", data.cnpj);
    this.props.change("nome_fantasia", data.nome_fantasia);
    this.props.change("razao_social", data.razao_social);
    this.props.change("endereco", data.endereco);
    this.props.change("representante_legal", data.representante_legal);
    this.props.change("email_representante_legal", data.representante_email);
    this.props.change("telefone_representante", data.representante_telefone);
    this.atribuiContatosEmpresaForm(data.contatos);
    this.atribuiNutricionistaEmpresaForm(data.nutricionistas);
  }

  componentDidMount() {
    getLotes().then(response => {
      let lotes = transformaObjetos(response);
      this.setState({ lotes });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let lotes = this.state.lotes;
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (lotes !== prevState.lotes) {
      if (uuid) {
        this.setState({ uuid });
        getTerceirizadaUUID(uuid).then(response => {
          if (response.status !== HTTP_STATUS.NOT_FOUND) {
            this.props.reset();
            let lotesNomesSelecionados = [];
            let lotesSelecionados = [];
            response.data.lotes.forEach(lote => {
              lotesNomesSelecionados.push(lote.nome);
              lotesSelecionados.push(lote.uuid);
            });
            this.setState({
              lotesNomesSelecionados,
              lotesSelecionados
            });
          }
          this.setaValoresForm(response.data);
        });
      } else {
        this.setState({
          uuid: null,
          redirect: false
        });
      }
    }
  }

  renderizarLabelLote(selected, options) {
    if (selected.length === 0) {
      return "Selecione um ou mais lotes...";
    }
    if (selected.length === options.length) {
      return "Todos os lotes foram selecionados";
    }
    if (selected.length === 1) {
      return `${selected.length} lote selecionado`;
    }
    return `${selected.length} lotes selecionados`;
  }

  lidarComSelecionados(values) {
    const lotes = this.state.lotes;
    let lotesNomesSelecionados = [];
    values.forEach(value => {
      const indice = lotes.findIndex(lote => lote.uuid === value);
      lotesNomesSelecionados.push(lotes[indice].label);
    });

    this.setState({
      lotesNomesSelecionados,
      lotesSelecionados: values
    });
  }

  resetForm() {
    this.props.reset();
  }

  salvaFormulario() {
    this.resetForm();
    this.setState({ lotesSelecionados: [] });
  }

  onSubmit(values) {
    const uuid = this.state.uuid;
    const request = JSON.stringify(
      retornaJsonDaRequisisicao(values, this.state)
    );

    if (uuid !== null) {
      updateTerceirizada(uuid, request).then(response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Empresa atualizada com sucesso!");
          this.setRedirect();
        } else {
          toastError("Erro ao atualizar cadastro de empresa");
        }
      });
    } else {
      createTerceirizada(request).then(response => {
        if (response.status === HTTP_STATUS.CREATED) {
          toastSuccess("Empresa cadastrada com sucesso!");
          this.setRedirect();
        } else {
          toastError("Erro ao cadastrar empresa");
        }
      });
    }
    this.resetForm();
  }

  onKeyPress(event) {
    if (event.which === ENTER) {
      event.preventDefault();
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      contatosEmpresaForm,
      contatosTerceirizadaForm,
      lotes,
      lotesSelecionados,
      lotesNomesSelecionados,
      uuid
    } = this.state;
    return (
      <div className="cadastro pt-3">
        {this.renderRedirect()}
        <form onSubmit={handleSubmit} onKeyPress={this.onKeyPress}>
          <div className="card">
            <div>
              <div className="card-body">
                <div className="card-title font-weight-bold">
                  Dados da Empresa
                </div>
                <div className="row pt-3">
                  <div className="col-12">
                    <Link to="/configuracoes/cadastros/empresas-cadastradas">
                      <Botao
                        texto="Consulta de empresas cadastradas"
                        style={BUTTON_STYLE.BLUE_OUTLINE}
                      />
                    </Link>
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Razão social"
                      name="razao_social"
                      validate={required}
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      {...fieldCnpj}
                      component={InputText}
                      label="CNPJ"
                      name="cnpj"
                      validate={required}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Nome Fantasia"
                      name="nome_fantasia"
                    />
                  </div>
                </div>

                <div className="row pt-3">
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Endereço"
                      name="endereco"
                      // validate={required}
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      {...fieldCep}
                      component={InputText}
                      label="CEP"
                      name="cep"
                      // validate={required}
                    />
                  </div>
                </div>

                <div className="container-fields row">
                  <div className="col-11">
                    {contatosEmpresaForm.map(
                      (contatoEmpresa, indiceEmpresa) => {
                        return (
                          <FormSection
                            nomeForm={`contatoEmpresa_${indiceEmpresa}`}
                            name={contatoEmpresa}
                            key={indiceEmpresa}
                          >
                            <div className="fields-set">
                              <div>
                                <Field
                                  name={`telefone_empresa_${indiceEmpresa}`}
                                  component={TelefoneOuCelular}
                                  label="Telefone"
                                  id={`telefone_empresa_${indiceEmpresa}`}
                                  setaContatosEmpresa={this.setaContatosEmpresa}
                                  indice={indiceEmpresa}
                                  cenario="contatoEmpresa"
                                />
                              </div>
                              <div>
                                <Field
                                  name={`email_empresa_${indiceEmpresa}`}
                                  component={InputText}
                                  label="E-mail"
                                  required
                                  validate={required}
                                  onChange={event =>
                                    this.setaContatosEmpresa(
                                      "email",
                                      event.target.value,
                                      indiceEmpresa
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </FormSection>
                        );
                      }
                    )}
                  </div>
                  <div className={`col-1 mt-auto mb-1`}>
                    <Botao
                      texto="+"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.BLUE_OUTLINE}
                      onClick={() => {
                        this.nomeFormContatoEmpresa();
                        this.adicionaContatoEmpresa();
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr className="linha-form" />

              <div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-7">
                      <Field
                        component={InputText}
                        label="Representante Legal"
                        name="representante_legal"
                        required
                        validate={required}
                      />
                    </div>
                    <div className="col-5">
                      <Field
                        name={`telefone_representante`}
                        label="Telefone"
                        component={TelefoneOuCelular}
                        id={`telefone_representante`}
                        setaContatoRepresentante={this.setaContatoRepresentante}
                        cenario="contatoRepresentante"
                      />
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-7">
                      <Field
                        component={InputText}
                        label="E-mail"
                        name="email_representante_legal"
                        required
                        validate={required}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="linha-form" />

              <div>
                <div className="card-body">
                  <div className="container-fields">
                    <div className="fields">
                      {contatosTerceirizadaForm.map(
                        (contatoTerceirizada, indiceTerceirizada) => {
                          return (
                            <FormSection
                              nomeForm={`contatoTerceirizada_${indiceTerceirizada}`}
                              name={contatoTerceirizada}
                              key={indiceTerceirizada}
                            >
                              <div className="form-section-terceirizada">
                                <div className="section-nutri-crn">
                                  <div>
                                    <Field
                                      name={`nutricionista_nome_${indiceTerceirizada}`}
                                      component={InputText}
                                      label="Nutricionista Responsável Técnico"
                                      required
                                      validate={required}
                                      onChange={event =>
                                        this.setaContatosNutricionista(
                                          "responsavel",
                                          event.target.value,
                                          indiceTerceirizada
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      name={`nutricionista_crn_${indiceTerceirizada}`}
                                      label="CRN"
                                      component={InputText}
                                      onChange={event =>
                                        this.setaContatosNutricionista(
                                          "crn",
                                          event.target.value,
                                          indiceTerceirizada
                                        )
                                      }
                                      required
                                      validate={required}
                                    />
                                  </div>
                                </div>
                                <div className="section-nutri-contato pt-2">
                                  <div>
                                    <Field
                                      name={`telefone_terceirizada_${indiceTerceirizada}`}
                                      component={TelefoneOuCelular}
                                      label="Telefone/Celular Técnico"
                                      id={`telefone_terceirizada_${indiceTerceirizada}`}
                                      setaContatosNutricionista={
                                        this.setaContatosNutricionista
                                      }
                                      indice={indiceTerceirizada}
                                    />
                                  </div>
                                  <div>
                                    <Field
                                      name={`email_terceirizada_${indiceTerceirizada}`}
                                      label="E-mail"
                                      component={InputText}
                                      required
                                      validate={required}
                                      onChange={event =>
                                        this.setaContatosNutricionista(
                                          "email",
                                          event.target.value,
                                          indiceTerceirizada
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </FormSection>
                          );
                        }
                      )}
                    </div>
                    <div className={`col-1 mt-auto mb-1`}>
                      <Botao
                        texto="+"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.BLUE_OUTLINE}
                        onClick={() => {
                          this.nomeFormContatoTerceirizada();
                          this.adicionaContatoNutricionista();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="linha-form" />

              <div>
                <div className="card-body">
                  <div className="row pt-3">
                    <div className="col-12">
                      <label className="label font-weight-normal pb-3">
                        Lotes de atendimento
                      </label>

                      {this.state.lotes.length ? (
                        <Field
                          component={StatefulMultiSelect}
                          name="lotes"
                          selected={lotesSelecionados}
                          options={lotes}
                          valueRenderer={this.renderizarLabelLote}
                          onSelectedChanged={value => {
                            this.lidarComSelecionados(value);
                          }}
                          overrideStrings={{
                            search: "Busca",
                            selectSomeItems: "Selecione",
                            allItemsAreSelected:
                              "Todos os itens estão selecionados",
                            selectAll: "Todos"
                          }}
                        />
                      ) : (
                        <div className="col-6">Carregando lotes..</div>
                      )}
                    </div>
                    <div className="col-12">
                      {lotesNomesSelecionados.length > 0 && (
                        <div className="row pt-3">
                          <div className="col-12">
                            <label className="label-selected-unities">
                              Lotes Selecionados
                            </label>
                            {lotesNomesSelecionados.map((lote, indice) => {
                              return (
                                <div
                                  className="value-selected-unities"
                                  key={indice}
                                >
                                  {lote}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mt-5">
                    {uuid === null ? (
                      <div className="col-12 text-right">
                        <Botao
                          texto="Cancelar"
                          onClick={event => this.resetForm(event)}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                        <Botao
                          texto={"Salvar"}
                          onClick={handleSubmit(values =>
                            this.onSubmit({
                              ...values
                            })
                          )}
                          className="ml-3"
                          type={BUTTON_TYPE.SUBMIT}
                          style={BUTTON_STYLE.GREEN}
                        />
                      </div>
                    ) : (
                      <div className="col-12 text-right">
                        <Botao
                          texto={"Atualizar"}
                          onClick={handleSubmit(values =>
                            this.onSubmit({
                              ...values
                            })
                          )}
                          className="ml-3"
                          type={BUTTON_TYPE.SUBMIT}
                          style={BUTTON_STYLE.GREEN}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const CadastroEmpresaForm = reduxForm({
  form: "cadastroEmpresaForm",
  enableReinitialize: true
})(CadastroEmpresa);
const mapStateToProps = state => {
  return {
    initialValues: state.cadastroEmpresaForm.data
  };
};

const mapDispatchToProps = dispatch => {
  bindActionCreators(
    {
      loadEmpresa
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CadastroEmpresaForm);
