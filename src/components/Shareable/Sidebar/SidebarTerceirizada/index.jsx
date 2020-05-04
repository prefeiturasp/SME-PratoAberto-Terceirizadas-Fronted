import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  TERCEIRIZADA,
  RELATORIOS,
  SOLICITACOES_PENDENTES,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_NEGADAS,
  GESTAO_PRODUTO,
  SOLICITACOES_HOMOLOGADAS,
  SOLICITACOES_NAO_HOMOLOGADAS,
  SOLICITACOES_AGUARDANDO_ANALISE_SENSORIAL
} from "../../../../configs/constants";
import { PERFIL } from "../../../../constants/shared";

export class SidebarTerceirizada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subMenu: ""
    };
  }

  onSubmenuClick(submenu) {
    let subMenu = this.state.subMenu;
    subMenu = subMenu === submenu ? "" : submenu;
    this.setState({ subMenu });
  }

  renderTerceirizada() {
    const { subMenu } = this.state;
    return [
      <li key={0} className="nav-item">
        <NavLink className={`nav-link collapsed`} to="/">
          <i className="fas fa-file-alt" />
          <span>Painel Inicial</span>
        </NavLink>
      </li>,
      <li key={1} className="nav-item">
        <Link
          className={`nav-link collapsed`}
          href="#teste"
          data-toggle="collapse"
          data-target="#collapseGestaoAlimentacao"
          aria-expanded="false"
          aria-controls="collapseOne"
        >
          <i className="fas fa-utensils" />
          <span>Gestão de Alimentação</span>
        </Link>
        <div
          id="collapseGestaoAlimentacao"
          className={`collapse`}
          aria-labelledby="headingConfig"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/painel-gestao-alimentacao"
            >
              Painel de Solicitações
            </NavLink>
            <NavLink
              onClick={() => this.onSubmenuClick("consulta-solicitacoes")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Consulta de Solicitações
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "consulta-solicitacoes" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${TERCEIRIZADA}/${SOLICITACOES_PENDENTES}`}
                >
                  Aguardando autorização
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${TERCEIRIZADA}/${SOLICITACOES_AUTORIZADAS}`}
                >
                  Autorizadas
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${TERCEIRIZADA}/${SOLICITACOES_NEGADAS}`}
                >
                  Negadas
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${TERCEIRIZADA}/${SOLICITACOES_CANCELADAS}`}
                >
                  Canceladas
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </li>,
      <li key={2} className="nav-item">
        <Link
          className={`nav-link collapsed`}
          href="#teste"
          data-toggle="collapse"
          data-target="#collapseDietaEspecial"
          aria-expanded="false"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-carrot" />
          <span>Dieta Especial</span>
        </Link>
        <div
          id="collapseDietaEspecial"
          className={`collapse`}
          aria-labelledby="headingConfig"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/painel-dieta-especial`}
            >
              Consulta Dieta de Alunos
            </NavLink>
          </div>
        </div>
      </li>,
      <li key={3} className="nav-item">
        <Link
          className={`nav-link collapsed`}
          href="#teste"
          data-toggle="collapse"
          data-target="#collapsePD"
          aria-expanded="false"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-atom" />
          <span>{"Gestão de Produto"}</span>
        </Link>
        <div
          id="collapsePD"
          className={`collapse`}
          aria-labelledby="headingConfig"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/painel-gestao-produto`}
            >
              Painel Inicial
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/pesquisa-desenvolvimento/produto`}
            >
              Cadastro de Produto
            </NavLink>
            <NavLink
              onClick={() => this.onSubmenuClick("consulta-solicitacoes-gp")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Consulta de Solicitações
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "consulta-solicitacoes-gp" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${GESTAO_PRODUTO}/${SOLICITACOES_AGUARDANDO_ANALISE_SENSORIAL}`}
                >
                  Aguardando análise sensorial
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${GESTAO_PRODUTO}/${SOLICITACOES_HOMOLOGADAS}`}
                >
                  Homologados
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${GESTAO_PRODUTO}/${SOLICITACOES_NAO_HOMOLOGADAS}`}
                >
                  Não homologados
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </li>,
      <li key={4} className="nav-item">
        <NavLink className={`nav-link collapsed`} to={`/${RELATORIOS}/`}>
          <i className="fas fa-file-alt" />
          <span>Relatórios</span>
        </NavLink>
      </li>,
      [PERFIL.NUTRI_ADMIN_RESPONSAVEL].includes(
        localStorage.getItem("perfil")
      ) && (
        <li key={4} className="nav-item">
          <Link
            className={`nav-link collapsed`}
            href="#teste"
            data-toggle="collapse"
            data-target="#collapseConfig"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-cog" />
            <span>Configurações</span>
          </Link>
          <div
            id="collapseConfig"
            className={`collapse`}
            aria-labelledby="headingConfig"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <NavLink
                activeClassName="active"
                className="collapse-item"
                to="/configuracoes/permissoes"
              >
                Permissões
              </NavLink>
            </div>
          </div>
        </li>
      )
    ];
  }

  render() {
    return this.renderTerceirizada();
  }
}
