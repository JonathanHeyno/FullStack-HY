import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DiaryEntry } from "./types";
import entryService from "./services/diaryEntries";
import DiaryEntryPage from "./components/diaryEntryPage";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchEntryList = async () => {
      const entries = await entryService.getAll();
      setEntries(entries);
    };
    void fetchEntryList();
  }, []);

  return (
    <div className="App">
      <Router>
        <div>
          <h1>Flight diaries</h1>
          <Routes>
            <Route path="/" element={<DiaryEntryPage entries={entries} setEntries={setEntries} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
