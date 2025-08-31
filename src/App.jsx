import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import CatalogPage from "./pages/catalogPage/CatalogPage";
import CamperDetailsPage from "./pages/detailPage/CamperDetailsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CatalogPage />} />
         <Route path="/campers/:id" element={<CamperDetailsPage />} />
      </Routes>
     
    </>
  );
}

export default App;
