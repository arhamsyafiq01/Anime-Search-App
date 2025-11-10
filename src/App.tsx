import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 shadow-lg">
          <nav className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-auto object-contain"
            />
            <h1 className="text-xl font-bold text-blue-100 drop-shadow-md">
              Anime Collection
            </h1>
          </nav>
        </header>

        <PWAInstallPrompt />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/anime/:id" element={<DetailPage />} />
            <Route
              path="*"
              element={
                <div className="p-8 text-center text-3xl font-bold text-gray-700">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </main>
        {/* ✅ Footer (copyright only) */}
        <footer className="bg-gray-800 text-white p-4 text-center shadow-lg">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Anime Collection. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
