import { useState, useEffect } from "react";

function DropdownCloseEvent(event) {
  if (!event.target.className.match("DropdownBtn")) {
    var dropdowns = document.getElementsByClassName("DropdownOptions");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openedDropdown = dropdowns[i];
      if (openedDropdown.style.display === "block") {
        openedDropdown.style.display = "";
      }
    }
  }
}
window.addEventListener("click", DropdownCloseEvent);

function DropdownButton({ name, options, onSelect }) {
  function handleClick() {
    const id = "DropdownOptions" + name;
    const elem = document.getElementById(id);
    if (elem.style.display.match("block")) {
      elem.style.display = ""; //If it has shown, hide it
    } else {
      elem.style.display = "block";
    }

    //Close DropdownOptions in other categories
    var dropdowns = document.getElementsByClassName("DropdownOptions");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openedDropdown = dropdowns[i];
      if (
        !openedDropdown.id.match(id) &&
        openedDropdown.style.display.match("block")
      ) {
        openedDropdown.style.display = "";
      }
    }
  }

  return (
    <div className="Dropdown">
      <button className="DropdownBtn" onClick={handleClick}>
        {name}
      </button>
      <div id={"DropdownOptions" + name} className="DropdownOptions">
        {options.map((x) => (
          <a href="#" key={x} onClick={() => onSelect(name, x)}>
            {x}
          </a>
        ))}
      </div>
    </div>
  );
}

function FilteredDisplay({ selected, onRemove }) {
  if (!(typeof selected === "object")) return;
  return (
    <div className="FilteredDisplay">
      {Object.entries(selected).map(([category, tags]) =>
        tags.map((tag, i) => (
          <label
            category={category + "_" + tag}
            className={category + "_FilterTag"}
            key={i}
          >
            {tag}
            <span
              className="FilterTagClose"
              onClick={() => onRemove(category, tag)}
            ></span>
          </label>
        ))
      )}
    </div>
  );
}

function FilterDiv({ options, selected, onSelect, onRemove, onReset }) {
  const optionKeys = Object.keys(options); //Add in order
  return (
    <div>
      <div>
        {optionKeys.map((category) => (
          <DropdownButton
            name={category}
            options={options[category]}
            onSelect={onSelect}
            key={category}
          />
        ))}
      </div>
      <FilteredDisplay selected={selected} onRemove={onRemove} />
      <button className="ResetBnt" onClick={onReset}>
        Reset
      </button>
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
  if (!data) return;
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

function Table({ data, dataStruct }) {
  const headerCnt = Object.keys(dataStruct).length;
  let dataCnt = Object.keys(data).length;
  const [orderIndex, setOrderIndex] = useState([
    ...Array(Object.keys(data).length).keys(),
  ]);
  const [order, setOrder] = useState(Array(headerCnt).fill(null));

  console.log("A:", data, dataCnt, "DATAINDEX:", orderIndex);
  // useEffect(() => {
  //   console.log("V:", dataCnt);
  //   setOrderIndex([...Array(Object.keys(data).length).keys()]);
  // }, [dataCnt]);

  function handleHeaderClick(i) {
    const sgn = order[i] ? -1 : 1;
    const name = dataStruct[i].name;
    const dataTemp = orderIndex.slice();
    dataTemp.sort(function (a, b) {
      const d1 = data[a][name];
      const d2 = data[b][name];
      if (d1 === d2) {
        return 0;
      } else {
        return d1 > d2 ? sgn : -sgn;
      }
    });
    var orderTemp = Array(headerCnt).fill(null);
    orderTemp[i] = !order[i];
    setOrderIndex(dataTemp);
    setOrder(orderTemp);
  }

  return (
    <table className="Maintable">
      <thead>
        <tr>
          {Object.keys(dataStruct).map((i) => (
            <TableHeader
              key={i}
              name={dataStruct[i].title}
              onHeaderClick={() => handleHeaderClick(i)}
              order={order[i]}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {orderIndex.map((x) => (
          <TableRow data={x in data ? data[x] : null} key={x} />
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const dataStruct = {
    0: { name: "date", title: "Date" },
    1: { name: "title", title: "Title" },
    2: { name: "difficulty", title: "Difficulty" },
    3: { name: "status", title: "Status" },
    4: { name: "topics", title: "Topics" },
    5: { name: "tags", title: "Tags" },
  };
  const initData = {
    0: {
      date: "1/2/2024",
      title: "0. banana",
      difficulty: "Easy",
      status: "Solved",
      topics: ["string", "array", "list"],
      tags: ["leet100", "blind75"],
    },
    1: {
      date: "2/2/2024",
      title: "11. nana",
      difficulty: "Medium",
      status: "Tried",
      topics: ["string"],
      tags: ["blind75"],
    },
  };
  const options = {
    difficulty: ["Easy", "Medium", "Hard"],
    status: ["Mastered", "Solved", "Tried", "Read"],
    topics: ["string", "array", "list"],
    tags: ["leet100", "blind75"],
  };

  //Add data to different categories
  const dataCategory = {};
  for (const [category, tagArr] of Object.entries(options)) {
    dataCategory[category] = Object.fromEntries(tagArr.map((x) => [x, []]));
    for (const [id, thisData] of Object.entries(initData)) {
      const tags = Array.isArray(thisData[category])
        ? thisData[category]
        : [thisData[category]];
      tags.forEach((tag) => dataCategory[category][tag].push(id));
    }
  }

  const [data, setData] = useState(initData);
  const [selected, setSelected] = useState({});
  function handleAddSelection(category, tag) {
    //Update selected array
    if (category in selected && selected[category].includes(tag)) return;
    var selectedTemp = { ...selected };
    if (!(category in selectedTemp)) {
      selectedTemp[category] = [];
    }
    selectedTemp[category].push(tag);
    setSelected(selectedTemp);

    //Update data
    const dataTemp = {};
    for (const id of dataCategory[category][tag]) {
      if (!(id in dataTemp)) dataTemp[id] = initData[id];
    }
    setData(dataTemp);
  }

  function handleRemoveSelection(category, tag) {
    const selectedTemp = structuredClone(selected);
    const i = selectedTemp[category].indexOf(tag);
    selectedTemp[category].splice(i, 1);
    if (!selectedTemp[category].length) {
      delete selectedTemp[category];
    }
    setSelected(selectedTemp);
  }

  function handleResetSelection() {
    setSelected({});
  }

  return (
    <>
      <h1 className="Header">Leetcode Record</h1>
      <FilterDiv
        options={options}
        selected={selected}
        onSelect={handleAddSelection}
        onRemove={handleRemoveSelection}
        onReset={handleResetSelection}
      />
      <Table data={data} dataStruct={dataStruct} />
    </>
  );
}
