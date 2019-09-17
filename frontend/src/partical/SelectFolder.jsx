import React, { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_PATHS = gql`
  query getGreeting($fullpath: String!) {
    getPaths(fullpath: $fullpath)
  }
`;

export default function({ mark = "fullpath", onChange }) {
  const initial = localStorage.getItem(`__${mark}`) || "/";
  const [fullpath, setfullpath] = useState(initial);
  const [launch, { called, loading, data = {} }] = useLazyQuery(GET_PATHS, {
    variables: {
      fullpath
    }
  });

  const snap = function(value) {
    setfullpath(value);
    localStorage.setItem(`__${mark}`, value);
  };
  if (!called && initial !== "/") {
    launch();
  }
  if (called) {
    onChange && onChange(data.getPaths);
  }

  return (
    <div>
      <div className="input">
        <input
          type="text"
          onChange={e => snap(e.target.value)}
          value={fullpath}
        />
        <button onClick={() => launch()}>GET PATH</button>
      </div>

      {loading ? <p>Loading ...</p> : <div>{data.getPaths || "-"}</div>}
    </div>
  );
}
