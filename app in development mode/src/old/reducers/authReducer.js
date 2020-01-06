const initState = {
    username: "",
    password: "",
    auth: ""
}
const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "auth":
            console.log('intercepted project', state);
            const newstate = Object.assign({}, { ...action.state }, { auth: "ok" });
            //state = newstate;
            return newstate;
        default:
            return state;
    }
}
export default authReducer;