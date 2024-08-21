import { useState } from "react";
function FilterBar() {}

function TableHeader({ name, onHeaderClick, order }) {
  function updateClassName(order) {
    if (order === null) {
      return "default";
    } else {
      return order === true ? "up" : "down";
    }
  }
  let orderName = updateClassName(order);
  return (
    <th scope="col" onClick={onHeaderClick} className={orderName}>
      {name}
    </th>
  );
}

function TableRow({ data }) {
  const [id, title, diff, sta, cat, tag] = data;
  return (
    <tr>
      <th scope="row">{id}</th>
      <td>{title}</td>
      <td>{diff}</td>
      <td>{sta}</td>
      <td>{cat}</td>
      <td>{tag}</td>
    </tr>
  );
}

function Table() {
  const headerCnt = 6;
  const temp = [
    {
      id: 0,
      title: "banana",
      difficulty: "easy",
      status: "complete",
      topics: ["string", "array"],
      tags: ["leet100", "blind75"],
    },
    {
      id: 1,
      title: "nana",
      difficulty: "med",
      status: "tried",
      topics: ["string"],
      tags: ["blind75"],
    },
  ];
  dataCnt = data.length;
  const [data, setData] = useState(temp);
  // const [data, setData] = useState([
  //   ["0", "Banana", "EASY", "DONE"],
  //   ["2", "nana", "MED", "ONLE"],
  // ]);

  const [order, setOrder] = useState(Array(headerCnt).fill(null));

  function handleHeaderClick(i) {
    var sgn = order[i] ? -1 : 1;
    const dataTemp = data.slice();
    dataTemp.sort(function (a, b) {
      if (a[i] === b[i]) {
        return 0;
      } else {
        return a[i] > b[i] ? sgn : -sgn;
      }
    });
    var orderTemp = Array(headerCnt).fill(null);
    orderTemp[i] = !order[i];
    setData(dataTemp);
    setOrder(orderTemp);
  }

  const headers = ["No.", "Title", "Difficulty", "Status", "Topics", "Tags"];
  return (
    <table className="mainTable">
      <thead>
        <tr>
          {headers.map((x, i) => (
            <TableHeader
              key={i}
              name={x}
              onHeaderClick={() => handleHeaderClick(i)}
              order={order[i]}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((obj) => (
          <TableRow data={obj} key={obj.id} />
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  return (
    <>
      <h1 className="header">Leetcode Record</h1>
      <FilterBar />
      <Table />
    </>
  );
}
