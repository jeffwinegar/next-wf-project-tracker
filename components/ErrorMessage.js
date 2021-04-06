export default function DisplyError({ error }) {
  if (!error || !error.message) return null;
  if (error.networkError?.result?.errors.length) {
    return error.networkError.result.errors.map((error, idx) => (
      <div key={idx}>
        <p>
          <strong>Whoops!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    ));
  }

  return (
    <div>
      <p>
        <strong>Whoops!</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </div>
  );
}
