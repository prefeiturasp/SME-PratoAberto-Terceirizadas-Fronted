import { API_URL } from "../constants/config.constants";
import { PEDIDOS } from "./contants";
import authService from "./auth";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const createSuspensaoDeAlimentacao = payload => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/`;

  let status = 0;
  return fetch(url, {
    method: "POST",
    body: payload,
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const deleteSuspensaoDeAlimentacao = uuid => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/`;
  return fetch(url, {
    method: "DELETE",
    headers: authToken
  })
    .then(result => {
      return result.status;
    })
    .catch(error => {
      return error.json();
    });
};

export const getSuspensoesDeAlimentacaoSalvas = () => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/meus_rascunhos/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getMotivosSuspensaoCardapio = () => {
  const url = `${API_URL}/motivos-suspensao-cardapio/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const enviarSuspensaoDeAlimentacao = uuid => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/informa-suspensao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const updateSuspensaoDeAlimentacao = (uuid, payload) => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/`;
  let status = 0;

  return fetch(url, {
    method: "PUT",
    body: payload,
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getSuspensoesDeAlimentacaoInformadas = () => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/informadas/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getSuspensaoDeAlimentacaoUUID = uuid => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "get",
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const terceirizadaTomaCienciaSuspensaoDeAlimentacao = uuid => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/terceirizada-toma-ciencia/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getSuspensaoDeAlimentacaoTomadaCiencia = () => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/tomados-ciencia/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getSuspensaoDeAlimentacaoCODAE = filtro_aplicado => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/pedidos-codae/${filtro_aplicado}/`;

  return fetch(url, {
    method: "GET",
    headers: authToken
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getTerceirizadasSuspensoesDeAlimentacao = filtroAplicado => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${
    PEDIDOS.TERCEIRIZADA
  }/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};
