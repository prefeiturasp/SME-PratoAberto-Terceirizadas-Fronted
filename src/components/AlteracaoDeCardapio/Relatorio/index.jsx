import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Botao } from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import { reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { getAlteracaoCardapio } from "../../../services/alteracaoDecardapio.service";
import { visualizaBotoesDoFluxo } from "../../../helpers/utilities";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import { prazoDoPedidoMensagem } from "../../../helpers/utilities";
import { toastSuccess, toastError } from "../../Shareable/Toast/dialogs";
import { TIPO_PERFIL } from "../../../constants";
import { statusEnum } from "../../../constants";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      showNaoAprovaModal: false,
      showModal: false,
      alteracaoDecardapio: null,
      prazoDoPedidoMensagem: null,
      resposta_sim_nao: null
    };
    this.closeQuestionamentoModal = this.closeQuestionamentoModal.bind(this);
    this.closeNaoAprovaModal = this.closeNaoAprovaModal.bind(this);
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      getAlteracaoCardapio(uuid).then(response => {
        this.setState({
          alteracaoDeCardapio: response,
          uuid,
          prazoDoPedidoMensagem: prazoDoPedidoMensagem(response.data_inicial)
        });
      });
    }
  }

  showQuestionamentoModal(resposta_sim_nao) {
    this.setState({ resposta_sim_nao, showQuestionamentoModal: true });
  }

  closeQuestionamentoModal() {
    this.setState({ showQuestionamentoModal: false });
  }

  showNaoAprovaModal(resposta_sim_nao) {
    this.setState({ resposta_sim_nao, showNaoAprovaModal: true });
  }

  closeNaoAprovaModal() {
    this.setState({ showNaoAprovaModal: false });
  }

  loadSolicitacao(uuid) {
    getAlteracaoCardapio(uuid).then(response => {
      this.setState({
        alteracaoDeCardapio: response
      });
    });
  }

  handleSubmit() {
    const { toastAprovaMensagem, toastAprovaMensagemErro } = this.props;
    const uuid = this.state.uuid;
    this.props.endpointAprovaSolicitacao(uuid).then(
      response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          this.loadSolicitacao(uuid);
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(toastAprovaMensagemErro);
        }
      },
      function() {
        toastError(toastAprovaMensagemErro);
      }
    );
  }

  render() {
    const {
      resposta_sim_nao,
      showNaoAprovaModal,
      alteracaoDeCardapio,
      prazoDoPedidoMensagem,
      showQuestionamentoModal,
      uuid
    } = this.state;
    const {
      justificativa,
      textoBotaoNaoAprova,
      textoBotaoAprova,
      endpointNaoAprovaSolicitacao,
      endpointQuestionamento,
      ModalNaoAprova,
      ModalQuestionamento
    } = this.props;
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    const EXIBIR_BOTAO_NAO_APROVAR =
      tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
      (alteracaoDeCardapio &&
        alteracaoDeCardapio.foi_solicitado_fora_do_prazo &&
        alteracaoDeCardapio.status === statusEnum.CODAE_QUESTIONADO &&
        textoBotaoNaoAprova);
    const EXIBIR_BOTAO_APROVAR =
      (![
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA
      ].includes(tipoPerfil) &&
        textoBotaoAprova) ||
      (alteracaoDeCardapio &&
        (!alteracaoDeCardapio.foi_solicitado_fora_do_prazo ||
          [
            statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
            statusEnum.CODAE_AUTORIZADO
          ].includes(alteracaoDeCardapio.status)) &&
        textoBotaoAprova);
    const EXIBIR_BOTAO_QUESTIONAMENTO =
      [
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA
      ].includes(tipoPerfil) &&
      alteracaoDeCardapio &&
      alteracaoDeCardapio.foi_solicitado_fora_do_prazo &&
      [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
        alteracaoDeCardapio.status
      );
    return (
      <div>
        {ModalNaoAprova && (
          <ModalNaoAprova
            showModal={showNaoAprovaModal}
            closeModal={this.closeNaoAprovaModal}
            endpoint={endpointNaoAprovaSolicitacao}
            solicitacao={alteracaoDeCardapio}
            loadSolicitacao={this.loadSolicitacao}
            justificativa={justificativa}
            resposta_sim_nao={resposta_sim_nao}
            uuid={uuid}
          />
        )}
        {ModalQuestionamento && (
          <ModalQuestionamento
            closeModal={this.closeQuestionamentoModal}
            showModal={showQuestionamentoModal}
            justificativa={justificativa}
            uuid={uuid}
            loadSolicitacao={this.loadSolicitacao}
            resposta_sim_nao={resposta_sim_nao}
            endpoint={endpointQuestionamento}
          />
        )}
        {!alteracaoDeCardapio ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            <span className="page-title">{`Alteração de Cardápio - Solicitação # ${
              alteracaoDeCardapio.id_externo
            }`}</span>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  alteracaoDeCardapio={alteracaoDeCardapio}
                  prazoDoPedidoMensagem={prazoDoPedidoMensagem}
                />
                <RelatorioHistoricoQuestionamento
                  solicitacao={alteracaoDeCardapio}
                />
                {visualizaBotoesDoFluxo(alteracaoDeCardapio) && (
                  <div className="form-group row float-right mt-4">
                    {EXIBIR_BOTAO_NAO_APROVAR && (
                      <Botao
                        texto={textoBotaoNaoAprova}
                        className="ml-3"
                        onClick={() => this.showNaoAprovaModal("Não")}
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    )}
                    {EXIBIR_BOTAO_APROVAR && (
                      <Botao
                        texto={textoBotaoAprova}
                        type={BUTTON_TYPE.SUBMIT}
                        onClick={() => this.handleSubmit()}
                        style={BUTTON_STYLE.GREEN}
                        className="ml-3"
                      />
                    )}
                    {EXIBIR_BOTAO_QUESTIONAMENTO && (
                      <Botao
                        texto={
                          tipoPerfil ===
                          TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
                            ? "Questionar"
                            : "Sim"
                        }
                        type={BUTTON_TYPE.SUBMIT}
                        onClick={() => this.showQuestionamentoModal("Sim")}
                        style={BUTTON_STYLE.GREEN}
                        className="ml-3"
                      />
                    )}
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

const formName = "relatorioAlteracaoDeCardapio";
const RelatorioForm = reduxForm({
  form: formName,
  enableReinitialize: true
})(Relatorio);

const selector = formValueSelector(formName);

const mapStateToProps = state => {
  return {
    justificativa: selector(state, "justificativa"),
    motivo_cancelamento: selector(state, "motivo_cancelamento")
  };
};

export default connect(mapStateToProps)(RelatorioForm);
