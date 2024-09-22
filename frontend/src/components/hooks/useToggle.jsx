import { useState } from "react";

const useToggle = (initialVal = false, isTrue) => {
  const [toggle, setToggle] = useState(initialVal);
  function onToggle() {
    setToggle(!toggle);
  }

  return [toggle, onToggle];
};

export default useToggle;
