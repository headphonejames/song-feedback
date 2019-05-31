import * as constants from "../constants";

// initial state
const initialState = {userData: {}, rewardCount: 0};

export default function databaseReducer(state=initialState, action=null) {
    switch (action.type) {
        case constants.UPDATE_USER:
            return Object.assign({}, state,
                {
                    userData: action.userData,
                    userId: action.userId
                }
            );
        case constants.UPDATE_REWARD_COUNT:
            return Object.assign({}, state,
                {
                    rewardCount: action.rewardCount
                }
            );
        default:
            return state;
    }
};
