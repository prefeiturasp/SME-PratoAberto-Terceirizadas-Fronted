import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Field, reduxForm } from "redux-form";
import InputText from "../Shareable/Input/InputText";
import "./style.scss";
import { Botao } from "../Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE
} from "../Shareable/Botao/constants";
import { getDadosUsuarioEOL } from "../../services/permissoes.service";
import { meusDados } from "../../services/perfil.service";
import {
  toastError,
  toastSuccess,
  toastWarn
} from "../Shareable/Toast/dialogs";
import { stringSeparadaPorVirgulas } from "../../helpers/utilities";
import { TAMANHO_RF } from "../../constants/fields.constants";

class Permissoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minhaInstituicao: null,
      perfisEOL: null,
      registroFuncional: null,
      equipeAdministradora: [],
      bloquearBotao: false
    };
    this.permitir = this.permitir.bind(this);
  }

  componentDidMount() {
    meusDados().then(response => {
      this.setState({ minhaInstituicao: response.vinculo_atual.instituicao });
      this.setEquipeAdministradora();
    });
  }

  async setEquipeAdministradora() {
    const { minhaInstituicao } = this.state;
    const { getEquipeAdministradora } = this.props;
    const equipeAdministradora = await getEquipeAdministradora(
      minhaInstituicao.uuid
    );
    this.setState({
      equipeAdministradora: equipeAdministradora.data
    });
  }

  filterList(registroFuncional) {
    if (registroFuncional.length === TAMANHO_RF) {
      getDadosUsuarioEOL(registroFuncional).then(response => {
        if (response.data.length > 0) {
          this.setState({ registroFuncional, perfisEOL: response.data });
        } else {
          toastWarn("Usuário não encontrado");
        }
      });
    } else {
      this.setState({
        registroFuncional: null,
        perfisEOL: null
      });
    }
  }

  permitir() {
    const { minhaInstituicao, perfisEOL, registroFuncional } = this.state;
    const { criarEquipeAdministradora } = this.props;
    let mesmaInstituicao = false;
    perfisEOL.forEach(perfilEOL => {
      if (minhaInstituicao.nome.includes(perfilEOL.divisao)) {
        mesmaInstituicao = true;
      }
    });
    if (mesmaInstituicao) {
      this.setState({ bloquearBotao: true });
      criarEquipeAdministradora(minhaInstituicao.uuid, registroFuncional)
        .then(response => {
          if (response.status === HTTP_STATUS.OK) {
            toastSuccess("Permissão realizada com sucesso");
            this.setEquipeAdministradora();
            this.props.change("registro_funcional", "");
            this.setState({ perfisEOL: null, bloquearBotao: false });
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            this.setState({ perfisEOL: null, bloquearBotao: false });
            toastError(response.data.detail);
          }
        })
        .catch(() => {
          this.setState({ perfisEOL: null, bloquearBotao: false });
          toastError("Erro ao permitir usuário");
        });
    } else {
      toastError(
        `Usuário pertence a(s) instituição(ões) ${stringSeparadaPorVirgulas(
          perfisEOL,
          "divisao"
        )}`
      );
    }
  }

  excluir(permissaoUuid) {
    const { finalizarVinculo } = this.props;
    if (window.confirm("Deseja realmente finalizar essa permissão?")) {
      const { minhaInstituicao } = this.state;
      finalizarVinculo(minhaInstituicao.uuid, permissaoUuid).then(response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Vínculo finalizado com sucesso!");
          this.setEquipeAdministradora();
        }
      });
    }
  }

  render() {
    const {
      equipeAdministradora,
      perfisEOL,
      registroFuncional,
      bloquearBotao
    } = this.state;
    const { handleSubmit } = this.props;
    return (
      <div className="permissions">
        <form onSubmit={handleSubmit(this.props.handleSubmit)}>
          <div className="card">
            <div className="card-body">
              <h2>Atribuição de Perfil: Individual</h2>
              <div className="row">
                <div className="col-6 pt-3">
                  <Field
                    component={InputText}
                    name="registro_funcional"
                    type="number"
                    placeholder="Pesquisar Código RF"
                    onChange={event => this.filterList(event.target.value)}
                    className="form-control"
                    icone={`${BUTTON_ICON.SEARCH} fa-lg`}
                  />
                </div>
              </div>
              {perfisEOL && perfisEOL.length > 0 && (
                <div className="row search-result">
                  <div className="col-2 align-self-center">
                    <p className="rf">{registroFuncional}</p>
                  </div>
                  <div className="col-3 align-self-center">
                    <p>{perfisEOL[0].nm_pessoa}</p>
                  </div>
                  <div className="col-5 align-self-center">
                    <p>{stringSeparadaPorVirgulas(perfisEOL, "divisao")}</p>
                  </div>
                  <div className="col-2 align-self-center">
                    <Botao
                      texto="Permitir"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      type={BUTTON_TYPE.BUTTON}
                      onClick={this.permitir}
                      disabled={bloquearBotao}
                    />
                  </div>
                </div>
              )}
              <div className="table-users">
                <div className="row titles">
                  <div className="col-3">Código RF</div>
                  <div className="col-9">Nome</div>
                </div>
                {equipeAdministradora.length > 0 &&
                  equipeAdministradora.map((vinculo, key) => {
                    return (
                      <div key={key} className="row values">
                        <div className="col-3">
                          {vinculo.usuario.registro_funcional}
                        </div>
                        <div className="col-8">{vinculo.usuario.nome}</div>
                        <div className="col-1 trash">
                          <i
                            onClick={() => this.excluir(vinculo.uuid)}
                            className="fas fa-trash"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const PermissoesForm = reduxForm({
  form: "permissoes",
  enableReinitialize: true
})(Permissoes);

export default PermissoesForm;