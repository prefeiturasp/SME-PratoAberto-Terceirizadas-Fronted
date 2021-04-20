import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import CadastroProtocolo from "../../components/screens/DietaEspecial/CadastroProtocolo";
import Page from "../../components/Shareable/Page/Page";
import {
    DIETA_ESPECIAL,
    CADASTRO_PROTOCOLO_PADRAO
} from "../../configs/constants";

const atual = {
    href: `/${DIETA_ESPECIAL}/${CADASTRO_PROTOCOLO_PADRAO}`,
    titulo: "Cadastro de Protocolo Padrão de Dieta Especial"
};

export default class CadastroProtocoloPadrao extends React.Component {
    render() {
        return (
            <Page
                titulo={"Cadastro de Protocolo Padrão de Dieta Especial"}
                botaoVoltar
                voltarPara={"/"}
            >
                <Breadcrumb home={"/"} atual={atual} />
                <CadastroProtocolo />
            </Page>
        )
    }
}