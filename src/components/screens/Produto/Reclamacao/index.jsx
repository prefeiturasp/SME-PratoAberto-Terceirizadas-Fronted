import React, { Component } from "react";
import { getProdutosPorParametros } from "services/produto.service";
import FormBuscaProduto from "./components/FormBuscaProduto";
import TabelaProdutos from "./components/TabelaProdutos";
import { Spin } from "antd";

import "./style.scss";

export default class ReclamacaoProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaProdutos: [],
      loading: false,
      error: "",
      formValues: undefined
    };
  }
  onAtualizarProduto = () => {
    this.atualizaListaProdutos(this.state.formValues);
  };

  atualizaListaProdutos = formValues => {
    return new Promise(async (resolve, reject) => {
      const response = await getProdutosPorParametros(formValues);
      this.setState({ loading: false });
      if (response.status === 200) {
        this.setState({ listaProdutos: response.data.results });
        resolve();
      } else {
        reject(response.errors);
      }
    });
  };

  onSubmitFormBuscaProduto = formValues => {
    this.setState({
      formValues
    });
    this.setState({ loading: true, error: "" });
    try {
      this.atualizaListaProdutos(formValues);
    } catch (e) {
      this.setState({ error: "Erro ao consultar a lista de produtos." });
    }
  };
  render() {
    const { listaProdutos } = this.state;
    return (
      <Spin tip="Carregando..." spinning={this.state.loading}>
        <div className="card mt-3 page-reclamacao-produto">
          <div className="card-body">
            <h1>Reclamação de produto</h1>
            <section className="header-busca-produto">
              Confira se produto já está cadastrado no sistema
            </section>
            <FormBuscaProduto
              onSubmit={this.onSubmitFormBuscaProduto}
              onAtualizaProdutos={produtos =>
                this.setState({ listaProdutos: produtos })
              }
            />

            {listaProdutos.length > 0 && (
              <TabelaProdutos
                listaProdutos={listaProdutos}
                onAtualizarProduto={this.onAtualizarProduto}
              />
            )}
          </div>
        </div>
      </Spin>
    );
  }
}
