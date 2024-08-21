import { useState } from "react";
function FilterSlideDown({ onComplete }) {
  return (
    <div>
      <button>HIHI</button>
    </div>
  );
}

function FilteredDisplay() {}

function FilterBar() {
  const options = {
    difficulty: ["Easy", "Medium", "Hard"],
    status: ["solved", "tried", "read"],
    topics: [],
    tags: [],
  };
  const optionKeyOrder = Object.keys(options); //Add in order
  const [isSelecting, setIsSelecting] = useState(false);
  const [filter, setFilter] = useState([]);
  function handleFilterBntClick() {
    setIsSelecting(!isSelecting);
  }

  function handleFilterComplete() {}

  return (
    <div>
      {isSelecting && <FilterSlideDown onComplete={handleFilterComplete} />}
      <button className="filterBnt" onClick={handleFilterBntClick}>
        Filter
      </button>
    </div>
  );
}

function FilterDiv() {
  return (
    <div>
      <FilteredDisplay />
      <FilterBar />
    </div>
  );
}

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

function TopicLabel({ name }) {
  return <label className="TopicLabel">{name}</label>;
}

function TagLabel({ name }) {
  return <label className="TagLabel">{name}</label>;
}

function TableRow({ data }) {
  return (
    <tr>
      <th scope="row">{data.id}</th>
      <td>{data.title}</td>
      <td>{data.difficulty}</td>
      <td>{data.status}</td>
      <td>
        {data.topics.map((x) => (
          <TopicLabel name={x} key={data.id + "_topic_" + x} />
        ))}
      </td>
      <td>
        {data.tags.map((x) => (
          <TagLabel name={x} key={data.id + "_tag_" + x} />
        ))}
      </td>
    </tr>
  );
}

function Table() {
  const headerCnt = 6;
  const dataStructName = [
    "id",
    "title",
    "difficulty",
    "status",
    "topics",
    "tags",
  ];
  const dataStruct = {
    0: {
      id: 0,
      title: "banana",
      difficulty: "easy",
      status: "complete",
      topics: ["string", "array"],
      tags: ["leet100", "blind75"],
    },
    1: {
      id: 1,
      title: "nana",
      difficulty: "med",
      status: "tried",
      topics: ["string"],
      tags: ["blind75"],
    },
  };
  const dataCnt = Object.keys(dataStruct).length;
  const [dataIndex, setDataIndex] = useState([...Array(dataCnt).keys()]);
  const [order, setOrder] = useState(Array(headerCnt).fill(null));

  function handleHeaderClick(i) {
    const sgn = order[i] ? -1 : 1;
    const colDataName = dataStructName[i];
    const dataTemp = dataIndex.slice();
    dataTemp.sort(function (a, b) {
      const d1 = dataStruct[a][colDataName];
      const d2 = dataStruct[b][colDataName];
      if (d1 === d2) {
        return 0;
      } else {
        return d1 > d2 ? sgn : -sgn;
      }
    });
    var orderTemp = Array(headerCnt).fill(null);
    orderTemp[i] = !order[i];
    setDataIndex(dataTemp);
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
        {dataIndex.map((x) => (
          <TableRow data={dataStruct[x]} key={x} />
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  return (
    <>
      <h1 className="header">Leetcode Record</h1>
      <FilterDiv />
      <Table />
    </>
  );
}
