const updatesAction = (state) => {

    return (dispatch, oldState) => {
        if (state.type === "NEW_STORE") {
            console.log(state.payload);
        }
    }

}