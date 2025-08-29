export default function ProtectedPage({ currentUser, children }) {
  if (!currentUser) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-2xl font-bold">No has iniciado sesión</h1>
        <a
          href="/login"
          className="mt-4 inline-block bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600"
        >
          Ir a Login
        </a>
      </div>
    );
  }
  return children;
}
