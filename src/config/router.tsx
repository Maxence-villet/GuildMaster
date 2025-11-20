import AddGuidePage from "../crm/guide/add/page";
import ListGuidePage from "../crm/guide/list/page";
import LoginPage from "../crm/login/page";
import ListmembersPage from "../crm/member/list/page";
import AddmemberPage from "../crm/member/add/page";
import ViewGuidePage from "../crm/guide/view/page";
import Error404Page from "../crm/error404/page";
import Error403Page from "../crm/error403/page";
import LandingPage from "../crm/landing/page";
import AddClanPage from "../crm/clan/add/page";





export const appRoutes = [
    {
        path: "/",
        element: <LandingPage />
    },
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
        element: <ListmembersPage />
    },
    {
        path: "/member/add",
        element: <AddmemberPage />
    },
    {
        path: "/guide/view/:id",
        element: <ViewGuidePage />
    },
    {
        path: "/clan/add",
        element: <AddClanPage />
    },
    {
        path: "/403",
        element: <Error403Page />
    },
    {
        path: "*",
        element: <Error404Page />
    }
];