export const Table = ({ children, headers }) => {
  return (
    <table className="table table-striped  table-hover border-top border-bottom">
      <thead>
        <tr>
          {headers?.map((h, n) => {
            return <th key={n}>{h}</th>;
          })}
        </tr>
      </thead>
      {children}
    </table>
  );
};
