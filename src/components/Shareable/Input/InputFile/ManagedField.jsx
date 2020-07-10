import React, { Component } from "react";

import { InputErroMensagem } from "../InputErroMensagem";
import { HelpText } from "../../HelpText";

import InputFileManaged from "./Managed";

export default class ManagedInputFileField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      descricaoProtocolo: ""
    };

    this.removeFile = this.removeFile.bind(this);
    this.setFiles = this.setFiles.bind(this);
  }

  removeFile(index) {
    const {
      input: { onChange, value }
    } = this.props;
    onChange(value.length === 1 ? "" : value.splice(index, 1));
  }
  setFiles(files) {
    this.setState({
      descricaoProtocolo: ""
    });
    this.props.input.onChange(files);
  }

  render() {
    const {
      input: { value },
      meta,
      helpText,
      ...rest
    } = this.props;
    return (
      <div>
        <InputFileManaged onChange={this.setFiles} value={value} {...rest} />
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}
