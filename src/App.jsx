import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollegeList from "./components/CollegeList";
import CollegeDetails from "./components/CollegeDetails";
import Home from "./Pages/Home";
import Authform from "./components/Authform";
import Profile from "./components/Profile";
import ProfileCompletion from "./Pages/ProfileCompletion";
import EditBio from "./Pages/EditBio";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colleges" element={<CollegeList />} />
        <Route path="/college/:id" element={<CollegeDetails />} />
        <Route path="/login" element={<Authform />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route path="/edit-bio" element={<EditBio />} />
      </Routes>
    </Router>
  );
}
export default App;
