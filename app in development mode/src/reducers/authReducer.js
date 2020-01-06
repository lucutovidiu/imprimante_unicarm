const initState = {
    credentials: {
        username: "", token: "", role: ""
    }
}

function collectAuthFromSession(state) {
    let token = sessionStorage.getItem('token');
    let role = sessionStorage.getItem('role');
    let username = sessionStorage.getItem('user_name');
    if (token && role && username) {
        const newObject = Object.assign({}, state,
            { credentials: { 'username': username, 'role': role, 'token': token } });
        //console.log("newobj", newObject);
        return newObject;
    } else return state;
}

const authReducer = (state = initState, action) => {
    if (action.type === "userauth") {
        let newState = Object.assign({}, { credentials: action.credentials })
        //console.log("reducer", newState)
        return newState;
    }

    return collectAuthFromSession(state);
}
export default authReducer;