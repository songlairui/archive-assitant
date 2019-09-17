import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_DIRS = gql`
  query DirItems($fullpath: String!) {
    dirItems(fullpath: $fullpath) {
      name
      type
      ctime
      initGit
      remotes {
        name
        fetch
      }
    }
  }
`;

export default ({ fullpath = "/" }) => {
  const paths = fullpath.split(/\\\/+/);
  if (!fullpath || fullpath === "/") {
    return <div>--</div>;
  }
  const { loading, error, data } = useQuery(GET_DIRS, {
    variables: { fullpath }
  });

  if (loading || error) {
    return <div>{loading ? "loading" : `${error}`}</div>;
  }
  const { dirItems: files } = data;
  return (
    <div>
      <ul className="full-path">
        {paths.map((pathSect, idx) => (
          <li key={idx}>{pathSect}</li>
        ))}
      </ul>
      <table>
        <tbody>
          {files.map((file, idx) => (
            <tr key={idx} className="file-item">
              <td className="type">{file.type === "directory" ? "+" : " "}</td>
              <td className="name">{file.name}</td>
              <td className="ctime">{file.ctime}</td>
              {/* <td className="is-git">{file.initGit && "+"}</td> */}

              <div className="remotes">
                {file.initGit &&
                  file.remotes
                    .map(item => `${item.name}: ${item.fetch}`)
                    .join("")}
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
