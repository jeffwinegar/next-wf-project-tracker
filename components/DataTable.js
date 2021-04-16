import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';

export default function Table({ columns, data, ...rest }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      ...(rest.initialSort && {
        initialState: { sortBy: rest.initialSort },
      }),
    },
    useSortBy
  );

  return (
    <StyledTable
      border="0"
      cellPadding="5"
      cellSpacing="0"
      {...getTableProps()}
    >
      {rest.caption && <StyledTableCaption>{rest.caption}</StyledTableCaption>}
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <StyledTableHeading {...column.getHeaderProps()}>
                <StyledToggle {...column.getSortByToggleProps()}>
                  <span>{column.render('Header')}</span>
                  <StyledToggleIndicator>
                    {column.isSorted ? (
                      <StyledCaret
                        style={
                          column.isSortedDesc
                            ? { transform: 'rotate(180deg)' }
                            : null
                        }
                      />
                    ) : (
                      ''
                    )}
                  </StyledToggleIndicator>
                </StyledToggle>
              </StyledTableHeading>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <StyledTableCell {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </StyledTableCell>
              ))}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
}

const StyledTable = styled.table`
  background-color: var(--white);
  cursor: default;
  margin-top: 1em;
  table-layout: fixed;
  width: 100%;
`;

const StyledTableCaption = styled.caption`
  background-color: inherit;
  font-size: 1.25em;
  line-height: calc(1ex / 0.36);
  padding: 0 10px 0.75em;
  text-align: left;
`;

const StyledTableHeading = styled.th`
  background-color: var(--white);
  border-bottom: solid 1px var(--gray);
  font-size: 85%;
  font-weight: 600;
  line-height: 1;
  overflow: hidden;
  position: sticky;
  text-overflow: ellipsis;
  top: 0;
  vertical-align: bottom;
  white-space: nowrap;
  z-index: 1;

  &:not(:first-child) {
    direction: rtl;
    text-align: right;
  }
  &:first-child {
    text-align: left;
    width: 25%;
  }
`;

const StyledTableCell = styled.td`
  line-height: 1.2;
  overflow: hidden;
  padding: 5px 10px;
  position: relative;
  text-overflow: ellipsis;
  vertical-align: top;

  &:not(:first-child) {
    text-align: right;
  }
  &:first-child {
    text-align: left;
    min-width: 25%;
  }

  tr + tr > & {
    border-top: solid 1px var(--gray);
  }

  tr:hover > &,
  tr:hover > & {
    background-color: var(--offWhite);
  }
`;

const StyledToggle = styled.span`
  display: inline-block;
  padding: 5px;

  > * {
    display: inline-block;
    direction: ltr;
  }
`;

const StyledToggleIndicator = styled.span`
  display: inline-block;
  width: 8px;
  margin: 0 0.5em;
`;

const StyledCaret = styled.div`
  border-top-style: solid;
  border-top-width: 6px;
  border-right: solid 4px transparent;
  border-bottom: solid 0 transparent;
  border-left: solid 4px transparent;
  display: inline-block;
  height: 0;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  vertical-align: middle;
  width: 0;
`;
