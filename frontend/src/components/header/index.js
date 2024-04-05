import "./index.css";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("userLogado");
    window.location.href = "/";
  };

  return (
    <header>
      <div className="itens_header">

      
      <h2>Calculadora Threeo</h2>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      </div>
    </header>
  );
}
