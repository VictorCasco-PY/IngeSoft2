export const Table = ({ children, headers, striped, textcenter }) => {
  return (
    <table className={`table table-hover border-top border-bottom ${striped && "table-striped"} ${textcenter && "text-center"}`}>
      <thead>
        <tr>
          {headers?.map((h, n) => {
            return <th key={n}>{h}</th>;
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
