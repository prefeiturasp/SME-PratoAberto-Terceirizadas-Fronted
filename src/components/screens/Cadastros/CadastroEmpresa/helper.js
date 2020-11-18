import { createTextMask } from "redux-form-input-masks";

export function transformaObjetos(objetos, lista = [], obj = {}) {
  try {
    objetos.results.forEach(objeto => {
      obj.uuid = objeto["uuid"];
      obj.label = objeto["nome"];
      obj.value = objeto["uuid"];
      lista.push(obj);
      obj = {};
    });
  } catch (err) {
    return lista;
  }
  return lista;
}

export const fieldCnpj = createTextMask({
  pattern: "99.999.999/9999-99",
  allowEmpty: false,
  guide: false
});

export const fieldCpf = createTextMask({
  pattern: "999.999.999-99",
  allowEmpty: false,
  guide: false
});

export const fieldCep = createTextMask({
  pattern: "99999-999",
  allowEmpty: false,
  guide: false
});

export const fieldTel = createTextMask({
  pattern: "99 9999-9999",
  guide: false
});

const retornaNutricionistas = nutricionistas => {
  const listaNutricionistas = nutricionistas.map(nutri => {
    return {
      nome: nutri.nome,
      crn: nutri.crn_numero,
      super_admin_terceirizadas: nutri.super_admin_terceirizadas,
      telefone: nutri.contatos.length === 0 ? null : nutri.contatos[0].telefone,
      email: nutri.contatos.length === 0 ? null : nutri.contatos[0].email
    };
  });
  return listaNutricionistas;
};

const retornaLotes = lotes => {
  const listaLotes = lotes.map(lote => {
    return {
      nome: lote.nome,
      uuid: lote.uuid
    };
  });
  return listaLotes;
};

const retornaEditalDeContrato = contrato => {
  return {
    edital: contrato.edital.numero,
    contrato: contrato.numero
  };
};

const retornaEditais = contratos => {
  const listaEditais = contratos.map(contrato => {
    return retornaEditalDeContrato(contrato);
  });
  return listaEditais;
};

export const retornArrayTerceirizadas = response => {
  const listaTerceirizadas = response.map(resp => {
    return {
      uuid: resp.uuid,
      codigo_empresa: resp.id_externo,
      nome: resp.razao_social,
      cnpj: resp.cnpj,
      status: resp.ativo ? "Ativa" : "Inativa",
      ativo: false,
      endereco: resp.endereco,
      cep: resp.cep,
      telefone: resp.contatos.length === 0 ? null : resp.contatos[0].telefone,
      email: resp.contatos.length === 0 ? null : resp.contatos[0].email,

      representante: resp.representante_legal,
      telefonefax: resp.representante_telefone,
      email_representante: resp.representante_email,
      nutricionistas: retornaNutricionistas(resp.nutricionistas),
      editais: retornaEditais(resp.contratos),
      lotes: retornaLotes(resp.lotes)
    };
  });
  return listaTerceirizadas;
};

export const validarSubmissao = state => {
  let erro = false;
  if (state.contatosNutricionista.length > 1) {
    let aoMenosUmAdministrador = false;
    state.contatosNutricionista.forEach(contato => {
      if (contato.super_admin_terceirizadas) {
        aoMenosUmAdministrador = true;
      }
    });
    if (!aoMenosUmAdministrador) {
      erro = "É necessário selecionar ao menos um administrador";
    }
  }
  return erro;
};

export const formataJsonParaEnvio = (valoresForm, valoresState) => {
  const { ehDistribuidor } = valoresState;

  if (ehDistribuidor) {
    const contatosNutri = [
      {
        nome: "nome",
        crn_numero: "numero",
        super_admin_terceirizadas: false,
        contatos: [
          {
            telefone: "0000000000000",
            email: "email@email.com"
          }
        ]
      }
    ];
    const contatosEmpresa = [
      {
        telefone: valoresForm.responsavel_telefone,
        email: valoresForm.responsavel_email
      }
    ];
    return {
      nome_fantasia: valoresForm.nome_fantasia,
      razao_social: valoresForm.razao_social,
      cnpj: valoresForm.cnpj,
      endereco: valoresForm.endereco,
      cep: valoresForm.cep,
      contatos: contatosEmpresa,
      nutricionistas: contatosNutri,
      bairro: valoresForm.bairro,
      cidade: valoresForm.cidade,
      complemento: valoresForm.complemento,
      eh_distribuidor: valoresForm.eh_distribuidor || ehDistribuidor,
      estado: valoresForm.estado,
      numero: valoresForm.numero,
      responsavel_cargo: valoresForm.responsavel_cargo,
      responsavel_cpf: valoresForm.responsavel_cpf,
      responsavel_nome: valoresForm.responsavel_nome,
      responsavel_telefone: valoresForm.responsavel_telefone,
      responsavel_email: valoresForm.responsavel_email,
      lotes: []
    };
  } else {
    let contatosNutri = [];
    valoresState.contatosNutricionista.forEach(nutri => {
      contatosNutri.push({
        nome: nutri.responsavel,
        crn_numero: nutri.crn,
        super_admin_terceirizadas:
          valoresState.contatosNutricionista.length === 1
            ? true
            : nutri.super_admin_terceirizadas,
        contatos: [
          {
            telefone: nutri.telefone,
            email: nutri.email
          }
        ]
      });
    });

    return {
      nome_fantasia: valoresForm.nome_fantasia,
      razao_social: valoresForm.razao_social,
      cnpj: valoresForm.cnpj,
      representante_legal: valoresForm.representante_legal,
      representante_telefone: valoresForm.telefone_representante,
      representante_email: valoresForm.email_representante_legal,
      endereco: valoresForm.endereco,
      cep: valoresForm.cep,
      contatos: valoresState.contatosEmpresa,
      nutricionistas: contatosNutri,
      bairro: valoresForm.bairro,
      cidade: valoresForm.cidade,
      complemento: valoresForm.complemento,
      eh_distribuidor: valoresForm.eh_distribuidor || ehDistribuidor,
      estado: valoresForm.estado,
      numero: valoresForm.numero,
      lotes: valoresState.lotesSelecionados
    };
  }
};
