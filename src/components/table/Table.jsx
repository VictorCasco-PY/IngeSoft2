export const Table = ({ children, headers }) => {
  return (
    <table className="table table-striped">
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
