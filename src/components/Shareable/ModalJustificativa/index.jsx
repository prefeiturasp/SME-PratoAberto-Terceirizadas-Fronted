import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { peloMenosUmCaractere, required } from "helpers/fieldValidators";
import { TextAreaWYSIWYG } from "components/Shareable/TextArea/TextAreaWYSIWYG";
import ManagedInputFileField from "components/Shareable/Input/InputFile/ManagedField";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";

import "./style.scss";

const ModalJustificativa = ({
  showModal,
  closeModal,
  onSubmit,
  titulo,
  comAnexo = false,
  labelJustificativa = "Justificativa"
}) => {
  return (
    <Modal
      dialogClassName="modal-justificativa-com-anexo modal-90w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row row-modal">
                <div className="col-12">
                  <Field
                    component={TextAreaWYSIWYG}
                    label={labelJustificativa}
                    name="justificativa"
                    required
                    validate={value => {
                      for (let validator of [peloMenosUmCaractere, required]) {
                        const erro = validator(value);
                        if (erro) return erro;
                      }
                    }}
                  />
                </div>
              </div>
              {comAnexo && (
                <section className="form-row attachments">
                  <div className="col-9">
                    <div className="card-title font-weight-bold cinza-escuro">
                      Anexar
                    </div>
                    <div className="text">
                      Anexar fotos, documentos ou relatórios relacionados.
                    </div>
                  </div>
                  <div className="col-3 btn">
                    <Field
                      component={ManagedInputFileField}
                      className="inputfile"
                      texto="Anexar"
                      name="anexos"
                      accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                      icone={BUTTON_ICON.ATTACH}
                      toastSuccessMessage="Anexo incluso com sucesso"
                      concatenarNovosArquivos
                    />
                  </div>
                </section>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="row mt-4">
                <div className="col-12">
                  <Botao
                    texto="Voltar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ml-3"
                  />
                  <Botao
                    texto="Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ml-3"
                    disabled={submitting}
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalJustificativa;
