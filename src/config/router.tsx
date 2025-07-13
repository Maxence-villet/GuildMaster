import AddGuidePage from "../crm/guide/add/page";
import ListGuidePage from "../crm/guide/list/page";
import LoginPage from "../crm/login/page";
import ListMembersPage from "../crm/member/list/page";
import AddMemberPage from "../crm/member/add/page";
import ViewGuidePage from "../crm/guide/view/page";



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
    },
    {
        path: "/member/list",
        element: <ListMembersPage />
    },
    {
        path: "/member/add",
        element: <AddMemberPage />
    },
    {
        path: "/guide/view",
        element: <ViewGuidePage />
    }

];