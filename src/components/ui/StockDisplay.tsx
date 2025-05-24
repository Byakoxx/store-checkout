interface StockDisplayProps {
  stock: number
}

export function StockDisplay({ stock }: StockDisplayProps) {
  const isLowStock = stock < 4

  return (
    <div className="text-primary text-sm font-medium mb-6">
      {isLowStock
        ? `¡Corre, quedan ${stock} ${stock === 1 ? 'producto' : 'productos'}!`
        : `${stock} unidades disponibles`
      }
    </div>
  )
}