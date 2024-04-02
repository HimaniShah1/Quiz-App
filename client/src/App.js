import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Quizes from "./pages/Quizes";
import Register from "./pages/Register";
import CreateQuiz from "./pages/CreateQuiz";
import QuizPage from "./pages/QuizPage";
import Results from "./pages/Results";
import UserContextProvider from "./contexts/UserContext";
import QuizSubmitted from "./pages/QuizSubmitted";
import EditQuiz from "./pages/EditQuiz";

function App() {
  return (
    <>
    <UserContextProvider>
    <Routes>
      <Route path="/" element={< Login />}/>
      <Route path="/register" element={< Register />}/>
      <Route path="/quizes" element={< Quizes />}/>
      <Route path="/createquiz" element={< CreateQuiz />}/>
      <Route path="/quiz/:_id" element={< QuizPage />} />
      <Route path='/results' element={<Results/>} />
      <Route path = "/quiz-submitted" component={QuizSubmitted} />
      <Route path="/edit/:id" element={<EditQuiz />} />
      
    </Routes>
    </UserContextProvider>
      
    </>
  );
}

export default App;
