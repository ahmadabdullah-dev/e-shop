import { createBrowserRouter } from "react-router";
import App from "../App";
import ErrorPage from "../../features/errors/ErrorPage";
import NotFound from "../../features/errors/NotFound";
import LandingPage from "../LandingPage";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import ForgetPasswordForm from "../../features/auth/ForgetPassword";
import ResetPasswordForm from "../../features/auth/ResetPasswordForm";
import RequireAuth from "./RequireAuth";
import ConfirmEmailForm from "../../features/auth/ConfirmEmailForm";
import RequireConfirmedEmail from "./RequireConfirmedEmail";
import MyProfile from "../../features/user/MyProfile";
import Product from "../../features/product/ProductDetails";
import UpdateProduct from "../../features/product/UpdateProduct";
import RequireAdminRole from "./RequireAdminRole";
import AddProductForm from "../../features/product/AddProductForm";
import UserSettings from "../../features/user/UserSettings";
import CurrentBasket from "../../features/Basket/CurrentBasket";
import CreateOrder from "../../features/order/CreateOrder";
import CurrentUserOrders from "../../features/order/CurrentUserOrders";
import AdminDashboard from "../../features/admin/AdminDashboard";
import ProductsDashboard from "../../features/product/ProductsDashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "/products", element: <ProductsDashboard /> },

      {
        element: <RequireAuth />,
        children: [
          {
            element: <RequireConfirmedEmail />,
            children: [
              {
                element: <RequireAdminRole />,
                children: [
                  { path: "product/update/:id", element: <UpdateProduct /> },
                  { path: "product/add", element: <AddProductForm /> },
                  { path: "admin", element: <AdminDashboard /> },
                ],
              },
              { path: "user/settings", element: <UserSettings /> },
              { path: "settings", element: <UserSettings /> },
              { path: "/", element: <LandingPage /> },
              { path: "my-profile", element: <MyProfile /> },
              { path: "basket", element: <CurrentBasket /> },
              { path: "checkout", element: <CreateOrder /> },
              { path: "orders", element: <CurrentUserOrders /> },
            ],
          },
          { path: "/confirm-email", element: <ConfirmEmailForm /> },
        ],
      },
      { path: "register", element: <RegisterForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "forget-password", element: <ForgetPasswordForm /> },
      { path: "reset-password/:email", element: <ResetPasswordForm /> },
      { path: "product/:id", element: <Product /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
