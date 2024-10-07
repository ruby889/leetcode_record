import { useState } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddPage.css";

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

function PlainField({ label, defaultValue = "" }) {
  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <input name={label} defaultValue={defaultValue} />
    </td>
  );
}

function LabelField({ label, defaultValue = "" }) {
  return (
    <td>
      <div>
        <label>{label}</label>
      </div>
      <input name={label} defaultValue={defaultValue} />
    </td>
  );
}

function AddPageContent() {
  const [date, setDate] = useState(new Date());
  function handleDateChange(d) {
    setDate(d);
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
          <PlainField label="Title" />
          <PlainField label="Level" />
          <LabelField label="Topics" />
          <LabelField label="Tags" />
        </tr>
      </tbody>
    </table>
  );
}

export default function AddPage() {
  return (
    <Popup trigger={<button className="button"> Add </button>} modal nested>
      {(close) => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Add Comment </div>
          <div className="content">
            <AddPageContent />
          </div>
          <div className="actions">
            <Popup
              trigger={<button className="button"> Trigger </button>}
              position="top center"
              nested
            >
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                magni omnis delectus nemo, maxime molestiae dolorem numquam
                mollitia, voluptate ea, accusamus excepturi deleniti ratione
                sapiente! Laudantium, aperiam doloribus. Odit, aut.
              </span>
            </Popup>
            <button
              className="button"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
            >
              close modal
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
