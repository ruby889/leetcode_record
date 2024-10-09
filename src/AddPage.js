import { useState, useRef } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddPage.css";
import { TopicLabel, TagLabel } from "./Labels";

function DateField({ label, defaultDate, onDateChange }) {
  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <DatePicker
        showIcon
        selected={defaultDate}
        startDate={defaultDate}
        endDate={null}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => onDateChange(date)}
      />
    </td>
  );
}

function TitleField({ label, defaultValue = "", suggestionList = [] }) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState([]);
  function updatePredictions(val) {
    let predictionsTemp = [];
    if (val != "") {
      predictionsTemp = suggestionList.filter(
        (item) => item.toLowerCase().startsWith(val.toLowerCase()) == 1
      );
    }
    setPredictions(predictionsTemp);
  }

  function onChange(event) {
    const val = event.target.value;
    updatePredictions(val);
    setInputValue(val);
  }

  function handleClick(item) {
    inputRef.current.focus();
    updatePredictions("");
    setInputValue(item);
  }

  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <input
        ref={inputRef}
        name={label}
        value={inputValue}
        onChange={onChange}
        autoComplete="off"
      />
      {predictions.map((item, index) => (
        <div
          className="PredictionItem"
          key={index + item}
          onClick={() => handleClick(item)}
        >
          {item}
        </div>
      ))}
    </td>
  );
}

function DifficultyField({ label, defaultValue = "", selectionList = [] }) {
  function handleSelection(e) {
    console.log(e.target.value);
  }
  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <select
        className="DifficultySelect"
        onChange={handleSelection}
        defaultValue={defaultValue}
      >
        {selectionList.map((item, i) => (
          <option key={i} value={item}>
            {item}
          </option>
        ))}
      </select>
    </td>
  );
}

function LabelField({ label, currentList = [], Component, handleClose }) {
  function handleClick() {}
  return (
    <td className="LabelField">
      <div>
        <label>{label}</label>
      </div>
      {currentList.map((x, i) => (
        <Component txt={x} key={i} handleClose={() => handleClose(label, x)} />
      ))}
      <button className="LabelFieldAdd" onClick={handleClick}>
        &#43;
      </button>
    </td>
  );
}

function AddPageContent({ titleSuggestionList }) {
  const [date, setDate] = useState(new Date());
  const [topicList, setTopicList] = useState(["ABC", "BBV", "BBVD", "KKOKOJ"]);
  const [tagList, setTagList] = useState(["ABC", "BBV", "BBVD"]);
  // const titleSuggestionList = ["ABC", "BBV", "BBVD"];
  const difficultySelectionList = ["Easy", "Medium", "Hard"];

  function handleDateChange(d) {
    setDate(d);
  }

  function handleLabelClose(field, label) {
    if (field === "Topics") {
      let temp = topicList.slice();
      temp.splice(temp.indexOf(label), 1);
      setTopicList(temp);
    } else if (field === "Tags") {
      let temp = tagList.slice();
      temp.splice(temp.indexOf(label), 1);
      setTagList(temp);
    }
  }
  return (
    <table className="AddPageContentTable">
      <tbody>
        <tr>
          <DateField
            label="Date"
            defaultDate={date}
            onDateChange={handleDateChange}
          />
          <TitleField label="Title" suggestionList={titleSuggestionList} />
          <DifficultyField
            label="Difficulty"
            selectionList={difficultySelectionList}
          />
          <LabelField
            label="Topics"
            currentList={topicList}
            Component={TopicLabel}
            handleClose={handleLabelClose}
          />
          <LabelField
            label="Tags"
            currentList={tagList}
            Component={TagLabel}
            handleClose={handleLabelClose}
          />
        </tr>
      </tbody>
    </table>
  );
}

export default function AddPage({ currentTitleList }) {
  return (
    <Popup trigger={<button className="button"> Add </button>} modal nested>
      {(close) => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Add Comment </div>
          <div className="content">
            <AddPageContent titleSuggestionList={currentTitleList} />
          </div>
          <div className="actions">
            <button
              className="Save"
              onClick={() => {
                close();
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
