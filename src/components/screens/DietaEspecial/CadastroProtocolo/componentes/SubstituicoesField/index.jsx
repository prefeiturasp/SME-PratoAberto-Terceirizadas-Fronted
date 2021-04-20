import React, { Component } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Botao from "../../../../../Shareable/Botao";
import { BUTTON_STYLE } from "../../../../../Shareable/Botao/constants";

import Substituicao from "./SubstituicaoFinalForm";

import "./style.scss";
import { required } from "../../../../../../helpers/fieldValidators";

export default class SubstituicoesField extends Component {
  render() {
    const { alimentos, produtos, form } = this.props;
    return (
      <div className="substituicoes-field">
        <div className="row">
          <div className="col-3">Alimentos</div>
          <div className="col-2">Tipos</div>
          <div className="col-5">Substitutos</div>
        </div>
        <FieldArray name="substituicoes">
          {({ fields }) =>
            fields.map((name, index) => (
              <Field
                component={Substituicao}
                name={name}
                key={index}
                chave={index}
                alimentos={alimentos}
                produtos={produtos}
                addOption={() => fields.push({})}
                removeOption={() => {
                  fields.swap(index, fields.length - 1);
                  fields.pop();
                }}
                validate={required}
                deveHabilitarApagar={fields.length > 1}
                required
              />
            ))
          }
        </FieldArray>
        <div className="row">
          <div className="col-2">
            <Botao
              texto="Adicionar"
              onClick={() => form.mutators.push("substituicoes", {})}
              style={BUTTON_STYLE.GREEN}
            />
          </div>
        </div>
      </div>
    );
  }
}
