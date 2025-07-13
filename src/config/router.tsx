import AddGuidePage from "../crm/guide/add/page";
import ListGuidePage from "../crm/guide/list/page";
import LoginPage from "../crm/login/page";

export const appRoutes = [
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/guide/add",
        element: <AddGuidePage />
    },
    
    {
        path: "/guide/list",
        element: <ListGuidePage />
    }

];