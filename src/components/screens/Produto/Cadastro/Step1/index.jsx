import React, { Component, Fragment } from "react";
import { Field } from "redux-form";
import { TextArea } from "../../../../Shareable/TextArea/TextArea";
import { Select } from "antd";
import {
  getNomeDeProdutosEdital,
  getMarcasProdutos,
  getFabricantesProdutos,
  criarMarcaProduto,
  criarFabricanteProduto
} from "../../../../../services/produto.service";
import "./style.scss";

import "antd/dist/antd.css";
import Botao from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "../../../../Shareable/Botao/constants";

import ModalMarca from "./ModalMarca";
import ModalFabricante from "./ModalFabricante";

import { Step1EstaValido, retornaObjetoRequest } from "../helpers";
import { required, maxLength } from "helpers/fieldValidators";
import { ASelect } from "components/Shareable/MakeField";
import { toastError } from "components/Shareable/Toast/dialogs";

const { Option } = Select;
const maxLength5000 = maxLength(5000);

class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      protocolosDieta: [],
      nomeDeProdutosEditalArray: [],
      marcasArray: [],
      fabricantesArray: [],
      showModalMarca: false,
      showModalFabricante: false,
      loadingDefault: false,
      payloadStep1: {
        eh_para_alunos_com_dieta: null,
        protocolos: [],
        detalhes_da_dieta: null,
        nome: null,
        nomeDeProdutosEdital: null,
        marca: null,
        fabricante: null,
        componentes: null,
        tem_aditivos_alergenicos: null,
        aditivos: null
      },
      dafaultArrayProtocolo: [],
      retornadoAoStep: false,
      marcaDefault: null,
      fabricantesNomes: [],
      marcasNomes: []
    };
    this.enviaMarca = this.enviaMarca.bind(this);
    this.closeModalMarca = this.closeModalMarca.bind(this);
    this.enviaFabricante = this.enviaFabricante.bind(this);
    this.closeModalFabricante = this.closeModalFabricante.bind(this);
  }

  abreOuFechaFormDietaEspecial = value => {
    let { payloadStep1 } = this.state;
    let condicao = false;
    if (value === 1) {
      condicao = true;
    } else {
      condicao = false;
    }
    payloadStep1.eh_para_alunos_com_dieta = condicao;
    this.props.mostrarFormDieta(condicao);
    this.setState({
      payloadStep1
    });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  abreOuFechaFormAlergenico = value => {
    let { payloadStep1 } = this.state;
    let condicao = false;
    if (value === 1) {
      condicao = true;
    } else {
      condicao = false;
    }
    payloadStep1.tem_aditivos_alergenicos = condicao;
    this.props.mostrarFormAlergenico(condicao);
    this.setState({
      payloadStep1
    });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  showModalMarca = () => {
    this.setState({
      showModalMarca: true
    });
  };

  closeModalMarca = () => {
    this.setState({
      showModalMarca: false
    });
  };

  enviaMarca = async value => {
    const { marcasArray, marcasNomes } = this.state;
    const { nome } = value;
    const listaNomes = marcasNomes.map(marca => {
      return marca.nome.toUpperCase();
    });
    const nulo = nome === null;
    const vazio = nome === "";
    if (!nulo && !vazio) {
      const existeNome = listaNomes.includes(nome.toUpperCase());
      if (existeNome) {
        setTimeout(() => {
          this.setState({
            loadingDefault: false,
            showModalMarca: false
          });
          this.props.resetModal();
        }, 1000);
        toastError("Marca do produto já cadastrada");
      } else {
        const response = await criarMarcaProduto(value);
        const { nome, uuid } = response.data;
        marcasArray.push(<Option key={`${nome}+${uuid}`}>{nome}</Option>);
        marcasNomes.push({ nome: nome });
        this.setState({ loadingDefault: true });
        setTimeout(() => {
          this.setState({
            loadingDefault: false,
            showModalMarca: false,
            marcasArray,
            marcasNomes
          });
          this.props.resetModal();
        }, 1000);
      }
    }
  };

  showModalFabricante = () => {
    this.setState({
      showModalFabricante: true
    });
  };

  closeModalFabricante = () => {
    this.setState({
      showModalFabricante: false
    });
  };

  enviaFabricante = async value => {
    const { fabricantesArray, fabricantesNomes } = this.state;
    const listaNomes = fabricantesNomes.map(fabricante => {
      return fabricante.nome.toUpperCase();
    });
    const { nome } = value;
    const existeNome = listaNomes.includes(nome.toUpperCase());
    if (value !== null) {
      if (value !== "") {
        if (existeNome) {
          setTimeout(() => {
            this.setState({
              loadingDefault: false,
              showModalFabricante: false
            });
            this.props.resetModal();
          }, 1000);
          toastError("Fabricante do produto já cadastrado");
        } else {
          const response = await criarFabricanteProduto(value);
          const { nome, uuid } = response.data;
          fabricantesArray.push(
            <Option key={`${nome}+${uuid}`}>{nome}</Option>
          );
          this.setState({ loadingDefault: true });
          fabricantesNomes.push({ nome: nome });
          setTimeout(() => {
            this.setState({
              loadingDefault: false,
              showModalFabricante: false,
              fabricantesArray,
              fabricantesNomes
            });
            this.props.resetModal();
          }, 1000);
        }
      }
    }
  };

  componentDidMount = async () => {
    let { marcasArray, fabricantesArray, dafaultArrayProtocolo } = this.state;
    const { payload, protocolosDieta } = this.props;
    if (dafaultArrayProtocolo.length === 0) {
      payload.protocolos.forEach(protocoloPayload => {
        protocolosDieta.forEach(protocolo => {
          if (protocoloPayload === protocolo.uuid) {
            dafaultArrayProtocolo.push(`${protocolo.nome}+${protocolo.uuid}`);
          }
        });
      });

      this.setState({
        payloadStep1: retornaObjetoRequest(payload),
        dafaultArrayProtocolo,
        retornadoAoStep: true
      });
    }

    let listaNomeDeProdutosEdital = [];
    let listaMarcas = [];
    let listaFabricantes = [];
    if (marcasArray.length === 0 && fabricantesArray.length === 0) {
      const responseNomeDeProdutosEdital = await getNomeDeProdutosEdital();
      const responseMarcas = await getMarcasProdutos();
      const responseFabricantes = await getFabricantesProdutos();
      responseNomeDeProdutosEdital.data.results.forEach(produtoEdital => {
        listaNomeDeProdutosEdital.push(
          <Option key={`${produtoEdital.nome}+${produtoEdital.uuid}`}>
            {produtoEdital.nome}
          </Option>
        );
      });
      responseMarcas.data.results.forEach(marca => {
        listaMarcas.push(
          <Option key={`${marca.nome}+${marca.uuid}`}>{marca.nome}</Option>
        );
      });
      responseFabricantes.data.results.forEach(fabricante => {
        listaFabricantes.push(
          <Option key={`${fabricante.nome}+${fabricante.uuid}`}>
            {fabricante.nome}
          </Option>
        );
      });
      this.setState({
        nomeDeProdutosEditalArray: listaNomeDeProdutosEdital,
        marcasArray: listaMarcas,
        fabricantesArray: listaFabricantes,
        loading: false,
        marcasNomes: responseMarcas.data.results,
        fabricantesNomes: responseFabricantes.data.results
      });
    }
  };

  componentDidUpdate = async () => {
    const { protocolosDieta, payload, concluidoStep1 } = this.props;
    const {
      loading,
      marcasArray,
      fabricantesArray,
      dafaultArrayProtocolo,
      retornadoAoStep
    } = this.state;
    let listaProtocolos = [];
    let listaNomeDeProdutosEdital = [];
    let listaMarcas = [];
    let listaFabricantes = [];
    if (Step1EstaValido(payload) && concluidoStep1 && !retornadoAoStep) {
      payload.protocolos.forEach(protocoloPayload => {
        protocolosDieta.forEach(protocolo => {
          if (protocoloPayload === protocolo.uuid) {
            dafaultArrayProtocolo.push(`${protocolo.nome}+${protocolo.uuid}`);
          }
        });
      });

      this.setState({
        payloadStep1: retornaObjetoRequest(payload),
        dafaultArrayProtocolo,
        retornadoAoStep: true
      });
    }
    if (marcasArray.length === 0 && loading && fabricantesArray.length === 0) {
      const responseNomeDeProdutosEdital = await getNomeDeProdutosEdital();
      const responseMarcas = await getMarcasProdutos();
      const responseFabricantes = await getFabricantesProdutos();

      responseNomeDeProdutosEdital.data.results.forEach(produtoEdital => {
        listaNomeDeProdutosEdital.push(
          <Option key={`${produtoEdital.nome}+${produtoEdital.uuid}`}>
            {produtoEdital.nome}
          </Option>
        );
      });

      responseMarcas.data.results.forEach(marca => {
        listaMarcas.push(
          <Option key={`${marca.nome}+${marca.uuid}`}>{marca.nome}</Option>
        );
      });
      responseFabricantes.data.results.forEach(fabricante => {
        listaFabricantes.push(
          <Option key={`${fabricante.nome}+${fabricante.uuid}`}>
            {fabricante.nome}
          </Option>
        );
      });
      this.setState({
        nomeDeProdutosEditalArray: listaNomeDeProdutosEdital,
        marcasArray: listaMarcas,
        fabricantesArray: listaFabricantes,
        loading: false
      });
    }
    if (this.state.protocolosDieta.length === 0) {
      protocolosDieta.forEach(protocolo => {
        listaProtocolos.push(
          <Option key={`${protocolo.nome}+${protocolo.uuid}`}>
            {protocolo.nome}
          </Option>
        );
      });

      this.setState({
        protocolosDieta: listaProtocolos
      });
    }
  };

  extrairUuidString = string => {
    return string.split("+")[1];
  };

  addProtocolo = value => {
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    payloadStep1.protocolos.push(uuid);
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  delProtocolo = value => {
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    const index = payloadStep1.protocolos.indexOf(uuid);
    payloadStep1.protocolos.splice(index, 1);
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaCampoDetalhesDieta = value => {
    let { payloadStep1 } = this.state;
    payloadStep1.detalhes_da_dieta = value;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaCampoDetalheAlergenico = value => {
    let { payloadStep1 } = this.state;
    payloadStep1.aditivos = value;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaNomeProduto = value => {
    let { payloadStep1 } = this.state;
    payloadStep1.nome = value.split("+")[0];
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaNomeComponentes = value => {
    let { payloadStep1 } = this.state;
    payloadStep1.componentes = value.toUpperCase();
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  addMarca = value => {
    this.props.setDefaultMarcaStep1(value);
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    payloadStep1.marca = uuid;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  addFabricante = value => {
    this.props.setDefaultFabricanteStep1(value);
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    payloadStep1.fabricante = uuid;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  render() {
    const {
      protocolosDieta,
      nomeDeProdutosEditalArray,
      marcasArray,
      fabricantesArray,
      showModalMarca,
      showModalFabricante,
      loadingDefault,
      dafaultArrayProtocolo
    } = this.state;
    const {
      renderizaFormDietaEspecial,
      renderizaFormAlergenicos,
      defaultNomeDeProdutosEditalStep1,
      defaultMarcaStep1,
      defaultFabricanteStep1
    } = this.props;
    return (
      <div className="cadastro-produto-step1">
        <div className="card-title">Identificação do Produto</div>
        <div className="link-with-student">
          <div className="label">
            <span className="required-asterisk">*</span>O produto se destina ao
            atendimento de alunos com dieta especial?
          </div>
          <div className="row">
            <div className="col-3">
              <label className="container-radio">
                Sim
                <Field
                  component={"input"}
                  type="radio"
                  value="1"
                  name="eh_para_alunos_com_dieta"
                  onClick={() => {
                    this.abreOuFechaFormDietaEspecial(1);
                  }}
                  required
                />
                <span className="checkmark" />
              </label>
            </div>
            <div className="col-3">
              <label className="container-radio">
                Não
                <Field
                  component={"input"}
                  type="radio"
                  value="0"
                  name="eh_para_alunos_com_dieta"
                  onClick={() => {
                    this.abreOuFechaFormDietaEspecial(0);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        {renderizaFormDietaEspecial && (
          <Fragment>
            <div className="row">
              <div className="col-6 pt-3">
                <label className="label-formulario-produto">
                  <nav>*</nav>Nome do protocolo de Dieta Especial
                </label>
                <Field
                  component={ASelect}
                  className={"select-form-produto"}
                  mode="multiple"
                  name="protocolos"
                  placeholder="Digite o nome do protocolo"
                  onSelect={this.addProtocolo}
                  onDeselect={this.delProtocolo}
                  defaultValue={dafaultArrayProtocolo}
                >
                  {protocolosDieta}
                </Field>
              </div>
            </div>
          </Fragment>
        )}

        <div className="row">
          <div className="col-12 pt-3">
            <label className="label-formulario-produto">
              <nav>*</nav>Nome do produto
            </label>
            <Field
              component={ASelect}
              className={"select-form-produto"}
              showSearch
              name="nome"
              filterOption={(inputValue, option) => {
                return option.props.children
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
              onSelect={this.setaNomeProduto}
              defaultValue={defaultNomeDeProdutosEditalStep1}
              validate={required}
            >
              {nomeDeProdutosEditalArray}
            </Field>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-4">
            <label className="label-formulario-produto">
              <nav>*</nav>Marca do produto
            </label>
            <Field
              component={ASelect}
              className={"select-form-produto"}
              showSearch
              name="marca"
              onSelect={this.addMarca}
              defaultValue={defaultMarcaStep1}
            >
              {marcasArray}
            </Field>
          </div>
          <div className="col-2 adicionar-marca-fornecedor">
            <Botao
              texto="Adicionar"
              className={"botao-adicionar-marca-fabricante"}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.BLUE_OUTLINE}
              onClick={() => {
                this.showModalMarca();
              }}
            />
          </div>
          <div className="col-4">
            <label className="label-formulario-produto">
              <nav>*</nav>Nome do fabricante
            </label>
            <Field
              component={ASelect}
              className={"select-form-produto"}
              showSearch
              name="fabricante"
              onSelect={this.addFabricante}
              defaultValue={defaultFabricanteStep1}
            >
              {fabricantesArray}
            </Field>
          </div>
          <div className="col-2 adicionar-marca-fornecedor">
            <Botao
              texto="Adicionar"
              className={"botao-adicionar-marca-fabricante"}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.BLUE_OUTLINE}
              onClick={() => {
                this.showModalFabricante();
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3">
            <Field
              component={TextArea}
              label="Nome dos componentes do produto"
              name="componentes"
              type="text"
              validate={[required, maxLength5000]}
              required
              onChange={event => {
                this.setaNomeComponentes(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="link-with-student">
          <div className="label">
            <span className="required-asterisk">*</span>O produto contém ou pode
            conter ingredientes/aditivos alergênicos?
          </div>

          <div className="row">
            <div className="col-3">
              <label className="container-radio">
                Sim
                <Field
                  component={"input"}
                  type="radio"
                  value="1"
                  name="tem_aditivos_alergenicos"
                  onClick={() => {
                    this.abreOuFechaFormAlergenico(1);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
            <div className="col-3">
              <label className="container-radio">
                Não
                <Field
                  component={"input"}
                  type="radio"
                  value="0"
                  name="tem_aditivos_alergenicos"
                  onClick={() => {
                    this.abreOuFechaFormAlergenico(0);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>

          {renderizaFormAlergenicos && (
            <div className="row">
              <div className="col-12 pb-5">
                <Field
                  component={TextArea}
                  label={"Quais?"}
                  name="aditivos"
                  onChange={event => {
                    this.setaCampoDetalheAlergenico(event.target.value);
                  }}
                  required
                />
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-5">
            <div className="card-warning mt-3">
              <strong>IMPORTANTE:</strong> Relacioná-los conforme dispõe a RDC
              nº 26 de 02/07/15
            </div>
          </div>
        </div>
        <ModalMarca
          visible={showModalMarca}
          loading={loadingDefault}
          closeModal={this.closeModalMarca}
          onSubmit={this.enviaMarca}
        />
        <ModalFabricante
          visible={showModalFabricante}
          loading={loadingDefault}
          closeModal={this.closeModalFabricante}
          onSubmit={this.enviaFabricante}
        />
      </div>
    );
  }
}

export default Step1;
