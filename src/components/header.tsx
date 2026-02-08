export function Header() {
  return (
    <header className="flex w-full flex-col items-center gap-2 border-b-2 border-primary/20 pb-8 text-center">
      <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary md:text-5xl">
        ANDICOT System Core
      </h1>
      <p className="max-w-md text-muted-foreground md:text-lg">
        Panel de Administración de Datos
      </p>
    </header>
  );
}
