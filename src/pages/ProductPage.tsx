import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart } from "lucide-react"
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { RootState } from '../app/store'
import { setProducts, setStatus } from '../features/product/productSlice'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image: string
  description?: string
}

// Simulación de datos de API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Auriculares Inalámbricos Premium',
    price: 129.99,
    stock: 10,
    image: 'https://via.placeholder.com/400',
    description: 'Auriculares inalámbricos con cancelación de ruido, batería de larga duración y sonido de alta fidelidad. Perfectos para trabajo y ocio.'
  }
]

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch()
  const products = useSelector((state: RootState) => state.product.products)
  const status = useSelector((state: RootState) => state.product.status)

  useEffect(() => {
    // Simular carga de API
    dispatch(setStatus('loading'))
    // Simular delay de red
    setTimeout(() => {
      dispatch(setProducts(mockProducts))
      dispatch(setStatus('idle'))
    }, 1000)
  }, [dispatch])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">PayFlow Store</h1>
        <Card className="grid gap-8 bg-white p-5 shadow-2xl">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-lg overflow-hidden max-w-sm mx-auto">
              <div className="aspect-square bg-secondary flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-card-foreground">{product.name}</h2>
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <div className="text-primary text-sm font-medium mb-6">
                  {product.stock} unidades disponibles
                </div>
                <Button
                  className="w-full bg-foreground text-background py-4 px-6 rounded-2xl font-medium hover:bg-muted transition-colors"
                  onClick={() => console.log('Pagar con tarjeta de crédito:', product.id)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pagar con tarjeta de crédito
                </Button>
              </CardContent>
            </div>
          ))}
        </Card>
        <div className="text-center text-muted-foreground text-sm mt-16">
          © {new Date().getFullYear()} PayFlow Store. Todos los derechos reservados.
        </div>
      </div>
    </div>
  )
}

export default ProductPage