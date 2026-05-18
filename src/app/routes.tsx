import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./components/Home";
import { Nosotros } from "./components/Nosotros";
import Servicios from "./components/Servicios";
import { Sectores } from "./components/Sectores";
import { Contacto } from "./components/Contacto";
import Blog from "./components/Blog";
import BlogPostDetail from "./components/BlogPostDetail";
import Abogados from "./components/Abogados";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "nosotros", Component: Nosotros },
      { path: "servicios", Component: Servicios },
      { path: "sectores", Component: Sectores },
      { path: "sectores/:sectorSlug", Component: Sectores },
      { path: "abogados", Component: Abogados },
      { path: "abogados/:slug", Component: Abogados },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPostDetail },
      { path: "contacto", Component: Contacto },
    ],
  },
]);
