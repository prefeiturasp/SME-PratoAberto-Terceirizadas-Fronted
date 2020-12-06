const SET_REQUISICOES =
  "SME-Terceirizadas-Frontend/buscaRequisicaoDilogAvancada/SET_REQUISICOES";

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_REQUISICOES:
      return {
        ...state,
        inicialState: action.payload
      };
    default:
      return state;
  }
}

export const setRequisicoes = listaRequisicoes => ({
  type: SET_REQUISICOES,
  payload: listaRequisicoes
});
