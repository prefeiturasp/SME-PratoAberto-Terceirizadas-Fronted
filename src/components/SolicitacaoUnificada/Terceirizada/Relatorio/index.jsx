import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { reduxForm } from "redux-form";
import { dataParaUTC } from "../../../../helpers/utilities";
import { getDiasUteis } from "../../../../services/diasUteis.service";
import {
  TerceirizadaTomaCienciaSolicitacoUnificada,
  getSolicitacaoUnificada
} from "../../../../services/solicitacaoUnificada.service";
import { meusDados } from "../../../../services/perfil.service";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import { ModalRecusarSolicitacao } from "../../../Shareable/ModalRecusarSolicitacao";
import { prazoDoPedidoMensagem } from "./helper";
import TabelaKits from "./TabelaKits";
import {
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  TERCEIRIZADA
} from "../../../../configs/constants";
import { statusEnum } from "../../../../constants/statusEnum";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "../../../Shareable/Botao/constants";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unifiedSolicitationList: [],
      uuid: null,
      meusDados: { diretorias_regionais: [{ nome: "" }] },
      redirect: false,
      showModal: false,
      ehInclusaoContinua: false,
      solicitacaoUnificada: null,
      prazoDoPedidoMensagem: null
    };
    this.closeModal = this.closeModal.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect: true
    });
  }

  renderizarRedirecionamento = () => {
    if (this.state.redirect) {
      return (
        <Redirect to={`/${TERCEIRIZADA}/${SOLICITACAO_KIT_LANCHE_UNIFICADA}`} />
      );
    }
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    meusDados().then(meusDados => {
      this.setState({ meusDados });
    });
    getDiasUteis().then(response => {
      const proximos_cinco_dias_uteis = dataParaUTC(
        new Date(response.proximos_cinco_dias_uteis)
      );
      const proximos_dois_dias_uteis = dataParaUTC(
        new Date(response.proximos_dois_dias_uteis)
      );
      if (uuid) {
        getSolicitacaoUnificada(uuid).then(response => {
          const solicitacaoUnificada = response.data;
          const data_de = moment(solicitacaoUnificada.data_de, "DD/MM/YYYY");
          const data_para = moment(
            solicitacaoUnificada.data_para,
            "DD/MM/YYYY"
          );
          let dataMaisProxima = data_de;
          if (dataMaisProxima < data_para) {
            dataMaisProxima = data_para;
          }

          this.setState({
            solicitacaoUnificada,
            uuid,
            prazoDoPedidoMensagem: prazoDoPedidoMensagem(
              dataMaisProxima,
              proximos_dois_dias_uteis,
              proximos_cinco_dias_uteis
            )
          });
        });
      }
    });
  }

  showModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
    toastSuccess("Solicitação Unificada negada com sucesso!");
  }

  handleSubmit() {
    const uuid = this.state.uuid;
    TerceirizadaTomaCienciaSolicitacoUnificada(uuid).then(
      response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Ciência da Solicitação Unificada enviada com sucesso!");
          this.setRedirect();
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            "Houve um erro ao enviar ciência da Solicitação Unificada"
          );
        }
      },
      function() {
        toastError("Houve um erro ao enviar ciência da Solicitação Unificada");
      }
    );
  }

  render() {
    const { showModal, solicitacaoUnificada } = this.state;
    return (
      <div>
        {!solicitacaoUnificada ? (
          <span>Carregando...</span>
        ) : (
          <div>
            <span className="page-title">
              Solicitação Unificada # {solicitacaoUnificada.id_externo}
              <Link to={`/${TERCEIRIZADA}/${SOLICITACAO_KIT_LANCHE_UNIFICADA}`}>
                <Botao
                  texto="voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.BLUE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  className="float-right"
                />
              </Link>
            </span>
            <div className="card mt-3">
              <ModalRecusarSolicitacao
                closeModal={this.closeModal}
                showModal={showModal}
              />
              <div className="card-body container-detail">
                {this.renderizarRedirecionamento()}
                <div className="container-title">
                  <div className="identificador">
                    <div># {solicitacaoUnificada.id_externo}</div>
                    <div>ID do PEDIDO</div>
                  </div>
                  <div className="titulo-descricao">
                    <div className="titulo-solicitante-lote">
                      <div>
                        <div className="solicitante">Solicitante</div>
                        <div className="lote">Lote</div>
                      </div>
                      <div>
                        <div className="prop-solicitante">{`DRE ${
                          solicitacaoUnificada.diretoria_regional.nome
                        }`}</div>
                        <div className="prop-lote">
                          {solicitacaoUnificada.lote_nome}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Botao
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.BLUE}
                    icon={BUTTON_ICON.PRINT}
                    className="float-right"
                  />
                </div>

                <hr />
                <FluxoDeStatus
                  tipoDeFluxo="partindoDRE"
                  listaDeStatus={solicitacaoUnificada.logs}
                />
                <hr />

                <div className="descricao-evento">
                  <div className="direita">
                    <div className="descricao-container">
                      <div className="descricao-titulo">Local do passeio</div>
                      <div className="descricao-texto">
                        {solicitacaoUnificada.local}
                      </div>
                    </div>
                  </div>
                  <div className="esquerda">
                    <div className="descricao-container">
                      <div className="descricao-titulo">Data do evento</div>
                      <div className="descricao-observacao">
                        {solicitacaoUnificada.solicitacao_kit_lanche.data}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tabela-escolas header-tabela">
                  <div>Código</div>
                  <div>Unidade Escolar</div>
                  <div>N° de alunos participantes</div>
                  <div>Tempo de passeio</div>
                  <div>Opção desejada</div>
                  <div>N° Total de Kits</div>
                </div>

                <div>
                  {solicitacaoUnificada.escolas_quantidades.map(
                    (escola_quantidade, key) => {
                      return (
                        <TabelaKits
                          key={key}
                          escola_quantidade={escola_quantidade}
                          solicitacaoUnificada={solicitacaoUnificada}
                        />
                      );
                    }
                  )}
                </div>

                <div className="observacoes-solicitacao">
                  <div className="div-topo">
                    <div>
                      <div className="descricao-titulo">
                        N° total de Unidade Escolares beneficiadas
                      </div>
                      <div className="descricao-texto">{`${
                        solicitacaoUnificada.escolas_quantidades.length
                      } Unidades Escolares`}</div>
                    </div>
                    <div className="kits">
                      <div>
                        <div className="descricao-titulo">N° total de Kits</div>
                        <div className="descricao-texto">
                          {solicitacaoUnificada.total_kit_lanche} Kits
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="descricao-titulo">Observações</div>
                    <div
                      className="descricao-texto"
                      dangerouslySetInnerHTML={{
                        __html:
                          solicitacaoUnificada.solicitacao_kit_lanche.descricao
                      }}
                    />
                  </div>
                </div>
                {solicitacaoUnificada.status ===
                  statusEnum.CODAE_AUTORIZADO && (
                  <div className="row">
                    <div className="col-12 text-right">
                      <Botao
                        texto="Ciente"
                        type={BUTTON_TYPE.SUBMIT}
                        onClick={() => this.handleSubmit()}
                        style={BUTTON_STYLE.GREEN}
                        className="ml-3"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const RelatorioForm = reduxForm({
  form: "unifiedSolicitationFilledForm",
  enableReinitialize: true
})(Relatorio);
export default RelatorioForm;
