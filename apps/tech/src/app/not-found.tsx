import Link from 'next/link';
import { Container, Button } from '@autohub360/ui';

export default function NotFound() {
  return (
    <div className="ah-dark flex min-h-[60vh] items-center bg-navy-950">
      <Container className="py-16 text-center">
        <p className="font-display text-7xl font-extrabold text-ahblue-500">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-400">
          O conteúdo que você procura saiu do ar ou mudou de endereço. Explore os universos
          AutoHub360 e encontre o que precisa.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            Voltar ao início
          </Button>
          <Button href="https://autohub360.store" variant="outline-light" size="lg">
            Ir para a loja
          </Button>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Procurando algo específico?{' '}
          <Link href="/contato" className="text-ahblue-300 underline underline-offset-2">
            Fale com a gente
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
