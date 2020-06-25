import React, { Suspense } from "react"
import { useHistory } from "react-router"
import { useRepoEntities } from "./hooks"
import { FileListPage } from "./FileListPage"
import { getPaths, getExpression } from "./selectors"

type Props = { owner: string; repo: string; branch: string }
export const Explorer = (props: Props) => {
  const EditorPage = React.lazy(() => import("./EditorPage"))

  const { owner, repo, branch } = props

  const { currentPath, parentPath, repositoryPath } = getPaths(
    location.pathname,
  )
  const expression = getExpression({ branch, repositoryPath })

  const result = useRepoEntities({
    owner,
    name: repo,
    expression,
  })
  const history = useHistory()

  const handleClickObject = (path: string) => {
    history.push(path)
  }

  switch (result.type) {
    case "Loading":
      return <div>Loading...</div>
    case "Tree": {
      const isRepositoryRoot = repositoryPath === ""

      return (
        <FileListPage
          entities={result.entities}
          currentPath={currentPath}
          parentPath={parentPath}
          isRepositoryRoot={isRepositoryRoot}
          handleClickObject={handleClickObject}
        />
      )
    }
    case "Blob":
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <EditorPage code={result.text} />
        </Suspense>
      )
  }
}
