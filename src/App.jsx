import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ErrorPage from "./pages/error-page";

export default function App() {
  return (
    <div className="min-h-screen max-w-8xl mx-auto bg-defaultbg-light-white dark:bg-default font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
