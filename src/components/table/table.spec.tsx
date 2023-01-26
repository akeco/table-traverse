import { render, screen, fireEvent } from "@testing-library/react";
import { Table, TableCell, TableRow } from "components/table/table";

test("Test header table content", () => {
  render(<Table headerProperties={["first", "second", "third"]} />);
  const text = screen.getByText("first");
  expect(text).toBeInTheDocument();
  expect(() => screen.getByText("not-existing-header-label")).toThrow(
    "Unable to find an element"
  );
});

test("Test table actions", () => {
  const mockCollapseFn = jest.fn(() => console.log("expanded"));
  const mockRemoveFn = jest.fn(() => console.log("removed"));

  render(
    <Table headerProperties={["first", "second", "third"]}>
      <TableRow
        hasColapseIcon
        showRemoveButton
        onColapseClick={mockCollapseFn}
        onDeleteRow={mockRemoveFn}
      >
        <TableCell>first</TableCell>
        <TableCell>second</TableCell>
        <TableCell>third</TableCell>
      </TableRow>
    </Table>
  );

  const collapseButton = screen.getByRole("collapse-btn");
  expect(collapseButton).toBeInTheDocument();

  fireEvent.click(collapseButton);
  expect(mockCollapseFn).toBeCalledTimes(1);

  const removeButton = screen.getByRole("remove-btn");
  expect(removeButton).toBeInTheDocument();

  fireEvent.click(removeButton);
  expect(mockRemoveFn).toBeCalledTimes(1);
});
