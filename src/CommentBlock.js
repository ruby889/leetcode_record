export function CommentList({ data }) {
  if (!data) return;
  return (
    <ul className="CommentList">
      {data.map((cmt, i) => (
        <li className="CommentList" key={i}>
          <label className="CommentBlockDate"> {cmt.date}: </label>
          <label className="CommentBlockState">
            [{cmt.status} / {cmt.state}]
          </label>
          <label className="CommentBlockComment">{cmt.comment}</label>
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
