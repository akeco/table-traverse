import React, { useState } from "react";
import { Table, TableCell, TableRow } from "components/table/table";
import { v4 as uuidv4 } from "uuid";
import data from "assets/data.json";
import "./index.css";

type DataType = Record<string, string>;
type RowType = Record<string, { records: { data: DataType; kids: RowType }[] }>;
type NodeType = { data: DataType; kids: RowType };

function App() {
  const [uncollapsedRows, setUncollapsedRows] = useState<number[]>([]);
  const [deletedRows, setDeletedRows] = useState<number[]>([]);

  const onCollapseClick = (id: number) => {
    setUncollapsedRows((uncollapsedRows) => {
      if (uncollapsedRows.includes(id))
        return uncollapsedRows.filter((item: number) => item !== id);
      return [...uncollapsedRows, id];
    });
  };

  const onDeleteRow = (id: number) =>
    setDeletedRows((deletedRows) => [...deletedRows, id]);

  const getKey = (item: NodeType): number => {
    const data: DataType = item.data;
    return (
      Number(data["Identification number"]) |
      Number(data["Relative ID"]) |
      Number(data["Phone ID"])
    );
  };

  const traverse = (
    node: NodeType | NodeType[],
    title?: string
  ): React.ReactNode => {
    const isNodeArray = Array.isArray(node);
    const children: RowType | undefined = !isNodeArray ? node?.kids : undefined;
    const list: NodeType[] = children
      ? Object.keys(children).length
        ? Object.keys(children).map((key) => children[key].records)[0]
        : []
      : isNodeArray && node?.length
      ? node
      : [];
    const nodeData: NodeType[] = !isNodeArray && node?.data ? [node] : list;

    /* Filter rows by deleted ones */
    const filterdTableRows = nodeData.filter((item: NodeType) => {
      const key: number = getKey(item);
      return !deletedRows.includes(key);
    });

    /* If all rows in the table are removed, the return null and don't show table header with empty body */
    if (!filterdTableRows.length) return null;

    return (
      <Table
        key={uuidv4()}
        title={title}
        headerProperties={
          isNodeArray && node.length && node[0]?.data
            ? Object.keys(node[0].data)
            : !isNodeArray && node?.data
            ? Object.keys(node.data)
            : []
        }
      >
        {nodeData
          .filter((item: NodeType) => {
            const key: number = getKey(item);
            return !deletedRows.includes(key);
          })
          .map((item: NodeType) => {
            const children: RowType = item?.kids;
            const itemKey: number = getKey(item);

            const childrenTables: React.ReactNode[][] = Object.keys(
              children
            ).map((key: string) => {
              return children[key]?.records
                ?.map((item: NodeType) => {
                  if (!Object.keys(item).length) return null;
                  return traverse(item, key);
                })
                .filter(Boolean);
            });

            /* Does row has sub tables */
            const hasChildTable: boolean = !!(
              childrenTables.length && childrenTables?.[0]?.length
            );

            return (
              <React.Fragment key={itemKey}>
                <TableRow
                  className="border-b border-gray-300"
                  hasColapseIcon={!!hasChildTable}
                  isExpanded={uncollapsedRows.includes(itemKey)}
                  onColapseClick={() => onCollapseClick(itemKey)}
                  onDeleteRow={() => onDeleteRow(itemKey)}
                >
                  {Object.values(item.data).map((value: string) => (
                    <TableCell className="pl-2" key={uuidv4()}>
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
                {!!hasChildTable && (
                  <TableRow
                    className={
                      uncollapsedRows.includes(itemKey) ? "" : "hidden"
                    }
                    showRemoveButton={false}
                  >
                    <TableCell
                      className="pl-5"
                      colSpan={
                        isNodeArray && node.length && node[0]?.data
                          ? Object.keys(node[0].data).length + 1
                          : !isNodeArray && node.data
                          ? Object.keys(node.data).length + 1
                          : 1
                      }
                    >
                      {childrenTables}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
      </Table>
    );
  };

  return <div className="App">{traverse(data as NodeType[])}</div>;
}

export default App;
