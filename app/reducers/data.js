import {
  GET_DATA,
} from 'Constants/';


const initialState = { nodes: undefined, links: undefined };


export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DATA:
      return Object.assign({}, state, {
        nodes: action.payload.nodes,
        links: action.payload.links,
      });
    default:
      return state;
  }
}
