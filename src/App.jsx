import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import CatalogPage from "./pages/CatalogPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
     
    </>
  );
}

export default App;
