export function Label({ txt, handleClose = null }) {
  return (
    <label className="Label">
      {txt}
      {typeof handleClose === "function" && (
        <span
          className="FilterTagClose"
          onClick={() => handleClose(txt)}
        ></span>
      )}
    </label>
  );
}

export function DifficultyLabel({ txt, handleClose = null }) {
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
      {typeof handleClose === "function" && (
        <span
          className="FilterTagClose"
          onClick={() => handleClose(txt)}
        ></span>
      )}
    </label>
  );
}

export function TopicLabel({ txt, onLabelClick, handleClose = null }) {
  return (
    <label className="TopicLabel" onClick={onLabelClick}>
      {txt}
      {typeof handleClose === "function" && (
        <span
          className="FilterTagClose"
          onClick={() => handleClose(txt)}
        ></span>
      )}
    </label>
  );
}

export function TagLabel({ txt, onLabelClick, handleClose = null }) {
  return (
    <label className="TagLabel" onClick={onLabelClick}>
      {txt}
      {typeof handleClose === "function" && (
        <span
          className="FilterTagClose"
          onClick={() => handleClose(txt)}
        ></span>
      )}
    </label>
  );
}
