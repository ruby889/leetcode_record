import { useState, useRef } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddPage.css";
import { TopicLabel, TagLabel } from "./Labels";
import { CommentList } from "./CommentBlock";

function TitleField({
  label,
  defaultValue = "",
  suggestionList = [],
  handleChange,
}) {
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
    handleChange(val);
  }

  function handleClick(item) {
    updatePredictions("");
    setInputValue(item);
    handleChange(item);
  }

  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <Popup
        trigger={
          <input
            name={label}
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
          />
        }
        on={"focus"}
        position="bottom left"
      >
        <div className="AddPageTitleModal">
          {predictions.map((item, index) => (
            <div
              className="PredictionItem"
              key={index + item}
              onClick={() => handleClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </Popup>
    </td>
  );
}

function CountField({ label, value, handleValueChange }) {
  return (
    <td className="CountField">
      <div>
        <label>{label}</label>
      </div>
      <button onClick={() => handleValueChange(value - 1)}>&#8722;</button>
      <label>{value}</label>
      <button onClick={() => handleValueChange(value + 1)}>&#43;</button>
    </td>
  );
}

function HintField({ label, inputValue, handleValueChange }) {
  return (
    <td className="CountField">
      <div>
        <label>{label}</label>
      </div>
      <input
        name={label}
        value={inputValue}
        onChange={(event) => handleValueChange(event.target.value)}
        autoComplete="off"
      />
    </td>
  );
}

function DifficultyField({
  label,
  selectValue = "",
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
        value={selectValue}
        onChange={handleSelection}
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
        <input
          name={label}
          onBlur={handleInputBlur}
          autoComplete="off"
          autoFocus
        ></input>
      )}
      <button className="LabelFieldAdd" onClick={handleClick}>
        &#43;
      </button>
    </td>
  );
}

function CommentField({
  data,
  handleEdit,
  handleDelete,
  handleAdd,
  statusDefaultValue,
  statusSelectionList,
}) {
  const init_new_commit = {
    status: "",
    comment: "",
  };
  const [date, setDate] = useState(new Date());
  const [showInput, setShowInput] = useState(false);
  function handleClick() {
    setShowInput(true);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const comment = {};
    comment.date = event.target[0].value;
    comment.status = event.target[1].value;
    comment.comment = event.target[2].value;
    handleAdd(comment);
    setShowInput(false);
  }

  function handleDateChange(d) {
    setDate(d);
  }
  return (
    <td colSpan="100%" className="CommentField">
      <div>
        <label>Comments</label>
      </div>
      <CommentList
        data={data}
        editable={true}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {showInput && (
        <>
          <form className="CommentFieldInputDiv" onSubmit={handleFormSubmit}>
            <DatePicker
              showIcon
              selected={date}
              startDate={date}
              endDate={null}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => handleDateChange(date)}
            />
            <label>Status: </label>
            <select
              className="CommentStatusSelect"
              defaultValue={statusDefaultValue}
            >
              {statusSelectionList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label>Comment: </label>
            <input
              name="inputComment"
              className="CommentFieldInputComment"
              autoComplete="off"
            ></input>
            <button type="submit">Add</button>
          </form>
        </>
      )}
      <button className="CommentFieldAdd" onClick={handleClick}>
        &#43;
      </button>
    </td>
  );
}

function AddPageContent({
  data,
  entity,
  handleEntityChange,
  difficultySelectionList,
  statusSelectionList,
}) {
  const titleSuggestionList = Object.entries(data).map(
    ([key, val]) => val.title
  );

  function handleTitleChange(title) {
    let entityTemp = structuredClone(entity);
    if (titleSuggestionList.includes(title)) {
      const id = parseInt(title.split(".")[0]);
      entityTemp = structuredClone(data[id]);
    }
    entityTemp.title = title;
    handleEntityChange(entityTemp);
  }

  function handleCountChange(count) {
    const entityTemp = structuredClone(entity);
    entityTemp.count = count;
    handleEntityChange(entityTemp);
  }

  function handleHintChange(hint) {
    const entityTemp = structuredClone(entity);
    entityTemp.hint = hint;
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

  function handleCommentEdit(type, i, value) {
    const entityTemp = structuredClone(entity);
    entityTemp.comments[i][type] = value;
    handleEntityChange(entityTemp);
  }

  function handleCommentDelete(i) {
    const entityTemp = structuredClone(entity);
    entityTemp.comments.splice(i, 1);
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
          {/* <DateField
            label="Date"
            defaultDate={date}
            onDateChange={handleDateChange}
          /> */}
          <TitleField
            label="Title"
            suggestionList={titleSuggestionList}
            handleChange={handleTitleChange}
          />
          <CountField
            label="Count"
            value={entity.count}
            handleValueChange={handleCountChange}
          />
          <HintField
            label="Hint"
            inputValue={entity.hint}
            handleValueChange={handleHintChange}
          />
          <DifficultyField
            label="Difficulty"
            selectValue={entity.difficulty}
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
            statusDefaultValue={statusSelectionList[0]}
            statusSelectionList={statusSelectionList}
          />
        </tr>
      </tbody>
    </table>
  );
}

export default function AddPage({
  data,
  handleSave,
  difficultySelectionList,
  statusSelectionList,
}) {
  const init_entity = {
    date: "",
    last_edit: "",
    title: "",
    difficulty: "Easy",
    status: "",
    count: 0,
    hint: "",
    topics: [],
    tags: [],
    comments: [],
  };
  const [entity, setEntity] = useState(init_entity);
  const [lastEditUpdate, setLastEditUpdate] = useState(true);

  function handleSaveButtonClick() {
    //Check if title is valid
    const entityTemp = structuredClone(entity);
    const id = parseInt(entityTemp.title.split(".")[0]);
    if (!entityTemp || isNaN(id)) return;

    //Update date
    if (entityTemp.comments.length) {
      entityTemp.date = entityTemp.comments.at(-1).date;
    } else if (entityTemp.date == "") {
      const date = new Date();
      entityTemp.date = `${date.getDate()}/${
        date.getMonth
      }/${date.getFullYear()}`;
    }

    //Update last_edit
    if (lastEditUpdate || !entityTemp.last_edit) {
      entityTemp.last_edit = (Date.now() / 1000).toString();
    }

    //Update status
    entityTemp.status = entityTemp.comments.length
      ? entityTemp.comments.at(-1).status
      : "";

    setEntity(entityTemp);
    handleSave(entityTemp);
  }

  function handleEntityChange(entity) {
    setEntity(entity);
  }

  function handlePopupClose() {
    setEntity(init_entity);
    setLastEditUpdate(true);
  }

  function handleLastEditTimeUpdate() {
    setLastEditUpdate(!lastEditUpdate);
  }

  return (
    <Popup
      className="AddPagePopup"
      trigger={<button className="button"> Add / Delete Comment </button>}
      onClose={handlePopupClose}
      modal
      nested
    >
      {(close) => (
        <div className="AddPageModal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Add / Delete Comment </div>
          <div className="content">
            <AddPageContent
              data={data}
              entity={entity}
              handleEntityChange={handleEntityChange}
              difficultySelectionList={difficultySelectionList}
              statusSelectionList={statusSelectionList}
            />
            <label>
              <input
                type="checkbox"
                defaultChecked={lastEditUpdate}
                onChange={handleLastEditTimeUpdate}
              />
              Update Last Edit Time
            </label>
          </div>
          <div className="AddPageActions">
            <button
              className="AddPageSave"
              onClick={() => {
                handleSaveButtonClick();
                close();
              }}
            >
              Save
            </button>
            <button
              className="AddPageCancel"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
