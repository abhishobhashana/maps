import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ErrorPage from "./pages/error-page";

export default function App() {
  return (
    <div className="min-h-screen h-dvh max-w-8xl mx-auto bg-light-white dark:bg-default font-sans tracking-tight">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
