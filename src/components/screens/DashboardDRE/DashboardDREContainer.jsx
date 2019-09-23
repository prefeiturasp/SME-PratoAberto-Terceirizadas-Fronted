import React, { Component } from "react";
import DashboardDRE from "./DashboardDRE";
import {
  getSolicitacoesAutorizadasPelaDRE,
  getSolicitacoesPendentesParaDRE,
  getSolicitacoesPendentesDRE,
  getSolicitacoesAutorizadasDRE
} from "../../../services/painelDRE.service";
import { getDiretoriaregionalDetalhe } from "../../../services/diretoriaRegional.service";
import { meusDados as getMeusDados } from "../../../services/perfil.service";
import { getSuspensoesDeAlimentacaoInformadas } from "../../../services/suspensaoDeAlimentacao.service";
import { ajustarFormatoLog, ajustarFormaLotes } from "../helper";

class DashboardDREContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enrolled: 4050,
      autorizadasList: [],
      pendentesList: [],
      recusadasList: [],
      canceladasList: [],
      autorizadasListFiltered: [],
      pendentesListFiltered: [],
      recusadasListFiltered: [],
      canceladasListFiltered: [],
      resumoPendenciasDREAlteracoesDeCardapio: {},
      meusDados: [],
      loadingAutorizadas: true,
      loadingPendentes: true,
      solicitations: [],
      lotesDRE: [],
      quantidade_suspensoes: null,
      vision_by: [
        {
          nome: "Tipo de Solicitação",
          uuid: "tipo_solicitacao"
        },
        {
          nome: "Lote",
          uuid: "lote"
        }
      ],
      filtro_por: [
        {
          nome: "Sem filtro",
          uuid: "sem_filtro"
        },
        {
          nome: "Semana",
          uuid: "daqui_a_7_dias"
        },
        {
          nome: "Mês",
          uuid: "daqui_a_30_dias"
        }
      ]
    };
  }

  async componentDidMount() {
    const meusDados = await getMeusDados();
    const dreUuid = meusDados.diretorias_regionais[0].uuid;
    let autorizadas = await getSolicitacoesAutorizadasDRE(dreUuid);
    let pendentes = await getSolicitacoesPendentesDRE(dreUuid);
    const minhaDRE = await getDiretoriaregionalDetalhe(dreUuid);

    const lotesDRE = (await minhaDRE).data.lotes;

    getSuspensoesDeAlimentacaoInformadas().then(response => {
      let quantidade_suspensoes = response.length;
      this.setState({ quantidade_suspensoes });
    });

    autorizadas = ajustarFormatoLog(autorizadas.results);
    pendentes = ajustarFormaLotes(pendentes.results);

    this.setState({
      autorizadasList: autorizadas,
      pendentesList: pendentes,
      autorizadasListFiltered: autorizadas,
      pendentesListFiltered: pendentes,
      meusDados,
      loadingAutorizadas: false,
      loadingPendentes: false,
      enrolled: meusDados.diretorias_regionais[0].quantidade_alunos,
      lotesDRE
    });
  }

  render() {
    return <DashboardDRE {...this.state} />;
  }
}

export default DashboardDREContainer;
