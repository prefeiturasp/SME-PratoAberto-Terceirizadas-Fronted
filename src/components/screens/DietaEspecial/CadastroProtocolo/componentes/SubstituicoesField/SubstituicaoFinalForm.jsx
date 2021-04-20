import React, { Component } from "react";
import MultiSelect from "./MultiSelect";
import { Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { required } from "helpers/fieldValidators";
import Select from "../../../../../Shareable/Select";
import { Icon, Select as SelectAntd } from "antd";
import Botao from "../../../../../Shareable/Botao";
import { ASelect } from "components/Shareable/MakeField";
import {
  BUTTON_STYLE,
  BUTTON_ICON
} from "../../../../../Shareable/Botao/constants";

import "./style.scss";

const { Option } = SelectAntd;

const SelectSelecione = props => {
  const {
    input: { onChange, value },
    options,
    ...rest
  } = props;
  return (
    <Select
      naoDesabilitarPrimeiraOpcao={value !== undefined}
      options={
        value === ""
          ? [{ uuid: "0", nome: "Selecione..." }].concat(options)
          : options
      }
      input={{ value: value || "0", onChange }}
      {...rest}
    />
  );
};

export default class SubstituicoesField extends Component {
  state = { valorSelecionado: undefined };

  render() {
    const {
      chave,
      alimentos,
      produtos,
      addOption,
      removeOption,
      input: { name },
      deveHabilitarApagar
    } = this.props;

    return (
      <>
        <div className="row">
          <div className="col-3 select-produto">
            <Field
              component={ASelect}
              className={"select-form-produto"}
              suffixIcon={<Icon type="caret-down" />}
              showSearch
              name={`${name}.alimento`}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {alimentos.map(a => {
                return <Option key={a.id.toString()}>{a.nome}</Option>;
              })}
            </Field>
            <OnChange name={`${name}.alimento`}>
              {value => {
                this.setState({
                  valorSelecionado: alimentos.find(al => String(al.id) === value)
                });
              }}
            </OnChange>
          </div>
          <div className="col-2">
            <Field
              component={SelectSelecione}
              options={[
                { uuid: "I", nome: "Isento" },
                { uuid: "S", nome: "Substituir" }
              ]}
              name={`${name}.tipo`}
              validate={required}
            />
          </div>
          <div className="col-5">
            <Field
              component={MultiSelect}
              type="select-multi"
              name={`${name}.substitutos`}
              alimentoSelecionado={this.state.valorSelecionado}
              options={produtos
                .filter(p => {
                  if (this.state.valorSelecionado === undefined) {
                    return true;
                  }
                  const alimento = this.state.valorSelecionado;
                  return p.nome.split(" (")[0] !== alimento.nome;
                })
                .map(a => {
                  return {
                    value: a.uuid,
                    label: a.nome
                  };
                })}
              validate={required}
            />
          </div>
          {deveHabilitarApagar && chave > 0 && (
            <div className="col-2">
              <Botao
                icon={BUTTON_ICON.TRASH}
                onClick={() => deveHabilitarApagar && removeOption()}
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />
            </div>)}
        </div>
      </>
    );
  }
}
