const initState = {
    projects: [
        { id: '1', name: "title1" },
        { id: '2', name: "title2" },
        { id: '3', name: "title3" }
    ]
}
const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case "add_project":
            console.log('created project', action.project);
            const project = action.project;
            const newState = { projects: [...state.projects, project] }
            state = newState;
            return state;
        default:
            return state;
    }
}
export default projectReducer;