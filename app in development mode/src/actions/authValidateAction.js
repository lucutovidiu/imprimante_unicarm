import axios from 'axios'
const authValidateAction = (state) => {

    function updateStorage(token, role, username) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('user_name', username);
    }

    return (dispatch, getState) => {

        // let token = "token";
        // let role = "admin";
        // //console.log("username: ", state.username);
        // let username = state.username;
        //updateStorage(token, role, username);

        let message = {
            username: state.username,
            password: state.password
        }
        //console.log(message);
        let origin = window.origin;
        //let origin = 'http://localhost:9000';
        // axios.post(origin + '/imprimanteunicarm/backend/php/login_auth.php', message)
        axios.post(origin + '/api/login_auth', message)
            .then(function (response) {
                //console.log("response from auth : ", response);
                const { auth, token, role } = response.data;
                if (auth === "ok") {
                    if (role !== "admin" && role !== "store" && role !== "raport" && role !== "storeraport") {
                        let newState = Object.assign({}, { type: 'userauth' }, { credentials: { username: "", token: "", role: "" } });
                        dispatch(newState);
                    } else {
                        let username = state.username;
                        updateStorage(token, role, username);
                        let credentials = Object.assign({}, {
                            username: username, token: token, role: role
                        })

                        let newState = Object.assign({}, { type: 'userauth' }, { credentials });
                        //console.log("new state:", newState);
                        dispatch(newState);
                        //console.log(response);
                    }
                } else {
                    let newState = Object.assign({}, { type: 'userauth' }, { credentials: { username: "", token: "", role: "" } });
                    dispatch(newState);
                }

            }).catch(err => {
                //console.log(err);
                return null;
            });
    }
}

export default authValidateAction;