import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { useMemo, lazy, Suspense, CSSProperties } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import GridLoader from "react-spinners/GridLoader"
import HomePage from "views/homePage";
import SearchPage from "views/searchPage";
import VocabsPage from "views/vocabsPage";
import RoadmapPage from "views/roadmapPage";
import AllPage from "views/allPage";
import IntPage from "views/intPage";
import AdvPage from "views/advPage";
import LoadingPage from "views/loadingPage";
const LoginPage = lazy(() => import("views/loginPage"))

function App() {
  const mode = useSelector((state) => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector((state) => state.token))
  const queryClient = new QueryClient()

  const pagesoverride: CSSProperties = {
    display: "block",
    margin: "12rem auto",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={
              <GridLoader
                color={theme.palette.neutral.light}
                loading={true}
                cssOverride={pagesoverride}
                size={20}
                margin={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            }>
              <Routes>
                <Route path="/login" element={isAuth ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />
                <Route path="/all/:userId" element={isAuth ? <AllPage /> : <LoginPage />} />
                <Route path="/int/:userId" element={isAuth ? <IntPage /> : <LoginPage />} />
                <Route path="/adv/:userId" element={isAuth ? <AdvPage /> : <LoginPage />} />
                <Route path="/label/:userId" element={isAuth ? <VocabsPage /> : <LoginPage />} />
                <Route path="/search/:userId" element={isAuth ? <SearchPage /> : <LoginPage />} />
                <Route path="/loading/:userId" element={isAuth ? <LoadingPage /> : <LoginPage />} />
                <Route path="/roadmap" element={isAuth ? <RoadmapPage /> : <LoginPage />} />
              </Routes>
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
