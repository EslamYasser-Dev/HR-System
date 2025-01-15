import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import Footer from "./components/footer";
// import Settings from "./pages/settings";
import { lazy, Suspense } from "react";
import Loading from "./components/loading";

const Absents = lazy(() => import("./pages/absents"));
const Monitoring = lazy(() => import("./pages/monitoring"));
const ManageEmployees = lazy(() => import("./pages/manageEmployees"));
const ManageCams = lazy(() => import("./pages/cams"));
const Home = lazy(() => import("./pages/Home"));

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow my-16">
        {" "}
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Monitoring" element={<Monitoring />} />
            <Route path="/attendance" element={<Absents />} />
            <Route path="/employees" element={<ManageEmployees />} />
            <Route path="/cameras" element={<ManageCams />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* <Route path="/profile/:id" element={<EmployeeProfile />} /> */}
          </Routes>
        </Suspense>
      </div>
      <Footer className="w-full" />
    </div>
  );
};

export default App;
