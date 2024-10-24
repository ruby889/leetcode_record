import React, { useState } from "react";
export function EditableLabel({ editComp, nonEditComp, enable = true }) {
  const [isEdit, setIsEdit] = useState(false);
  function handelClick() {
    if (!enable) return;
    setIsEdit(!isEdit);
  }
  const editComp1 = React.cloneElement(editComp, {
    onDoubleClick: handelClick,
    onBlur: handelClick,
  });
  const nonEditComp1 = React.cloneElement(nonEditComp, {
    onDoubleClick: handelClick,
    onBlur: handelClick,
  });
  return <>{isEdit ? editComp1 : nonEditComp1}</>;
}
