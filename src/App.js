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
  ordername = updateClassName(order);
  return (
    <th scope="col" onClick={onHeaderClick} className={ordername}>
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
  const [data, setData] = useState([
    ["0", "Banana", "EASY", "DONE"],
    ["2", "nana", "MED", "ONLE"],
  ]);
  const [order, setOrder] = useState(Array(headerCnt).fill(null));

  function handleHeaderClick(i) {
    sgn = order[i] ? -1 : 1;
    dataTemp = data.slice();
    dataTemp.sort(function (a, b) {
      if (a[i] === b[i]) {
        return 0;
      } else {
        return a[i] > b[i] ? sgn : -sgn;
      }
    });
    order[i] = !order[i];
    setData(dataTemp);
    setOrder(order);
  }

  const headers = ["No.", "Title", "Difficulty", "Status", "Category", "Tags"];
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
          {/* <TableHeader name="No." onHeaderClick={() => handleHeaderClick(0) order={order[0]}} />
          <TableHeader
            name="Title"
            onHeaderClick={() => handleHeaderClick(1)
            }
          />
          <TableHeader
            name="Difficulty"
            onHeaderClick={() => handleHeaderClick(2)}
          />
          <TableHeader
            name="Status"
            onHeaderClick={() => handleHeaderClick(3)}
          />
          <TableHeader
            name="Category"
            onHeaderClick={() => handleHeaderClick(4)}
          />
          <TableHeader name="Tags" onHeaderClick={() => handleHeaderClick(5)} /> */}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <TableRow data={row} key={row[0]} />
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
