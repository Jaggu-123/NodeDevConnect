import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function(state = initialState, actions) {
    switch (actions.payload) {
        case GET_ERRORS:
            return actions.payload;
        default:
            return state;
    }
}
