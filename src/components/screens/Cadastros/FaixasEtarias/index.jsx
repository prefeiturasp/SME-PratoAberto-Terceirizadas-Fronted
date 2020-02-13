import React, { Component, Fragment } from "react";

import InputText from "../../../Shareable/Input/InputText";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "../../../Shareable/Botao/constants";

import {
  mesEstaDentroDeAlgumaFaixa,
  mesesToMesEAnoString,
  mesesFinaisValidos,
  mesesForaDasFaixas,
  ordenaFaixas,
  range
} from "./helper";

import "./style.scss";

const FaixaEtariaItem = ({
  inicio,
  editando,
  fim,
  onApagar,
  onCancelar,
  onConfirmar
}) => (
  <div className="faixa-etaria-item">
    <InputText
      className={editando && "faixa-etaria-item-editando"}
      input={{
        value:
          mesesToMesEAnoString(inicio) +
          (fim - inicio === 1 ? "" : " - " + mesesToMesEAnoString(fim))
      }}
      disabled
    />
    {editando ? (
      <Fragment>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          icon={BUTTON_ICON.CHECK_CIRCLE}
          onClick={onConfirmar}
        />
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.RED}
          icon={BUTTON_ICON.TIMES_CIRCLE}
          onClick={onCancelar}
        />
      </Fragment>
    ) : (
      <Fragment>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.BLUE_OUTLINE}
          icon={BUTTON_ICON.PLUS}
        />
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.BLUE_OUTLINE}
          icon={BUTTON_ICON.TRASH}
          onClick={onApagar}
        />
      </Fragment>
    )}
  </div>
);

export default class FaixasEtarias extends Component {
  SEIS_ANOS = 6 * 12;
  SEIS_ANOS_MAIS_UM_MES = this.SEIS_ANOS + 1;
  constructor(props) {
    super(props);
    this.state = {
      meses: range(this.SEIS_ANOS_MAIS_UM_MES),
      faixasEtarias: [],
      mesEdicaoAtual: undefined
    };
    this.cancelarEdicao = this.cancelarEdicao.bind(this);
  }
  selecionaMes(mes) {
    if (this.state.mesEdicaoAtual !== undefined) {
      const faixasEtarias = ordenaFaixas(
        this.state.faixasEtarias.concat({
          inicio: this.state.mesEdicaoAtual,
          fim: mes === this.state.mesEdicaoAtual ? mes + 1 : mes
        })
      );
      this.setState({
        mesEdicaoAtual: undefined,
        faixasEtarias,
        meses: mesesForaDasFaixas(faixasEtarias, this.SEIS_ANOS_MAIS_UM_MES)
      });
    } else {
      this.setState({
        mesEdicaoAtual: mes,
        meses: mesesFinaisValidos(
          mes,
          this.state.faixasEtarias,
          this.SEIS_ANOS_MAIS_UM_MES
        )
      });
    }
  }
  cancelarEdicao() {
    this.setState({
      mesEdicaoAtual: undefined,
      meses: mesesForaDasFaixas(
        this.state.faixasEtarias,
        this.SEIS_ANOS_MAIS_UM_MES
      )
    });
  }
  apagarFaixa(indice) {
    const faixasEtarias = this.state.faixasEtarias.filter(
      (f, i) => i !== indice
    );
    this.setState({
      faixasEtarias,
      meses: mesesForaDasFaixas(faixasEtarias, this.SEIS_ANOS_MAIS_UM_MES)
    });
  }
  render() {
    return (
      <div className="card mt-3 faixas-etarias">
        <div className="card-body">
          <div className="row">
            <div className="col-5">
              <select
                multiple
                className={
                  "form-control select-meses" +
                  (this.state.mesEdicaoAtual ? " select-meses-editando" : "")
                }
                onClick={e => this.selecionaMes(parseInt(e.target.value))}
              >
                {this.state.meses.map((mes, key) => (
                  <option
                    key={key}
                    value={mes}
                    disabled={
                      this.state.mesEdicaoAtual
                        ? mes < this.state.mesEdicaoAtual ||
                          mesEstaDentroDeAlgumaFaixa(
                            mes,
                            this.state.faixasEtarias
                          )
                        : false
                    }
                  >
                    {mesesToMesEAnoString(mes)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-7">
              {this.state.faixasEtarias.map((f, key) => (
                <FaixaEtariaItem
                  key={key}
                  onApagar={() => this.apagarFaixa(key)}
                  {...f}
                />
              ))}
              {this.state.mesEdicaoAtual !== undefined && (
                <FaixaEtariaItem
                  inicio={this.state.mesEdicaoAtual}
                  editando={true}
                  onCancelar={this.cancelarEdicao}
                  onConfirmar={() =>
                    this.selecionaMes(this.state.mesEdicaoAtual)
                  }
                />
              )}
            </div>
          </div>
          <div>
            <Botao
              texto="Finalizar"
              className="float-right"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.BLUE}
              disabled={this.state.meses.length > 0}
            />
          </div>
        </div>
      </div>
    );
  }
}