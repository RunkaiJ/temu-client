import { BrowserRouter, Routes, Route } from "react-router-dom";
import TemuUploadPage from "./pages/TemuUploadPage";

function App() {
    return (
        <>
            <div className="bg-dark text-white p-3 mb-4">
                <div className="container">
                    <h2 className="mb-0">Alex's Tool Box</h2>
                </div>
            </div>

            <div className="container">
                <Routes>
                    <Route path="/" element={<TemuUploadPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
