import React from "react";
import { Field, reduxForm } from "redux-form";
import { ASelect } from "../../../../Shareable/MakeField";
import InputText from "components/Shareable/Input/InputText";
import {
  maxLength,
  required,
  requiredMultiselect
} from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";

import "./styles.scss";
import { TextArea } from "components/Shareable/TextArea/TextArea";

const maxLength5000 = maxLength(5000);

class WizardFormPrimeiraPagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retificou: false,
      checkDieta: false,
      produtoForm: null,
      protocoloDietas: null,
      completo: false
    };
  }

  componentDidMount() {
    const { produto } = this.props;
    this.setState({ produtoForm: produto });
  }

  componentDidUpdate() {
    const { retificou, produtoForm, completo } = this.state;
    const {
      change,
      protocolos,
      primeiroStep,
      valoresPrimeiroForm
    } = this.props;
    if (produtoForm !== null && !retificou && !primeiroStep) {
      if (produtoForm.eh_para_alunos_com_dieta) {
        change("eh_para_alunos_com_dieta", "1");
      } else {
        change("eh_para_alunos_com_dieta", "0");
      }

      if (produtoForm.tem_aditivos_alergenicos) {
        change("tem_aditivos_alergenicos", "1");
      } else {
        change("tem_aditivos_alergenicos", "0");
      }

      if (!primeiroStep) {
        change("protocolos", protocolos);
      }
      change("aditivos", produtoForm.aditivos);
      change("nome", produtoForm.nome);
      change("componentes", produtoForm.componentes);
      change("marca", produtoForm.marca.uuid);
      change("fabricante", produtoForm.fabricante.uuid);

      if (produtoForm.eh_para_alunos_com_dieta && !retificou) {
        this.setState({ checkDieta: true, retificou: true });
      } else if (!retificou) {
        this.setState({ retificou: true });
      }
    }
    if (primeiroStep && !completo && valoresPrimeiroForm !== null) {
      if (valoresPrimeiroForm.eh_para_alunos_com_dieta) {
        change("eh_para_alunos_com_dieta", "1");
      } else {
        change("eh_para_alunos_com_dieta", "0");
      }

      if (valoresPrimeiroForm.tem_aditivos_alergenicos) {
        change("tem_aditivos_alergenicos", "1");
      } else {
        change("tem_aditivos_alergenicos", "0");
      }

      change("protocolos", valoresPrimeiroForm.protocolos);
      change("aditivos", valoresPrimeiroForm.aditivos);

      change("nome", valoresPrimeiroForm.nome);
      change("componentes", valoresPrimeiroForm.componentes);
      change("marca", valoresPrimeiroForm.marca);
      change("fabricante", valoresPrimeiroForm.fabricante);

      if (produtoForm.eh_para_alunos_com_dieta && !retificou) {
        this.setState({ checkDieta: true, retificou: true });
      } else if (!retificou) {
        this.setState({ retificou: true });
      }

      this.setState({ completo: true });
    }
  }

  dietaEspecialCheck = valor => {
    let { produtoForm } = this.state;
    const { change } = this.props;
    produtoForm.eh_para_alunos_com_dieta = valor === "1" ? true : false;
    if (valor === "0") {
      this.setState({ produtoForm });
      change("protocolos", []);
      this.props.limpaProtocolos();
    } else if (valor === "1") {
      this.setState({ produtoForm });
    }
  };

  alergenicosCheck = valor => {
    let { produtoForm } = this.state;
    const { change } = this.props;
    produtoForm.tem_aditivos_alergenicos = valor === "1" ? true : false;
    if (valor === "0") {
      this.setState({ produtoForm });
      change("aditivos", null);
    } else if (valor === "1") {
      this.setState({ produtoForm });
    }
  };

  render() {
    const {
      handleSubmit,
      arrayProtocolos,
      arrayMarcas,
      arrayFabricantes,
      valuesForm
    } = this.props;
    const { produtoForm } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <section className="identificacao-produto">
          <header>Identificação do Produto</header>

          <section className="dieta-especial-form">
            <article>
              <label className="label-formulario-produto">
                <span>*</span>O produto se destina ao atendimento de alunos com
                dieta especial?
              </label>
              <div className="checks">
                <label className="container-radio">
                  Sim
                  <Field
                    component={"input"}
                    type="radio"
                    value="1"
                    name="eh_para_alunos_com_dieta"
                    onClick={() => {
                      this.dietaEspecialCheck("1");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
                <label className="container-radio">
                  Não
                  <Field
                    component={"input"}
                    type="radio"
                    value="0"
                    name="eh_para_alunos_com_dieta"
                    onClick={() => {
                      this.dietaEspecialCheck("0");
                    }}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </article>

            {produtoForm !== null && produtoForm.eh_para_alunos_com_dieta && (
              <article>
                <label className="label-formulario-produto">
                  Nome do protocolo de dieta especial
                </label>
                <Field
                  component={ASelect}
                  showSearch
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  mode="multiple"
                  name="protocolos"
                  validate={requiredMultiselect}
                >
                  {arrayProtocolos}
                </Field>
              </article>
            )}
          </section>

          <div className="section-produto-nome">
            <Field
              component={InputText}
              label="Nome do produto"
              name="nome"
              type="text"
              placeholder="Digite o nome do produto"
              required
              validate={required}
            />
          </div>

          <section className="section-marca-fabricante-produto">
            <div>
              <label className="label-formulario-produto">
                <nav>*</nav>Marca do produto
              </label>
              <Field
                component={ASelect}
                className={"select-form-produto"}
                showSearch
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toString()
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                name="marca"
              >
                {arrayMarcas}
              </Field>
            </div>

            <div>
              <label className="label-formulario-produto">
                <nav>*</nav>Nome do fabricante
              </label>
              <Field
                component={ASelect}
                className={"select-form-produto"}
                showSearch
                name="fabricante"
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toString()
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
              >
                {arrayFabricantes}
              </Field>
            </div>
          </section>

          <div className="componentes-do-produto">
            <Field
              component={TextArea}
              label="Nome dos componentes do produto"
              name="componentes"
              type="text"
              validate={[required, maxLength5000]}
              required
            />
          </div>

          <section className="componentes-alergenicos">
            <article>
              <label className="label-formulario-produto">
                <span>*</span>O produto contém ou pode conter
                ingredientes/aditivos alergênicos?
              </label>
              <div className="checks">
                <label className="container-radio">
                  Sim
                  <Field
                    component={"input"}
                    type="radio"
                    value="1"
                    name="tem_aditivos_alergenicos"
                    onClick={() => {
                      this.alergenicosCheck("1");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
                <label className="container-radio">
                  Não
                  <Field
                    component={"input"}
                    type="radio"
                    value="0"
                    name="tem_aditivos_alergenicos"
                    onClick={() => {
                      this.alergenicosCheck("0");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </article>
            {produtoForm !== null && produtoForm.tem_aditivos_alergenicos && (
              <article>
                <Field
                  component={TextArea}
                  className="field-aditivos"
                  label={"Quais?"}
                  name="aditivos"
                  required
                />
              </article>
            )}
          </section>
        </section>

        <section className="rodape-botoes-acao">
          <Botao
            texto={"Próximo"}
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => {
              this.props.passouPrimeiroStep(valuesForm, produtoForm);
            }}
          />
        </section>
      </form>
    );
  }
}

export default reduxForm({
  form: "atualizacaoProduto",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(WizardFormPrimeiraPagina);
