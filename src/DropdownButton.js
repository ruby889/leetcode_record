export function DropdownCloseEvent(event) {
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

export function DropdownButton({ name, options, onSelect }) {
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
