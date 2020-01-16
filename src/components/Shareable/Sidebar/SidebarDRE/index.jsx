import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  DRE,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_PENDENTES,
  SOLICITACOES_RECUSADAS,
  SOLICITACOES_CANCELADAS,
  RELATORIOS
} from "../../../../configs/constants";
import { PERFIL } from "../../../../constants";

export class SidebarDRE extends Component {
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

  render() {
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
            <NavLink activeClassName="active" className="collapse-item" to="/">
              Painel de Solicitações
            </NavLink>
            <NavLink
              onClick={() => this.onSubmenuClick("novas-solicitacoes")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Novas Solicitações
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "novas-solicitacoes" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${DRE}/${SOLICITACAO_KIT_LANCHE_UNIFICADA}`}
                >
                  Solicitação Unificada
                </NavLink>
              </div>
            )}
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
                  to={`/${DRE}/${SOLICITACOES_PENDENTES}`}
                >
                  Aguardando autorização
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${DRE}/${SOLICITACOES_AUTORIZADAS}`}
                >
                  Autorizadas
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${DRE}/${SOLICITACOES_RECUSADAS}`}
                >
                  Negadas
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to={`/${DRE}/${SOLICITACOES_CANCELADAS}`}
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
              to={`/`}
            >
              Consulta Dieta de Alunos
            </NavLink>
          </div>
        </div>
      </li>,
      <li key={3} className="nav-item">
        <NavLink className={`nav-link collapsed`} to={`/${RELATORIOS}/`}>
          <i className="fas fa-file-alt" />
          <span>Relatórios</span>
        </NavLink>
      </li>,
      [PERFIL.SUPLENTE, PERFIL.COGESTOR].includes(
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
}
