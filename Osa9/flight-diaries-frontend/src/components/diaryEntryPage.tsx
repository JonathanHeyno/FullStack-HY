import { useState } from "react";
import axios from 'axios';
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "../types";
import entryService from "../services/diaryEntries";

interface Props {
  entries : DiaryEntry[]
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>
}

interface Radio {
  radioName: string
  radioChange: (value: string) => void;
  radioOptions: string[]
}

const Entry = ({ entry }: { entry: DiaryEntry }): JSX.Element => {
  return (
    <div>
      <p><b>{entry.date}</b><br/></p>
      visibility: {entry.visibility}<br/>
      weather: {entry.weather}<br/>
      comment: {entry.comment}<br/>
    </div>
  )
};

const Alert = ({ error }: { error: string }): JSX.Element => {
  if (error === '') {
    return <div></div>
  }
  return (
    <div style={{color: "red"}}>
      {error}
    </div>
  )
};

const Radio = ({ radioName, radioChange, radioOptions }: Radio): JSX.Element => {
  return (
    <div> <label htmlFor={radioName} style={{marginRight: '5px',}}>{radioName}: </label>
      {
      radioOptions.map((option: string) => {
        return (
          <span key={option}>
            {option} <input type="radio" name={radioName}
            onChange={() => radioChange(option)} />
          </span>
        )
      })
      }
    </div>
  );
};

const EntryForm = ({ entries, setEntries } : Props): JSX.Element => {
  const [error, setError] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState(Visibility.Good);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState<string>('');


  const submitNewEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newEntry: NewDiaryEntry= {
      date,
      weather,
      visibility,
      comment,
    }
    try {
      const entry = await entryService.create(newEntry);
      setEntries(entries.concat(entry));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          setError(message);
          setTimeout(function() {setError('')}, 4000);
        } else {
          setError("Unrecognized axios error");
          setTimeout(function() {setError('')}, 4000);
        }
      } else {
        setError("Unknown error");
        setTimeout(function() {setError('')}, 4000);
      }
    }
  };

  const onVisibilityChange = (value: string) => {
    if ( typeof value === "string") {
      const visibility = Object.values(Visibility).find(v => v.toString() === value);
      if (visibility) {
        setVisibility(visibility);
      }
    }
  };

  const onWeatherChange = (value: string) => {
    if ( typeof value === "string") {
      const weather = Object.values(Weather).find(w => w.toString() === value);
      if (weather) {
        setWeather(weather);
      }
    }
  };

  return (
    <div>
      <Alert error={error}/>
      <form onSubmit={submitNewEntry}>
        <div>
          <label htmlFor="date">date: </label>
          <input type="date" onChange={(event) => setDate(
            event.target.valueAsDate?.toISOString().split('T')[0] || ''
          )}/>
        </div>
        <Radio radioName="visibility" radioChange={onVisibilityChange}
          radioOptions={['great','good','ok','poor']} />
        <Radio radioName="weather" radioChange={onWeatherChange}
          radioOptions={['sunny','rainy','cloudy','stormy','windy']} />
        <div>
          <label htmlFor="comment">comment: </label>
            <input
              value={comment}
              onChange={({ target }) => setComment(target.value)}
              id="comment"
            />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
};

const DiaryEntryPage = ({ entries, setEntries } : Props ) => {
  return (
    <div className="App">
      <h1>Add new entry</h1>
      <EntryForm entries={entries} setEntries={setEntries}  />
      <h1>Diary entries</h1>
      {entries.map((entry: DiaryEntry) => <div key={entry.id}><Entry entry={entry} /><br/></div>)}
    </div>
  );
};

export default DiaryEntryPage;
