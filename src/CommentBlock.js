export function CommentList({
  data,
  editable = false,
  handleEdit = null,
  handleDelete = null,
}) {
  if (!data) return;
  return (
    <ul className="CommentList">
      {data.map((cmt, i) => (
        <li className="CommentList" key={i}>
          <div>
            <label className="CommentBlockDate"> {cmt.date}: </label>
            <label className="CommentBlockState">
              [{cmt.status} / {cmt.state}]
            </label>
            <label className="CommentBlockComment">{cmt.comment}</label>
          </div>
          {editable && (
            <div>
              <button
                key={0}
                className="CommentEdit"
                onClick={handleEdit}
              ></button>
              <button
                key={1}
                className="CommentDelete"
                onClick={() => handleDelete(i)}
              ></button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CommentBlock({ data, showComment, colCnt }) {
  if (!showComment) return;
  return (
    <tr className="CommentBlock">
      <td colSpan={colCnt}>
        <CommentList data={data} />
      </td>
    </tr>
  );
}
