import { useState } from "react";
function DropdownCloseEvent(event) {
  if (!event.target.id.match("dropdownbnt")) {
    var dropdowns = document.getElementsByClassName("dropdown-options");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "";
      }
    }
  }
}
window.addEventListener("click", DropdownCloseEvent);

function DropdownButton({ name, options, onSelection }) {
  function handleClick() {
    const id = "dropdown-options-" + name;
    const elem = document.getElementById(id);
    if (elem.style.display.match("block")) {
      elem.style.display = ""; //If it has shown, hide it
    } else {
      elem.style.display = "block";
    }

    //Close dropdown-options in other categories
    var dropdowns = document.getElementsByClassName("dropdown-options");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (
        !openDropdown.id.match(id) &&
        openDropdown.style.display.match("block")
      ) {
        openDropdown.style.display = "";
      }
    }
  }

  return (
    <div className="dropdown">
      <button
        id={"dropdownbnt-" + name}
        className="dropdownbnt"
        onClick={handleClick}
      >
        {name}
      </button>
      <div id={"dropdown-options-" + name} className="dropdown-options">
        {options.map((x) => (
          <a href="#" key={x} onClick={() => onSelection(name, x)}>
            {x}
          </a>
        ))}
      </div>
    </div>
  );
}

function FilteredDisplay({ selected }) {
  if (!(typeof selected === "object")) return;
  return (
    <div className="FilteredDisplay">
      {Object.entries(selected).map(([key, value]) =>
        value.map((tag) => (
          <label key={key + "_" + tag} className={key + "_FilterTag"}>
            {tag}
            <span className="FilterTagClose"></span>
          </label>
        ))
      )}
    </div>
  );
}

function FilterBar() {
  const options = {
    difficulty: ["Easy", "Medium", "Hard"],
    status: ["solved", "tried", "read"],
    topics: ["string", "array", "list"],
    tags: ["leet100", "blind75"],
  };
  const optionKeys = Object.keys(options); //Add in order
  const [selected, setSelected] = useState({});
  function handleResetClick() {}

  function handleSelection(category, item) {
    if (category in selected && selected[category].includes(item)) return;
    var selectedTemp = { ...selected };
    if (!(category in selectedTemp)) {
      selectedTemp[category] = [];
    }
    selectedTemp[category].push(item);
    setSelected(selectedTemp);
  }

  return (
    <div>
      <div>
        {optionKeys.map((x) => (
          <DropdownButton
            name={x}
            options={options[x]}
            onSelection={handleSelection}
            key={x}
          />
        ))}
      </div>
      <FilteredDisplay selected={selected} />
      <button className="ResetBnt" onClick={handleResetClick}>
        Reset
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
      <th scope="row">{data.date}</th>
      <td>{data.title}</td>
      <td>{data.difficulty}</td>
      <td>{data.status}</td>
      <td>
        {data.topics.map((x) => (
          <TopicLabel name={x} key={x} />
        ))}
      </td>
      <td>
        {data.tags.map((x) => (
          <TagLabel name={x} key={x} />
        ))}
      </td>
    </tr>
  );
}

function Table() {
  const headerCnt = 6;
  const dataStructName = [
    "date",
    "title",
    "difficulty",
    "status",
    "topics",
    "tags",
  ];
  const dataStruct = {
    0: {
      date: "1/2/2024",
      title: "0. banana",
      difficulty: "easy",
      status: "complete",
      topics: ["string", "array", "list"],
      tags: ["leet100", "blind75"],
    },
    1: {
      date: "2/2/2024",
      title: "11. nana",
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

  const headers = ["Date", "Title", "Difficulty", "Status", "Topics", "Tags"];
  return (
    <table className="maintable">
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
