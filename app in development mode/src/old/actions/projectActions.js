const createProject = (project) => {
    //without thunk
    // return {
    //     type: "add_project",
    //     project
    // }
    //whith thunk
    return (dispatch, getState) => {
        //make asyn call to database
        console.log("state action", getState());
        dispatch({ type: "add_project", project });
    }
}
export default createProject;
