import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input, AutoComplete } from "antd";
import "./style.scss";

import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getProdutosPorNome,
  getProdutosPorMarca,
  getProdutosPorFabricante
} from "../../../../../services/produto.service";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "../../../../Shareable/Botao/constants";
import Botao from "../../../../Shareable/Botao";

export default class BuscaProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nomesProdutos: null,
      optionsProdutos: [],
      nomesMarcas: null,
      optionsMarcas: null,
      nomesFabricantes: null,
      optionsFabricantes: null,

      resultadosProduto: []
    };
  }

  retornaListaDeNomes = arrayObjetos => {
    let arrayNomes = [];
    arrayObjetos.forEach(objeto => {
      arrayNomes.push(objeto.nome);
    });
    return arrayNomes;
  };

  componentDidUpdate = async () => {
    const { nomesProdutos, nomesMarcas, nomesFabricantes } = this.state;
    if (
      nomesProdutos === null &&
      nomesMarcas === null &&
      nomesFabricantes === null
    ) {
      const produtos = await getNomesProdutos();
      const marcas = await getNomesMarcas();
      const fabricantes = await getNomesFabricantes();

      this.setState({
        nomesProdutos: this.retornaListaDeNomes(produtos.data.results),
        nomesMarcas: this.retornaListaDeNomes(marcas.data.results),
        nomesFabricantes: this.retornaListaDeNomes(fabricantes.data.results)
      });
    }
  };

  onSearchProduto = searchText => {
    const { nomesProdutos } = this.state;
    let options = !searchText
      ? []
      : nomesProdutos.filter(element =>
          element.toUpperCase().includes(searchText.toUpperCase())
        );
    this.setState({
      optionsProdutos: options
    });
  };

  onSearchMarca = searchText => {
    const { nomesMarcas } = this.state;
    let options = !searchText
      ? []
      : nomesMarcas.filter(element =>
          element.toUpperCase().includes(searchText.toUpperCase())
        );
    this.setState({
      optionsMarcas: options
    });
  };

  onSearchFabricantes = searchText => {
    const { nomesFabricantes } = this.state;
    let options = !searchText
      ? []
      : nomesFabricantes.filter(element =>
          element.toUpperCase().includes(searchText.toUpperCase())
        );
    this.setState({
      optionsFabricantes: options
    });
  };

  adicionaResponseAoResultadoProduto = response => {
    response.data.results.forEach(produto => {
      produto["ativo"] = false;
    });
    this.setState({
      resultadosProduto: response.data.results
    });
  };

  onSelectProduto = async data => {
    const response = await getProdutosPorNome(data);
    this.adicionaResponseAoResultadoProduto(response);
  };

  onSelectMarca = async data => {
    const response = await getProdutosPorMarca(data);
    this.adicionaResponseAoResultadoProduto(response);
  };

  onSelectFabricante = async data => {
    const response = await getProdutosPorFabricante(data);
    this.adicionaResponseAoResultadoProduto(response);
  };

  dropDownProduto = indice => {
    let { resultadosProduto } = this.state;
    resultadosProduto.forEach((produto, indiceProduto) => {
      if (indiceProduto === indice) {
        produto.ativo = !produto.ativo;
      } else if (produto.ativo) {
        produto.ativo = false;
      }
    });
    this.setState({ resultadosProduto });
  };

  cancelaPesquisa = () => {
    this.setState({
      resultadosProduto: []
    });
  };

  render() {
    const {
      optionsProdutos,
      optionsMarcas,
      optionsFabricantes,
      resultadosProduto
    } = this.state;
    const { handleSubmit, exibeFormularioInicial } = this.props;
    return (
      <form onSubmit={handleSubmit} className="busca-produtos-formulario">
        <section className="header-busca-produto">
          Confira se produto já está cadastrado no sistema
        </section>
        <div>
          <label>Nome do Produto</label>
          <AutoComplete
            className={"input-busca-produto"}
            dataSource={optionsProdutos}
            onSelect={this.onSelectProduto}
            onSearch={this.onSearchProduto}
          >
            <Input.Search size="large" onSearch={this.onSelectProduto} />
          </AutoComplete>
        </div>
        <div className="marca-fabricante-inputs">
          <div>
            <label>Marca do Produto</label>
            <AutoComplete
              dataSource={optionsMarcas}
              onSelect={this.onSelectMarca}
              onSearch={this.onSearchMarca}
            >
              <Input.Search size="large" onSearch={this.onSelectMarca} />
            </AutoComplete>
          </div>
          <div>
            <label>Fabricante do Produto</label>
            <AutoComplete
              dataSource={optionsFabricantes}
              onSelect={this.onSelectFabricante}
              onSearch={this.onSearchFabricantes}
            >
              <Input.Search size="large" onSearch={this.onSelectFabricante} />
            </AutoComplete>
          </div>
        </div>

        {resultadosProduto.length > 0 && (
          <section className="resultados-busca-produtos">
            <section className="">
              <div className="tabela-produto tabela-header-produto">
                <div>Nome do Produto</div>
                <div>Marca do Produto</div>
                <div>Fabricante do Produto</div>
              </div>
              {resultadosProduto.map((produto, indice) => {
                return (
                  <div key={indice}>
                    <div className="tabela-produto tabela-body-produto">
                      <div
                        className={`item-produto ${
                          produto.ativo ? "" : "item-inativo"
                        }`}
                      >
                        {produto.nome}
                      </div>
                      <div
                        className={`item-produto ${
                          produto.ativo ? "" : "item-inativo"
                        }`}
                      >
                        {produto.marca.nome}
                      </div>
                      <div
                        className={`item-produto com-botao ${
                          produto.ativo ? "" : "item-inativo"
                        }`}
                      >
                        {produto.fabricante.nome}
                        {produto.ativo ? (
                          <div className="botoes-produto">
                            <i className="fas fa-pen editar" />
                            <i
                              className="fas fa-angle-up"
                              onClick={() => {
                                this.dropDownProduto(indice);
                              }}
                            />
                          </div>
                        ) : (
                          <i
                            className="fas fa-angle-down"
                            onClick={() => {
                              this.dropDownProduto(indice);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {produto.ativo && (
                      <div className="detalhe-produto">
                        {produto.terceirizada &&
                          produto.terceirizada.contatos.map(
                            (contato, indice) => {
                              return (
                                <div
                                  key={indice}
                                  className="contatos-terceirizada"
                                >
                                  <div>
                                    <div className="label-item">Telefone</div>
                                    <div className="value-item">
                                      {contato.telefone}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="label-item">E-mail</div>
                                    <div className="value-item">
                                      {contato.email}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}

                        <div className="componentes-produto">
                          <div className="label-item">
                            Componentes do produto
                          </div>
                          <div className="value-item">
                            {produto.componentes}
                          </div>
                        </div>

                        <div className="componentes-produto">
                          <div className="label-item">
                            O produto contém ou pode conter
                            ingredientes/aditivos alergênicos?
                          </div>
                          <div className="value-item">
                            {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
                          </div>
                        </div>

                        {produto.tem_aditivos_alergenicos && (
                          <div className="componentes-produto">
                            <div className="label-item">Quais?</div>
                            <div className="value-item">{produto.aditivos}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </section>
        )}

        <div className="botoes-busca">
          <Botao
            texto={"Cancelar"}
            className="mr-3"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => {
              this.cancelaPesquisa();
            }}
          />
          <Botao
            texto={"Cadastrar Alimentos"}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            onClick={() => {
              exibeFormularioInicial();
            }}
          />
        </div>
      </form>
    );
  }
}
