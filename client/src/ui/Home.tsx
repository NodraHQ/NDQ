import "./Home.css";

import Button from "../components/Button/Button";

type HomeProps = {
  onEnter: () => void;
};

export default function Home({ onEnter }: HomeProps) {
  return (
    <div className="home">
      <div className="menu">
        <h1>NDQ</h1>

        <Button onClick={onEnter}>
          Entrar
        </Button>

        <Button>
          Criar Conta
        </Button>

        <Button>
          Configurações
        </Button>

        <span>v0.0.1 Alpha</span>
      </div>
    </div>
  );
}