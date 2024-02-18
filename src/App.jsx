import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/error-page";
import Map from "./components/map/map";

export default function App() {
  return (
    <div className="min-h-screen h-dvh max-w-8xl mx-auto bg-light-white dark:bg-default font-sans tracking-tight">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
