import { createBrowserRouter, RouterProvider } from "react-router-dom"
import * as AuthPages from "./pages/auth"
import * as UserPages from "./pages/user"

const routers = createBrowserRouter([
    {
        path: "/",
        element: <UserPages.HomePage />,
    },
    {
        path: "/login",
        index: true,
        element: <AuthPages.LoginPage />,
    },
    {
        path: "/register",
        element: <AuthPages.RegisterPage />,
    },
    {
        path: "/email/verify/:code",
        element: <AuthPages.EmailVerificationPage />,
    },
    {
        path: "/password/forgot",
        element: <AuthPages.ForgotPassswordPage />,
    },
    {
        path: "/password/reset",
        element: <AuthPages.ResetPasswordPage />,
    },
])

export default function App() {
    return <RouterProvider router={routers} />
}
