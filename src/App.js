import { Suspense, lazy } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContextProvider";

const MindMap = lazy(() => import("./pages/MindMap"));

function App() {
  return (
    <Suspense fallback={"Loading..."}>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MindMap />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </Suspense>
  );
}

export default App;
