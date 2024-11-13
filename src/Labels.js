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

export function TopicLabel({ txt, onLabelClick, handleDelete = null }) {
  return (
    <label className="TopicLabel" onClick={onLabelClick}>
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

export function TagLabel({ txt, onLabelClick, handleDelete = null }) {
  return (
    <label className="TagLabel" onClick={onLabelClick}>
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

export function LabelList(component, txt_list, onLabelClick) {
  console.log(component);
  return (
    <>
      {/* {txt_list.map((x, i) => (
        <component
          txt={typeof x == "string" ? x : String(x)}
          key={i}
          onLabelClick={onLabelClick ? () => onLabelClick(attr, x) : null}
        />
      ))} */}
    </>
  );
}
