import { useState, useRef } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddPage.css";
import { TopicLabel, TagLabel } from "./Labels";
import { CommentList, CommentBlock } from "./CommentBlock";

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

function TitleField({
  label,
  defaultValue = "",
  suggestionList = [],
  handleChange,
}) {
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

  function handleInputChange(event) {
    const val = event.target.value;
    updatePredictions(val);
    setInputValue(val);
  }

  function handleClick(item) {
    inputRef.current.focus();
    updatePredictions("");
    setInputValue(item);
    handleChange(item);
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
        onChange={handleInputChange}
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

function DifficultyField({
  label,
  defaultValue = "",
  selectionList = [],
  handleChange,
}) {
  function handleSelection(e) {
    handleChange(e.target.value);
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

function LabelField({
  data,
  label,
  currentList = [],
  Component,
  handleDelete,
  handleAdd,
}) {
  const [showInput, setShowInput] = useState(false);
  function handleClick() {
    setShowInput(true);
  }

  function handleInputBlur(event) {
    const val = event.target.value;
    handleAdd(label, val);
    setShowInput(false);
  }

  return (
    <td className="LabelField">
      <div>
        <label>{label}</label>
      </div>
      {currentList.map((x, i) => (
        <Component
          txt={x}
          key={i}
          handleDelete={() => handleDelete(label, x)}
        />
      ))}
      {showInput && (
        <input name={label} onBlur={handleInputBlur} autoComplete="off"></input>
      )}
      <button className="LabelFieldAdd" onClick={handleClick}>
        &#43;
      </button>
    </td>
  );
}

function CommentField({ data, handleEdit, handleDelete, handleAdd }) {
  const init_new_commit = {
    state: "",
    status: "",
    comment: "",
  };

  const [showInput, setShowInput] = useState(false);
  function handleClick() {
    setShowInput(true);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const comment = {};
    comment.date = event.target[0].value;
    comment.status = event.target[1].value;
    comment.state = event.target[2].value;
    comment.comment = event.target[3].value;
    handleAdd(comment);
    setShowInput(false);
  }
  return (
    <td colSpan="100%" className="CommentField">
      <div>
        <label>Comments</label>
      </div>
      <CommentList data={data} />
      {showInput && (
        <>
          <form className="CommentFieldInputDiv" onSubmit={handleFormSubmit}>
            <DatePicker
              showIcon
              selected={date}
              startDate={date}
              endDate={null}
              dateFormat="dd/MM/yyyy"
            />
            <input
              name="inputStatus"
              className="CommentFieldInputStatus"
              autoComplete="off"
            ></input>
            <input
              name="inputState"
              className="CommentFieldInputState"
              autoComplete="off"
            ></input>
            <input
              name="inputComment"
              className="CommentFieldInputComment"
              autoComplete="off"
            ></input>
            <button type="submit">Save</button>
          </form>
        </>
      )}
      <button className="CommentFieldAdd" onClick={handleClick}>
        &#43;
      </button>
    </td>
  );
}

function AddPageContent({ data, entity, handleEntityChange }) {
  const [date, setDate] = useState(new Date());
  const [lastEdit, setLastEdit] = useState(new Date());
  const difficultySelectionList = ["Easy", "Medium", "Hard"];
  const titleSuggestionList = Object.entries(data).map(
    ([key, val]) => val.title
  );

  function handleDateChange(d) {
    const entityTemp = structuredClone(entity);
    entityTemp.date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    setDate(d);
    handleEntityChange(entityTemp);
  }

  function handleLastEditChange(d) {
    const entityTemp = structuredClone(entity);
    entityTemp.last_edit = d.valueOf();
    setLastEdit(d);
    handleEntityChange(entityTemp);
  }

  function handleTitleChange(title) {
    const entityTemp = structuredClone(entity);
    if (titleSuggestionList.includes(title)) {
      const id = parseInt(title.split(".")[0]);
      const d = data[id];
      entityTemp.difficulty = d.difficulty;
      entityTemp.topics = d.topics;
      entityTemp.tags = d.tags;
      entityTemp.comments = d.comments;
    }
    entityTemp.title = title;
    handleEntityChange(entityTemp);
  }

  function handleDifficultyChange(difficulty) {
    const entityTemp = structuredClone(entity);
    entityTemp.difficulty = difficulty;
    handleEntityChange(entityTemp);
  }

  function handleLabelDelete(field, label) {
    const entityTemp = structuredClone(entity);
    if (field === "Topics") {
      let topicsTemp = entity.topics.slice();
      topicsTemp.splice(topicsTemp.indexOf(label), 1);
      entityTemp.topics = topicsTemp;
    } else if (field === "Tags") {
      let tagsTemp = entity.tags.slice();
      tagsTemp.splice(tagsTemp.indexOf(label), 1);
      entityTemp.tags = tagsTemp;
    }
    handleEntityChange(entityTemp);
  }

  function handleLabelAdd(field, label) {
    const entityTemp = structuredClone(entity);
    if (field === "Topics") {
      let topicsTemp = entity.topics.slice();
      topicsTemp.push(label);
      entityTemp.topics = topicsTemp;
    } else if (field === "Tags") {
      let tagsTemp = entity.tags.slice();
      tagsTemp.push(label);
      entityTemp.tags = tagsTemp;
    }
    handleEntityChange(entityTemp);
  }

  function handleCommentEdit(comment) {
    const entityTemp = structuredClone(entity);
    handleEntityChange(entityTemp);
  }

  function handleCommentDelete(comment) {
    const entityTemp = structuredClone(entity);
    handleEntityChange(entityTemp);
  }

  function handleCommentAdd(comment) {
    const entityTemp = structuredClone(entity);
    entityTemp.comments.push(comment);
    handleEntityChange(entityTemp);
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
          <TitleField
            label="Title"
            suggestionList={titleSuggestionList}
            handleChange={handleTitleChange}
          />
          <DifficultyField
            label="Difficulty"
            selectionList={difficultySelectionList}
            handleChange={handleDifficultyChange}
          />
          <LabelField
            label="Topics"
            currentList={entity.topics}
            Component={TopicLabel}
            handleDelete={handleLabelDelete}
            handleAdd={handleLabelAdd}
          />
          <LabelField
            label="Tags"
            currentList={entity.tags}
            Component={TagLabel}
            handleDelete={handleLabelDelete}
            handleAdd={handleLabelAdd}
          />
        </tr>
        <tr>
          <CommentField
            data={entity.comments}
            handleEdit={handleCommentEdit}
            handleDelete={handleCommentDelete}
            handleAdd={handleCommentAdd}
          />
        </tr>
      </tbody>
    </table>
  );
}

export default function AddPage({ data, handleSave }) {
  const init_entity = {
    date: "",
    last_edit: "",
    title: "",
    difficulty: "Easy",
    status: "",
    count: 0,
    topics: [],
    tags: [],
    comments: [],
  };
  const [entity, setEntity] = useState(init_entity);

  function handleSaveButtonClick() {
    //Check if title is valid
    const entityTemp = structuredClone(entity);
    if (!entityTemp) return;
    try {
      const id = parseInt(entityTemp.title.split(".")[0]);
      if (id == NaN) return;
    } catch (error) {
      return;
    }

    //Update count and status
    entityTemp.status = entityTemp.comments.length
      ? entityTemp.comments.at(-1).status
      : "";
    entityTemp.count = entityTemp.comments.length;
    setEntity(entityTemp);
    handleSave(entityTemp);
  }

  function handleEntityChange(entity) {
    setEntity(entity);
  }

  function handlePopupClose() {
    setEntity(init_entity);
  }

  return (
    <Popup
      className="AddPagePopup"
      trigger={<button className="button"> Add </button>}
      onClose={handlePopupClose}
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Add Comment </div>
          <div className="content">
            <AddPageContent
              data={data}
              entity={entity}
              handleEntityChange={handleEntityChange}
            />
          </div>
          <div className="actions">
            <button
              className="Save"
              onClick={() => {
                handleSaveButtonClick();
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
