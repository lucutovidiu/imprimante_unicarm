import axios from 'axios'

const checkAuth = (state) => {
    //without thunk
    // return {
    //     type: "add_project",
    //     project
    // }
    //whith thunk
    return (dispatch, getState) => {
        //make asyn call to database
        // axios.post('http://localhost/auth/auth.php', {
        //     username: 'Fred',
        //     password: 'Flintstone'
        // })
        //     .then(function (response) {
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        // axios({
        //     method: 'post',
        //     url: 'http://localhost/auth/auth.php',
        //     data: {
        //         username: "test",
        //         password: "iiiiii"
        //     },
        //     headers: {
        //         'Access-Control-Allow-Origin': "*",
        //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        //     }
        // }).then(function (response) {
        //     console.log(response);
        // })
        //     .catch(function (error) {
        //         console.log("Post Error : " + error);
        //     });

        // axios.post('http://localhost/auth/auth.php', { username: 'Marlon', password: 'Bernardes' })
        //     .then(function (response) {
        //         console.log(response)
        //     });
        // let message = {
        //     username: "g3",
        //     password: "g3"
        // }
        // axios.post('http://localhost/auth/auth.php', message)
        //     .then(function (response) {
        //         const { auth } = JSON.parse(response.data);
        //         console.log(auth)
        //     });
        dispatch(Object.assign({ type: "auth", state }));
    }
}
export default checkAuth;
