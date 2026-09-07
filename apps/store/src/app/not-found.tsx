import Link from 'next/link';
import { Compass, Home, SearchX } from 'lucide-react';
import { Button, Container } from '@autohub360/ui';

export default function NotFound() {
  return (
    <section className="ah-hero-glow relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-ahblue-500/25 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-ahorange-500/15 blur-[110px]"
      />
      <Container className="relative flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-ahblue-300">
          <Compass className="h-3.5 w-3.5" aria-hidden="true" />
          Erro 404
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-300 sm:text-base">
          O endereço que você tentou abrir não existe ou saiu do ar. Que tal buscar pelo produto ou
          voltar para a página inicial?
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/buscar" size="lg" variant="primary">
            <SearchX className="h-5 w-5" aria-hidden="true" />
            Buscar produtos
          </Button>
          <Button href="/" size="lg" variant="outline-light">
            <Home className="h-5 w-5" aria-hidden="true" />
            Voltar ao início
          </Button>
        </div>
        <p className="mt-8 text-sm text-slate-400">
          Dúvidas? Consulte a{' '}
          <Link href="/atendimento" className="font-semibold text-ahblue-300 hover:underline">
            página de atendimento
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
