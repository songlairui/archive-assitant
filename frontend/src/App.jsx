import React, { useState } from "react";
import "./App.css";

import SelectFolder from "./partical/SelectFolder";
import Folder from "./partical/Folder";

export default function() {
  const [dirA, setDirA] = useState("/");
  const [dirB, setDirB] = useState("/");
  return (
    <div className="App">
      <div className="row">
        <div className="col">
          <SelectFolder mark="fullPathA" onChange={val => setDirA(val)} />
          <Folder fullpath={dirA} />
        </div>
        <div className="col">
          <SelectFolder mark="fullPathB" onChange={val => setDirB(val)} />
          <Folder fullpath={dirB} />
        </div>
      </div>
    </div>
  );
}
