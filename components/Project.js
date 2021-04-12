import { useMemo } from 'react';
import { parseJSON, formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import styled from 'styled-components';

import DataTable from '@/components/DataTable';

function relativeDate(date) {
  const formatRelativeLocale = {
    today: "'Today'",
    tomorrow: "'Tomorrow'",
    nextWeek: "eeee'",
    other: 'MMM d, yyyy',
  };
  const locale = {
    ...enUS,
    formatRelative: (token) => formatRelativeLocale[token],
  };

  return formatRelative(parseJSON(date), new Date(), { locale });
}

export default function Project({ project }) {
  const { name, program, expireDate, tasks, hours } = project;

  const mergedData = [
    ...tasks
      .concat(hours)
      .filter((data) => data)
      .reduce(
        (m, o) => m.set(o.roleID, Object.assign(m.get(o.roleID) || {}, o)),
        new Map()
      )
      .values(),
  ];

  const data = useMemo(
    () =>
      mergedData.map((data) => {
        const { role, hoursScoped, hoursLogged } = data;
        const _hoursLogged = hoursLogged || 0;

        return {
          col1: role,
          col2: hoursScoped,
          col3: _hoursLogged,
          col4: `${hoursScoped - _hoursLogged}`,
          col5: `${
            Math.round((_hoursLogged / hoursScoped) * 100 * 10) / 10 || 0
          }`,
        };
      }),
    []
  );

  const columns = useMemo(
    () => [
      { Header: 'Role', accessor: 'col1' },
      { Header: 'Scoped (hrs)', accessor: 'col2' },
      { Header: 'Logged (hrs)', accessor: 'col3' },
      { Header: 'Remaining (hrs)', accessor: 'col4' },
      { Header: 'Complete (%)', accessor: 'col5' },
    ],
    []
  );
  const initialSort = useMemo(() => [{ id: 'col1', desc: false }], []);

  return (
    <StyledProject key={project.id}>
      <StyledProjectHeader>
        <p>{program}</p>
        <h2>{name}</h2>
        <p>(Expires: {relativeDate(expireDate)})</p>
      </StyledProjectHeader>
      <section>
        {mergedData.length ? (
          <DataTable
            columns={columns}
            data={data}
            initialSort={initialSort}
            caption="Tasks"
          />
        ) : (
          <p>No tasks assigned</p>
        )}
      </section>
    </StyledProject>
  );
}

const StyledProject = styled.article`
  background-color: white;
  border-radius: 5px;
  box-shadow: var(--shadow);
  padding: 1.25em 0 1.5em;
  width: 100%;

  > * {
    padding: 0 1.5em;
  }
`;

const StyledProjectHeader = styled.header`
  border-bottom: solid 1px var(--black);
  padding-bottom: 1.5em;

  > *:not([class]) {
    margin: 0;
  }
`;
