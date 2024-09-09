import { useState, useEffect, useMemo } from "react";

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
            style={{
              "background-color":
                category == "topics"
                  ? "#f5eded"
                  : category == "tags"
                  ? "#f5fcf0"
                  : "#f7f6f6",
              color:
                tag == "Easy"
                  ? "green"
                  : tag == "Medium"
                  ? "orange"
                  : tag == "Hard"
                  ? "red"
                  : "black",
            }}
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
  const optionKeys = Object.keys(options); //Add in headerSort
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

function TableHeader({ name, onHeaderClick, headerSort }) {
  function updateClassName(headerSort) {
    if (headerSort === null) {
      return "default";
    } else {
      return headerSort === true ? "up" : "down";
    }
  }
  let orderName = updateClassName(headerSort);
  return (
    <th scope="col" onClick={onHeaderClick} className={orderName}>
      {name}
    </th>
  );
}

function CommentBlock({ data, colCnt }) {
  if (!data.showComment) return;
  return (
    <tr className="CommentBlock">
      <td colSpan={colCnt}>
        <ul className="CommentBlock">
          {data.comments.map((cmt, i) => (
            <li className="CommentBlock" key={i}>
              <label className="CommentBlockDate"> {cmt.date}: </label>
              <label className="CommentBlockState">
                [{cmt.status} / {cmt.state}]
              </label>
              <label className="CommentBlockComment">{cmt.comment}</label>
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

function Label({ txt }) {
  return (
    <label
      className="Label"
      style={{
        color:
          txt == "Easy"
            ? "green"
            : txt == "Medium"
            ? "orange"
            : txt == "Hard"
            ? "red"
            : "black",
      }}
    >
      {txt}
    </label>
  );
}

function TopicLabel({ txt }) {
  return <label className={"TopicLabel"}>{txt}</label>;
}

function TagLabel({ txt }) {
  return <label className="TagLabel">{txt}</label>;
}

function TableRow({ data, tableStruct, onRowClick }) {
  const tds = [];
  for (const col of tableStruct) {
    const attr = col.name;
    const Component = col.component;
    const colData = Array.isArray(data[attr]) ? data[attr] : [data[attr]];
    tds.push(
      <td key={attr} onClick={onRowClick}>
        {colData.map((x, i) => (
          <Component
            className={attr}
            txt={typeof x == "string" ? x : String(x)}
            key={i}
          />
        ))}
      </td>
    );
  }
  return (
    <>
      <tr className="TableRow">{tds}</tr>
      <CommentBlock data={data} colCnt={tableStruct.length} />
    </>
  );
}

function Table({ data, tableStruct, onRowClick }) {
  const headerCnt = tableStruct.length;
  const [rowOrder, setRowOrder] = useState(Object.keys(data));
  const [headerSort, setHeaderSort] = useState(Array(headerCnt).fill(null));
  useMemo(() => {
    setRowOrder(Object.keys(data));
  }, [data]);

  function handleHeaderClick(i) {
    const sgn = headerSort[i] ? -1 : 1;
    const headerStr = tableStruct[i].name;
    const rowOrderTemp = rowOrder.slice();
    rowOrderTemp.sort(function (a, b) {
      const d1 = data[a][headerStr];
      const d2 = data[b][headerStr];
      if (d1 === d2) {
        return 0;
      } else {
        return d1 > d2 ? sgn : -sgn;
      }
    });
    var headerSortTemp = Array(headerCnt).fill(null);
    headerSortTemp[i] = !headerSort[i];
    setRowOrder(rowOrderTemp);
    setHeaderSort(headerSortTemp);
  }

  return (
    <table className="Maintable">
      <thead>
        <tr>
          {tableStruct.map((col, i) => (
            <TableHeader
              key={i}
              name={col.headerTxt}
              onHeaderClick={() => handleHeaderClick(i)}
              headerSort={headerSort[i]}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rowOrder.map((x) => (
          <TableRow
            data={data[x]}
            tableStruct={tableStruct}
            key={x}
            onRowClick={() => onRowClick(x)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const tableStruct = [
    { name: "date", headerTxt: "Date", component: Label },
    { name: "title", headerTxt: "Title", component: Label },
    { name: "difficulty", headerTxt: "Difficulty", component: Label },
    { name: "status", headerTxt: "Status", component: Label },
    { name: "count", headerTxt: "Count", component: Label },
    { name: "topics", headerTxt: "Topics", component: TopicLabel },
    { name: "tags", headerTxt: "Tags", component: TagLabel },
  ];
  const initData = {
    0: {
      date: "",
      title: "0. banana",
      difficulty: "Easy",
      status: "",
      count: 0,
      topics: ["string", "array", "list"],
      tags: ["leet100", "blind75"],
      comments: [
        {
          date: "19/01/2022",
          comment: "Dont know how",
          state: "No idea",
          status: "Read",
        },
        {
          date: "01/02/2022",
          comment: "Too easy lalalala",
          state: "Well done",
          status: "Mastered",
        },
      ],
      showComment: false,
    },
    1: {
      date: "",
      title: "11. nana",
      difficulty: "Medium",
      status: "",
      count: 0,
      topics: ["string"],
      tags: ["blind75"],
      comments: [
        {
          date: "12/11/2023",
          comment: "Blablabla",
          state: "Not optimal",
          status: "Read",
        },
      ],
      showComment: false,
    },
    12: {
      date: "",
      title: "11. nana",
      difficulty: "Hard",
      status: "",
      count: 0,
      topics: ["string"],
      tags: ["blind75"],
      comments: [
        {
          date: "12/11/2023",
          comment: "Blablabla",
          state: "Not optimal",
          status: "Read",
        },
      ],
      showComment: false,
    },
  };
  const options = {
    difficulty: ["Easy", "Medium", "Hard"],
    status: ["Mastered", "Solved", "Tried", "Read"],
    topics: ["string", "array", "list"],
    tags: ["leet100", "blind75"],
  };

  //Update data status for last comment
  for (const id in initData) {
    const thisData = initData[id];
    const n = thisData.comments.length;
    const lastComment = thisData.comments[n - 1];
    thisData.date = lastComment.date;
    thisData.status = lastComment.status;
    thisData.count = n;
  }

  //Seperate data for different categories
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
  const [dataFreq, setDataFreq] = useState({});

  function handleAddSelection(category, tag) {
    //Update selected tags
    if (category in selected && selected[category].includes(tag)) return;
    var selectedTemp = { ...selected };
    if (!(category in selectedTemp)) {
      selectedTemp[category] = [];
    }
    selectedTemp[category].push(tag);

    //Update data
    const dataFreqTemp = structuredClone(dataFreq);
    const dataTemp = !Object.keys(selected).length ? {} : structuredClone(data);
    for (const id of dataCategory[category][tag]) {
      if (!(id in dataTemp)) {
        dataTemp[id] = initData[id];
        dataFreqTemp[id] = 0;
      }
      dataFreqTemp[id] += 1;
    }

    setSelected(selectedTemp);
    setDataFreq(dataFreqTemp);
    setData(dataTemp);
  }

  function handleRemoveSelection(category, tag) {
    //Update selected tags
    const selectedTemp = structuredClone(selected);
    const i = selectedTemp[category].indexOf(tag);
    selectedTemp[category].splice(i, 1);
    if (!selectedTemp[category].length) {
      delete selectedTemp[category];
    }

    //Update data
    let dataTemp, dataFreqTemp;
    if (!Object.keys(selectedTemp).length) {
      dataTemp = initData;
      dataFreqTemp = {};
    } else {
      dataTemp = structuredClone(data);
      dataFreqTemp = structuredClone(dataFreq);
      for (const id of dataCategory[category][tag]) {
        if (dataFreqTemp[id] == 1) delete dataTemp[id]; //Don't delete if this id is included by other tags
        dataFreqTemp[id] -= dataFreqTemp[id] > 0 ? 1 : 0;
      }
    }

    setSelected(selectedTemp);
    setDataFreq(dataFreqTemp);
    setData(dataTemp);
  }

  function handleResetSelection() {
    setSelected({});
    setDataFreq({});
    setData(initData);
  }

  function handleRowClick(i) {
    const dataTemp = structuredClone(data);
    dataTemp[i].showComment = !dataTemp[i].showComment;
    setData(dataTemp);
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
      <Table
        data={data}
        tableStruct={tableStruct}
        onRowClick={handleRowClick}
      />
    </>
  );
}
