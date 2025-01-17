import { useState, useEffect, useMemo } from "react";
import AddPage from "./AddPage";
import {
  Label,
  DifficultyLabel,
  TopicLabel,
  TagLabel,
  LabelList,
} from "./Labels";
import { DropdownCloseEvent, DropdownButton } from "./DropdownButton";
import { CommentBlock } from "./CommentBlock";
window.addEventListener("click", DropdownCloseEvent);

function FilteredDisplay({ selected, onRemove }) {
  if (!(typeof selected === "object")) return;
  return (
    <div className="FilteredDisplay">
      {Object.entries(selected).map(([category, tags]) =>
        tags.map((tag, i) =>
          category == "topics" ? (
            <TopicLabel
              key={i}
              txt={tag}
              handleDelete={() => onRemove(category, tag)}
            />
          ) : category == "tags" ? (
            <TagLabel
              key={i}
              txt={tag}
              handleDelete={() => onRemove(category, tag)}
            />
          ) : category == "difficulty" ? (
            <DifficultyLabel
              key={i}
              txt={tag}
              handleDelete={() => onRemove(category, tag)}
            />
          ) : (
            <Label
              key={i}
              txt={tag}
              handleDelete={() => onRemove(category, tag)}
            />
          )
        )
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
        Reset Filter
      </button>
    </div>
  );
}

function TableHeader({ name, width, onHeaderClick, headerSort }) {
  function updateClassName(headerSort) {
    if (headerSort === 0) {
      return "default";
    } else {
      return headerSort === 1 ? "up" : "down";
    }
  }
  let orderName = updateClassName(headerSort);
  return (
    <th
      scope="col"
      onClick={onHeaderClick}
      className={orderName}
      width={String(width) + "px"}
    >
      {name}
    </th>
  );
}

function TableRow({ data, tableStruct, showComment, onRowClick }) {
  const tds = [];
  for (const col of tableStruct) {
    const onLabelClick = col.onClick;
    const attr = col.name;
    const Component = col.component;
    const onRowClick1 = onLabelClick ? null : onRowClick;
    const width = col.width;
    tds.push(
      <td className={attr} key={attr} onClick={onRowClick1}>
        {Array.isArray(data[attr]) ? (
          <LabelList
            Component={Component}
            cell_width={width}
            txt_list={data[attr]}
            onLabelClick={onLabelClick ? (x) => onLabelClick(attr, x) : null}
          />
        ) : (
          <Component
            txt={
              typeof data[attr] == "string" ? data[attr] : String(data[attr])
            }
            onLabelClick={
              onLabelClick ? () => onLabelClick(attr, data[attr]) : null
            }
          />
        )}
      </td>
    );
  }
  return (
    <>
      <tr className="TableRow">{tds}</tr>
      <CommentBlock
        data={data.comments}
        showComment={showComment}
        colCnt={tableStruct.length}
      />
    </>
  );
}

function sort(data_a, data_b, sgn, type) {
  let a = data_a[type];
  let b = data_b[type];
  if (type == "title") {
    return sortTitle(a, b, sgn);
  } else if (type == "last_edit" || type == "date") {
    a = data_a["last_edit"];
    b = data_b["last_edit"];
    return sortPlain(parseFloat(a), parseFloat(b), sgn);
  } else {
    return sortPlain(a, b, sgn);
  }
}

function sortPlain(a, b, sgn) {
  if (a === b) {
    return 0;
  } else {
    return a > b ? sgn : -sgn;
  }
}

function sortDate(a, b, sgn) {
  if (a != b) {
    const a_spl = a.split("/");
    const b_spl = b.split("/");
    for (let i = 2; i > -1; i--) {
      if (a_spl[i] == b_spl[i]) continue;
      return parseInt(a_spl[i]) > parseInt(b_spl[i]) ? sgn : -sgn;
    }
  }
  return 0;
}

function sortTitle(a, b, sgn) {
  const id1 = a.split(".")[0];
  const id2 = b.split(".")[0];
  if (id1 != id2) {
    return parseInt(id1) > parseInt(id2) ? sgn : -sgn;
  }
  return 0;
}

function Table({ data, tableStruct }) {
  const headerCnt = tableStruct.length;
  const [rowOrder, setRowOrder] = useState([]);
  const [headerSort, setHeaderSort] = useState(Array(headerCnt).fill(0));
  const [showComment, setShowComment] = useState(
    Object.fromEntries(Object.keys(data).map((x) => [x, false]))
  );
  useMemo(() => {
    //Default order by last_edit
    const rowOrderTemp = Object.keys(data);
    rowOrderTemp.sort(function (a, b) {
      return sort(data[a], data[b], 1, "last_edit");
    });
    setRowOrder(rowOrderTemp);

    setShowComment(
      Object.fromEntries(Object.keys(data).map((x) => [x, false]))
    );
    setHeaderSort(Array(headerCnt).fill(0));
  }, [data]);

  function handleHeaderClick(i) {
    const sortingDirect = (headerSort[i] + 1) % 3;
    const sgn = sortingDirect === 1 ? -1 : 1;
    const headerStr = tableStruct[i].name;
    const rowOrderTemp = rowOrder.slice();
    rowOrderTemp.sort(function (a, b) {
      const comp =
        sortingDirect === 0
          ? sort(data[a], data[b], sgn, "last_edit")
          : sort(data[a], data[b], sgn, headerStr);
      if (comp === 0) {
        return sort(data[a], data[b], sgn, "title");
      }
      return comp;
    });

    var headerSortTemp = Array(headerCnt).fill(0);
    headerSortTemp[i] = sortingDirect;
    setRowOrder(rowOrderTemp);
    setHeaderSort(headerSortTemp);
  }

  function handleRowClick(i) {
    const showCommentTemp = structuredClone(showComment);
    showCommentTemp[i] = !showCommentTemp[i];
    setShowComment(showCommentTemp);
  }

  return (
    <table className="Maintable">
      <thead>
        <tr>
          {tableStruct.map((col, i) => (
            <TableHeader
              key={i}
              name={col.headerTxt}
              width={col.width}
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
            showComment={showComment[x]}
            onRowClick={() => handleRowClick(x)}
          />
        ))}
      </tbody>
    </table>
  );
}

function getInitialData() {
  const initData = {
    0: {
      date: "",
      last_edit: "",
      title: "0. banana",
      difficulty: "Easy",
      status: "",
      count: 0,
      hint: "",
      topics: ["string", "array", "list"],
      tags: ["leet100", "blind75", "blind75blind75blind75blind75blind75"],
      comments: [
        {
          date: "19/01/2022",
          comment: "Dont know how",
          status: "Read",
        },
        {
          date: "01/02/2022",
          comment: "Too easy lalalala",
          status: "Mastered",
        },
      ],
    },
    1: {
      date: "",
      last_edit: "",
      title: "11. nana",
      difficulty: "Medium",
      status: "",
      count: 0,
      hint: "",
      topics: ["string"],
      tags: ["leet111", "blind755"],
      comments: [
        {
          date: "12/11/2023",
          comment: "Blablabla",
          status: "Read",
        },
      ],
    },
    12: {
      date: "",
      last_edit: "",
      title: "11. nana",
      difficulty: "Hard",
      status: "",
      count: 0,
      hint: "",
      topics: ["string"],
      tags: ["blind85"],
      comments: [
        {
          date: "12/11/2023",
          comment: "Blablabla",
          status: "Read",
        },
      ],
    },
  };

  for (const id in initData) {
    const thisData = initData[id];
    const n = thisData.comments.length;
    const lastComment = thisData.comments[n - 1];
    thisData.date = lastComment.date;
    thisData.status = lastComment.status;
    thisData.count = n;
  }
  return initData;
}

export default function App() {
  const window_width = window.innerWidth;
  const tag_width = parseInt((window_width * 0.3 - 3 * 60 - 40) / 2);
  const cols_width = [
    60,
    parseInt(0.4 * window_width),
    60,
    60,
    40,
    tag_width,
    tag_width,
    parseInt(0.3 * window_width),
  ];
  const tableStruct = [
    {
      name: "date",
      headerTxt: "Date",
      width: cols_width[0],
      component: Label,
      onClick: null,
    },
    {
      name: "title",
      headerTxt: "Title",
      width: cols_width[1],
      component: Label,
      onClick: null,
    },
    {
      name: "difficulty",
      headerTxt: "Difficulty",
      width: cols_width[2],
      component: DifficultyLabel,
      onClick: null,
    },
    {
      name: "status",
      headerTxt: "Status",
      width: cols_width[3],
      component: Label,
      onClick: null,
    },
    {
      name: "count",
      headerTxt: "Count",
      width: cols_width[4],
      component: Label,
      onClick: null,
    },
    {
      name: "topics",
      headerTxt: "Topics",
      width: cols_width[5],
      component: TopicLabel,
      onClick: handleAddSelection,
    },
    {
      name: "tags",
      headerTxt: "Tags",
      width: cols_width[6],
      component: TagLabel,
      onClick: handleAddSelection,
    },
    {
      name: "hint",
      headerTxt: "Hint",
      width: cols_width[7],
      component: Label,
      onClick: null,
    },
  ];

  const options0 = {
    difficulty: ["Easy", "Medium", "Hard"],
    status: ["Read", "Tried", "Solved", "Mastered"],
    topics: [],
    tags: [],
  };

  //Seperate data for different categories
  const dataCategory0 = {};
  for (const [category, tagArr] of Object.entries(options0)) {
    dataCategory0[category] = Object.fromEntries(tagArr.map((x) => [x, []]));
  }

  // const initData0 = getInitialData();
  // const [initData, setInitData] = useState(initData0);
  // const [displayData, setDisplayData] = useState(initData0);
  const [initData, setInitData] = useState({});
  const [displayData, setDisplayData] = useState({});
  const [selected, setSelected] = useState({});
  const [dataFreq, setDataFreq] = useState({});
  const [options, setOptions] = useState(options0);
  const [dataCategory, setDataCategory] = useState(dataCategory0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data");
      const jdata = await response.json();
      setInitData(jdata);
      setDisplayData(jdata);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const optionsTemp = structuredClone(options);
    const dataCategoryTemp = structuredClone(dataCategory);
    for (const [id, thisData] of Object.entries(initData)) {
      for (const category of Object.keys(optionsTemp)) {
        const tags = Array.isArray(thisData[category])
          ? thisData[category]
          : [thisData[category]];
        for (const tag of tags) {
          if (!optionsTemp[category].includes(tag)) {
            optionsTemp[category].push(tag);
            dataCategoryTemp[category][tag] = [];
          }
          if (!dataCategoryTemp[category][tag].includes(id))
            dataCategoryTemp[category][tag].push(id);
        }
      }
    }
    setOptions(optionsTemp);
    setDataCategory(dataCategoryTemp);
  }, [initData]);

  function handleAddSelection(category, tag) {
    //Skip if tag is already selected
    if (category in selected && selected[category].includes(tag)) return;

    //Add selected tag
    const selectedTemp = { ...selected };
    if (!(category in selectedTemp)) {
      selectedTemp[category] = [];
    }
    selectedTemp[category].push(tag);

    //Update data
    const dataFreqTemp = structuredClone(dataFreq);
    const displayDataTemp = {};
    for (const id of dataCategory[category][tag]) {
      if (!Object.keys(selected).length || id in displayData) {
        displayDataTemp[id] = structuredClone(displayData[id]);
      }
      dataFreqTemp[id] = id in dataFreqTemp ? dataFreqTemp[id] + 1 : 1;
    }
    setSelected(selectedTemp);
    setDataFreq(dataFreqTemp);
    setDisplayData(displayDataTemp);
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
    let displayDataTemp = {};
    let dataFreqTemp = structuredClone(dataFreq);
    if (!Object.keys(selectedTemp).length) {
      displayDataTemp = structuredClone(initData);
      dataFreqTemp = {};
    } else {
      let max_cnt = 0;
      for (const id of dataCategory[category][tag]) {
        dataFreqTemp[id] -= 1;
        max_cnt = Math.max(max_cnt, dataFreqTemp[id]);
      }
      for (const id in dataFreqTemp) {
        if (dataFreqTemp[id] == max_cnt) {
          displayDataTemp[id] = structuredClone(initData[id]);
        }
      }
    }
    setSelected(selectedTemp);
    setDataFreq(dataFreqTemp);
    setDisplayData(displayDataTemp);
  }

  function handleResetSelection() {
    setSelected({});
    setDataFreq({});
    setDisplayData(structuredClone(initData));
  }

  const updateBackendEntity = async (entity) => {
    const response = await fetch(`http://localhost:5000/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entity),
    });
    // const response_json = await response.json();
    // console.log(response_json);
  };

  function handleAddPageSave(entity) {
    const id = parseInt(entity.title.split(".")[0]);
    const initDataTemp = structuredClone(initData);
    initDataTemp[id] = entity;
    setInitData(initDataTemp);

    //Update display data
    const dataFreqTemp = structuredClone(dataFreq);
    const displayDataTemp = structuredClone(displayData);
    if (id in displayData) {
      displayDataTemp[id] = structuredClone(entity);
    } else {
      //Add if it fulfill current filter requirement
      for (const category in selected) {
        for (const tag of selected[category]) {
          if (!dataCategory[category][tag].includes(id)) return;
        }
      }
      displayDataTemp[id] = structuredClone(entity);
      if (Object.keys(selected).length)
        dataFreqTemp[id] = id in dataFreqTemp ? dataFreqTemp[id] + 1 : 1;
    }
    setDataFreq(dataFreqTemp);
    setDisplayData(displayDataTemp);
    updateBackendEntity({ [id]: entity }).catch(console.error);
  }

  return (
    <>
      <h1 className="Header">Leetcode Record</h1>
      <AddPage
        data={initData}
        handleSave={handleAddPageSave}
        difficultySelectionList={options0.difficulty}
        statusSelectionList={options0.status}
      />
      <label> {"Rows: " + Object.keys(displayData).length}</label>
      <FilterDiv
        options={options}
        selected={selected}
        onSelect={handleAddSelection}
        onRemove={handleRemoveSelection}
        onReset={handleResetSelection}
      />
      <Table data={displayData} tableStruct={tableStruct} />
    </>
  );
}
