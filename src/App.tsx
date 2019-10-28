import React, { useContext, useState, useRef, useEffect } from "react";

// Styles
import classes from "./styles.scss";
import SimpleWindow from "./SimpleWindow";

export default function App(): JSX.Element {
  const wrapper = useRef<HTMLDivElement>(null);
  const items = [];
  for (var i = 0; i < 100; ++i) {
    items.push(<div className={classes["black-box"]}>{i}</div>);
  }

  return (
    <div className={classes["wrapper"]}>
      <div className={classes["inner-wrapper"]} ref={wrapper}>
        <SimpleWindow items={items}></SimpleWindow>
      </div>
    </div>
  );
}
