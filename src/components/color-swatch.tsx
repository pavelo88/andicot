export function ColorSwatch({ name, hex, hsl }: { name: string; hex: string; hsl: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-10 w-10 rounded-lg border-2"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="font-medium text-foreground">{name}</p>
        <p className="font-code text-sm text-muted-foreground">{hex} &bull; {hsl}</p>
      </div>
    </div>
  )
}
