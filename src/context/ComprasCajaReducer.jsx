

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case "ADD_ITEM":
      return {
        ...state,
        items:[...state.items, action.payload],
      };
    
    default:
      return state;
  }
};