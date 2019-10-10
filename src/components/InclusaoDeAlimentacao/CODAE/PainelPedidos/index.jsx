import React, { Component } from "react";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";
import { FiltroEnum } from "../../../../constants/filtroEnum";
import { Select } from "../../../Shareable/Select";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { formatarPedidos } from "./helper";
import {
  getCodaePedidosPrioritarios as prioritariosContinuo,
  getCodaePedidosNoPrazoLimite as limitesContinuo,
  getCodaePedidosNoPrazoRegular as regularesContinuo
} from "../../../../services/inclusaoDeAlimentacaoContinua.service";
import {
  getCodaePedidosPrioritarios as prioritariosAvulso,
  getCodaePedidosNoPrazoLimite as limitesAvulso,
  getCodaePedidosNoPrazoRegular as regularesAvulso
} from "../../../../services/inclusaoDeAlimentacaoAvulsa.service";
import CardHistorico from "../../components/CardHistorico";
import { CODAE } from "../../../../configs/constants";
import { dataAtualDDMMYYYY } from "../../../../helpers/utilities";
import { TIPODECARD } from "../../../../constants/cardsPrazo.constants";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidosCarregados: 0,
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: []
    };
  }

  filtrar(filtro) {
    let pedidosPrioritarios = [];
    let pedidosNoPrazoLimite = [];
    let pedidosNoPrazoRegular = [];
    this.setState({ pedidosCarregados: 0 });
    prioritariosContinuo(filtro).then(response => {
      pedidosPrioritarios = pedidosPrioritarios.concat(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    prioritariosAvulso(filtro).then(response => {
      pedidosPrioritarios = pedidosPrioritarios.concat(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    limitesContinuo(filtro).then(response => {
      pedidosNoPrazoLimite = pedidosNoPrazoLimite.concat(response.results);
      this.setState({
        pedidosNoPrazoLimite,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    limitesAvulso(filtro).then(response => {
      pedidosNoPrazoLimite = pedidosNoPrazoLimite.concat(response.results);
      this.setState({
        pedidosNoPrazoLimite,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    regularesContinuo(filtro).then(response => {
      pedidosNoPrazoRegular = pedidosNoPrazoRegular.concat(response.results);
      this.setState({
        pedidosNoPrazoRegular,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    regularesAvulso(filtro).then(response => {
      pedidosNoPrazoRegular = pedidosNoPrazoRegular.concat(response.results);
      this.setState({
        pedidosNoPrazoRegular,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });
  }

  componentDidMount() {
    this.filtrar(FiltroEnum.SEM_FILTRO);
  }

  onFiltroSelected(value) {
    switch (value) {
      case FiltroEnum.HOJE:
        this.filtrarHoje();
        break;
      default:
        this.filtrar(value);
        break;
    }
  }

  filtrarHoje() {
    let pedidosPrioritarios = [];
    this.setState({ pedidosCarregados: 4 });
    prioritariosContinuo(FiltroEnum.HOJE).then(response => {
      pedidosPrioritarios = pedidosPrioritarios.concat(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });

    prioritariosAvulso(FiltroEnum.HOJE).then(response => {
      pedidosPrioritarios = pedidosPrioritarios.concat(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosCarregados: this.state.pedidosCarregados + 1
      });
    });
  }

  render() {
    const {
      pedidosCarregados,
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular
    } = this.state;
    const {
      visaoPorCombo,
      valorDoFiltro,
      pedidosAprovados,
      pedidosReprovados
    } = this.props;
    const todosOsPedidosForamCarregados = pedidosCarregados === 6;
    return (
      <div>
        {!todosOsPedidosForamCarregados ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-3 font-10 my-auto">
                    Data: {dataAtualDDMMYYYY()}
                  </div>
                  <div className="offset-6 col-3 text-right">
                    <Field
                      component={Select}
                      name="visao_por"
                      naoDesabilitarPrimeiraOpcao
                      onChange={event =>
                        this.onFiltroSelected(event.target.value)
                      }
                      placeholder={"Filtro por"}
                      options={visaoPorCombo}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-12">
                    <CardPendenteAcao
                      titulo={
                        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                      }
                      tipoDeCard={TIPODECARD.PRIORIDADE}
                      pedidos={pedidosPrioritarios}
                      ultimaColunaLabel={"Data da Inclusão"}
                      parametroURL={CODAE}
                    />
                  </div>
                </div>
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo limite"}
                        tipoDeCard={TIPODECARD.NO_LIMITE}
                        pedidos={pedidosNoPrazoLimite}
                        ultimaColunaLabel={"Data da Inclusão"}
                        parametroURL={CODAE}
                      />
                    </div>
                  </div>
                )}
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo regular"}
                        tipoDeCard={TIPODECARD.REGULAR}
                        pedidos={pedidosNoPrazoRegular}
                        ultimaColunaLabel={"Data da Inclusão"}
                        parametroURL={CODAE}
                      />
                    </div>
                  </div>
                )}
                {pedidosAprovados.length > 0 && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardHistorico
                        pedidos={formatarPedidos(pedidosAprovados)}
                        ultimaColunaLabel={"Data(s)"}
                        titulo={
                          "Histórico de Inclusões de Alimentação Autorizadas"
                        }
                        parametroURL={CODAE}
                      />
                    </div>
                  </div>
                )}
                {pedidosReprovados.length > 0 && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardHistorico
                        pedidos={formatarPedidos(pedidosReprovados)}
                        ultimaColunaLabel={"Data(s)"}
                        parametroURL={CODAE}
                        titulo={
                          "Histórico de Inclusões de Alimentação Reprovadas"
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const PainelPedidosForm = reduxForm({
  form: "painelPedidos",
  enableReinitialize: true
})(PainelPedidos);
const selector = formValueSelector("painelPedidos");
const mapStateToProps = state => {
  return {
    valorDoFiltro: selector(state, "visao_por")
  };
};

export default connect(mapStateToProps)(PainelPedidosForm);
