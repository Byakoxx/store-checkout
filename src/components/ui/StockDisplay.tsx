interface StockDisplayProps {
  stock: number;
};

const StockDisplay = ({ stock }: StockDisplayProps) => {
  const isLowStock = stock < 4;

  return (
    <div className="text-primary text-sm font-medium mb-6">
      {isLowStock
        ? `Hurry, only ${stock} ${stock === 1 ? "item" : "items"} left!`
        : `${stock} items available`}
    </div>
  );
};

export default StockDisplay;