import { useRef, useLayoutEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./Labels.css";

export function Label({ txt, handleDelete = null }) {
  return (
    <label className="Label">
      {txt}
      {typeof handleDelete === "function" && (
        <span
          className="FilterTagDelete"
          onClick={() => handleDelete(txt)}
        ></span>
      )}
    </label>
  );
}

export function DifficultyLabel({ txt, handleDelete = null }) {
  return (
    <label
      className="DifficultyLabel"
      style={{
        color:
          txt == "Easy"
            ? "green"
            : txt == "Medium"
            ? "orange"
            : txt == "Hard"
            ? "red"
            : "currentColor",
      }}
    >
      {txt}
      {typeof handleDelete === "function" && (
        <span
          className="FilterTagDelete"
          onClick={() => handleDelete(txt)}
        ></span>
      )}
    </label>
  );
}

export function TopicLabel({
  txt,
  onLabelClick,
  updateWidth = null,
  handleDelete = null,
}) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (ref.current && typeof updateWidth === "function") {
      updateWidth(ref.current.offsetWidth);
    }
  }, []);

  return (
    <label className="TopicLabel" onClick={onLabelClick} ref={ref}>
      {txt}
      {typeof handleDelete === "function" && (
        <span
          className="FilterTagDelete"
          onClick={() => handleDelete(txt)}
        ></span>
      )}
    </label>
  );
}

export function TagLabel({
  txt,
  onLabelClick,
  updateWidth = null,
  handleDelete = null,
}) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (ref.current && typeof updateWidth === "function") {
      updateWidth && updateWidth(ref.current.offsetWidth);
    }
  }, []);

  return (
    <label className="TagLabel" onClick={onLabelClick} ref={ref}>
      {txt}
      {typeof handleDelete === "function" && (
        <span
          className="FilterTagDelete"
          onClick={() => handleDelete(txt)}
        ></span>
      )}
    </label>
  );
}

export function LabelList({ Component, cell_width, txt_list, onLabelClick }) {
  const [totalChildWidth, setTotalChildWidth] = useState(0);
  const handleUpdateWidth = (width) => {
    setTotalChildWidth((prevWidth) => prevWidth + width);
  };

  const allComps = txt_list.map((x, i) => (
    <Component
      txt={typeof x == "string" ? x : String(x)}
      key={i}
      onLabelClick={onLabelClick ? () => onLabelClick(x) : null}
      updateWidth={handleUpdateWidth}
    />
  ));
  return (
    <>
      {totalChildWidth <= cell_width || allComps.length == 1 ? (
        allComps
      ) : (
        <Popup
          trigger={
            <div>
              <Component txt={"..."} onLabelClick={null} />
            </div>
          }
          on={"hover"}
          position="bottom left"
        >
          <div className="LabelListModal">
            {allComps.map((x, i) => (
              <div className="content" key={i}>
                {x}
              </div>
            ))}
          </div>
        </Popup>
      )}
    </>
  );
}
