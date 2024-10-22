export function CommentList({
  data,
  editable = false,
  handleEdition = null,
  handleDeletion = null,
}) {
  if (!data) return;
  const bnts = editable
    ? [
        <button
          key={0}
          className="CommentEdit"
          onClick={handleEdition}
        ></button>,
        <button
          key={1}
          className="CommentDelete"
          onClick={handleDeletion}
        ></button>,
      ]
    : [];
  return (
    <ul className="CommentList">
      {data.map((cmt, i) => (
        <li className="CommentList" key={i}>
          <label className="CommentBlockDate"> {cmt.date}: </label>
          <label className="CommentBlockState">
            [{cmt.status} / {cmt.state}]
          </label>
          <label className="CommentBlockComment">{cmt.comment}</label>
          {bnts}
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
