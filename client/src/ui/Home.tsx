import "./Home.css";

import Button from "../components/Button/Button";

export default function Home() {
  return (
    <div className="home">
      <div className="menu">

        <h1>NDQ</h1>

        <Button>Entrar</Button>

        <Button>Criar Conta</Button>

        <Button>Configurações</Button>

        <span>v0.0.1 Alpha</span>

      </div>
    </div>
  );
}