import React from 'react';

import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";

import InputText from "../../../Shareable/Input/InputText";
import CKEditorField from "../../../Shareable/CKEditorField";
import SelectSelecione from "../../../Shareable/SelectSelecione";
import SubstituicoesField from "./componentes/SubstituicoesField";

import { getAlimentos } from "../../../../services/dietaEspecial.service";
import { getSubstitutos } from "services/produto.service";

import {
    toastSuccess,
    toastError
} from "../../../Shareable/Toast/dialogs";

import Botao from "../../../Shareable/Botao";
import {
    BUTTON_TYPE,
    BUTTON_STYLE,
    BUTTON_ICON
} from "../../../Shareable/Botao/constants";

import './styles.scss'

export default class CadastroProtocolo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alimentos: [],
            produtos: []
        };
    }

    componentDidMount = async () => {
        const alimentos = await getAlimentos({
            tipo: "E"
        });
        const produtos = await (await getSubstitutos()).data.results
        this.setState({
            alimentos: alimentos.data,
            produtos: produtos
        })
    }

    getInitialValues() {
        return {
            nome: undefined,
            informacoes_adicionais: undefined,
            substituicoes: [{}]
        }
    }

    render() {
        const { alimentos, produtos } = this.state;
        return (
            <div>
                <Form
                    onSubmit={(e) => console.log(e)}
                    initialValues={this.getInitialValues()}
                    mutators={{ ...arrayMutators }}
                    render={({ form, handleSubmit, pristine, submitting, values }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="title">
                                                        Nome do Protocolo
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <Field
                                                        component={InputText}
                                                        name="nome"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <Field
                                                component={CKEditorField}
                                                label="Observações"
                                                name="informacoes_adicionais"
                                            />
                                        </div>
                                    </div>
                                    {alimentos.length > 0 && produtos.length > 0 && (
                                        <>
                                            <div className="pt-2 input title">
                                                <span className="required-asterisk">*</span>
                                                <label>Substituições de Alimentos</label>
                                            </div>
                                            <SubstituicoesField
                                                alimentos={alimentos}
                                                produtos={produtos}
                                                form={form}
                                            />
                                        </>)}
                                    <hr />
                                    <div className="row">
                                        <div className="col-3">
                                            <Field
                                                component={SelectSelecione}
                                                label="Status"
                                                name="status"
                                                options={
                                                    [
                                                        { uuid: "nao_liberado", nome: "Não Liberado" },
                                                        { uuid: "liberado", nome: "Liberado" }
                                                    ]
                                                }
                                            //disabled={this.deveDesabilitarSeletorDeAlimentacao(indice)}
                                            //onChange={event => {
                                            // this.resetAlteracaoDoPeriodo(
                                            //     event.target.value,
                                            //     periodo.nome,
                                            //     indice
                                            // );
                                            // this.selectSubstituicoesAlimentacaoAPartirDe(
                                            //     event.target.value,
                                            //     indice
                                            // );
                                            //}}
                                            //validate={periodo.checked && required}
                                            //required={periodo.checked}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <Botao
                                                type={BUTTON_TYPE.BUTTON}
                                                texto="Salvar"
                                                onClick={(e) => e}
                                                style={BUTTON_STYLE.GREEN}
                                                className="float-right ml-3"
                                            />
                                            <Botao
                                                texto="Cancelar"
                                                onClick={(e) => e}
                                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                                className="float-right"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        )
    }
}