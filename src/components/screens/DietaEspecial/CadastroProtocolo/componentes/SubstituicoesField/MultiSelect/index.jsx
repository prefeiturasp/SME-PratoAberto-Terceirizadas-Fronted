import React from "react";
import StatefuMultiSelect from "./StatefuMultiSelect";
import "./style.scss";
import { HelpText } from "../../../../../../Shareable/HelpText";
import InputErroMensagem from "../../../../../../Shareable/Input/InputErroMensagem";

export default class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.input.value
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.alimentoSelecionado) {
      return;
    }

    if (!this.state.selected.length) {
      return;
    }

    const selectedProdutos = this.props.options.filter(p => {
      return this.state.selected.includes(p.value);
    });

    const selected = selectedProdutos.find(
      p => p.label.split(" (")[0] === nextProps.alimentoSelecionado.nome
    );

    if (!selected) {
      return;
    }

    this.setState({
      selected: this.state.selected.filter(p => p !== selected.value)
    });
  }

  render() {
    const {
      helpText,
      label,
      input: { onChange },
      meta,
      name,
      required,
      ...rest
    } = this.props;
    const { selected } = this.state;
    return (
      <div className="select">
        {label && [
          required && (
            <span key={1} className="required-asterisk">
              *
            </span>
          ),
          <label key={2} htmlFor={name} className="col-form-label">
            {label}
          </label>
        ]}
        <StatefuMultiSelect
          selected={selected}
          onSelectedChanged={selected => {
            this.setState({ selected });
          }}
          onUnexpand={() => onChange(selected)}
          overrideStrings={{
            selectSomeItems: "Selecione",
            allItemsAreSelected: "Todos os itens estão selecionados",
            selectAll: "Todos",
            search: "Buscar"
          }}
          {...rest}
        />
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}
