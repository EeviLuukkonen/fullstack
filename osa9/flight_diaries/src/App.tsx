import { useEffect, useState } from "react";
import axios from "axios";

export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newDiaryEntry, setNewDiaryEntry] = useState<DiaryEntry>({
    id: 0,
    date: "",
    weather: "",
    visibility: "",
    comment: "",
  });
  const [error, setError] = useState<string>("");

  const createEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const entryToAdd = {
      ...newDiaryEntry,
      id: diaryEntries.length + 1,
    };

    try {
      const response = await axios.post("api/diaries", entryToAdd);
      setDiaryEntries(diaryEntries.concat(response.data));
      setNewDiaryEntry({
        id: 0,
        date: "",
        weather: "",
        visibility: "",
        comment: "",
      });
      setError("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data);
      } else {
        console.error(error);
        setError("Unknown error occured");
      }
    }
  };

  useEffect(() => {
    axios.get<DiaryEntry[]>("/api/diaries").then((response) => {
      setDiaryEntries(response.data);
    });
  }, []);

  return (
    <div>
      <h3>Add new entry</h3>

      <p>{error}</p>

      <form onSubmit={createEntry}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={newDiaryEntry.date}
            onChange={(e) =>
              setNewDiaryEntry({ ...newDiaryEntry, date: e.target.value })
            }
          />
        </div>

        <div>
          <label>Weather: </label>
          <input
            type="radio"
            name="sunny"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, weather: "sunny" })
            }
          />
          sunny
          <input
            type="radio"
            name="rainy"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, weather: "rainy" })
            }
          />
          rainy
          <input
            type="radio"
            name="cloudy"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, weather: "cloudy" })
            }
          />
          cloudy
          <input
            type="radio"
            name="stormy"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, weather: "stormy" })
            }
          />
          stormy
          <input
            type="radio"
            name="windy"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, weather: "windy" })
            }
          />
          windy
        </div>

        <div>
          <label>Visibility: </label>
          <input
            type="radio"
            name="great"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, visibility: "great" })
            }
          />
          great
          <input
            type="radio"
            name="good"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, visibility: "good" })
            }
          />
          good
          <input
            type="radio"
            name="ok"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, visibility: "ok" })
            }
          />
          ok
          <input
            type="radio"
            name="poor"
            onChange={() =>
              setNewDiaryEntry({ ...newDiaryEntry, visibility: "poor" })
            }
          />
          poor
        </div>

        <div>
          <label>Comment: </label>
          <input
            value={newDiaryEntry.comment}
            onChange={(e) =>
              setNewDiaryEntry({ ...newDiaryEntry, comment: e.target.value })
            }
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h3>Diary entries</h3>
      {diaryEntries.map((entry) => (
        <p key={entry.id}>
          <b>{entry.date}</b>
          <p />
          visibility: {entry.visibility}
          <br />
          weather: {entry.weather}
        </p>
      ))}
    </div>
  );
};

export default App;
