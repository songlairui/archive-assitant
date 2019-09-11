import React, { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_PATHS = gql`
  query getGreeting($fullPath: String!) {
    getPaths(fullPath: $fullPath)
  }
`;

export default function({ mark = "fullPath", onChange }) {
  const [fullPath, setfullPath] = useState(
    localStorage.getItem(`__${mark}`) || "/"
  );
  const [launch, { called, loading, data = {} }] = useLazyQuery(GET_PATHS, {
    variables: {
      fullPath
    }
  });

  const snap = function(value) {
    setfullPath(value);
    localStorage.setItem(`__${mark}`, value);
  };
  if (called) {
    onChange && onChange(data.getPaths);
  }

  return (
    <div>
      <div className="input">
        <input
          type="text"
          onChange={e => snap(e.target.value)}
          value={fullPath}
        />
        <button onClick={() => launch()}>GET PATH</button>
      </div>

      {loading ? <p>Loading ...</p> : <div>{data.getPaths || "-"}</div>}
    </div>
  );
}
