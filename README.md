# PayFlow Store – Frontend

## Descripción del proyecto

**PayFlow Store** es una aplicación de flujo de compra que simula el proceso de pago de una tienda online, inspirada en la experiencia de Wompi. Incluye formularios modulares, validaciones robustas y persistencia de estado para una experiencia profesional y resiliente.

### ¿Qué hace la app?

- Permite seleccionar un producto, agregarlos al carrito y proceder al pago.
- El usuario ingresa los datos de su tarjeta y dirección.
- Se muestra un resumen de la compra en un Backdrop tipo Material Design.
- Al finalizar, se muestra el resultado de la transacción y se puede volver a comprar.

---

## Tecnologías utilizadas

- **React 18** + **Vite**
- **TypeScript**
- **TailwindCSS** (mobile-first)
- **Redux Toolkit** (gestión de estado global)
- **Zod** (validación de formularios)
- **Jest** + **Testing Library** (tests unitarios e integración)
- **localStorage** (persistencia de estado)
- **Vercel** (despliegue)

---

## Flujo de la aplicación

1. **Producto:** Selección de productos.
2. **Pago:** Formulario de datos de tarjeta y dirección.
3. **Resumen:** Backdrop con resumen de la compra y confirmación.
4. **Resultado:** Mensaje de éxito o error.
5. **Reinicio:** Vuelve al paso de producto para nuevas compras.

---

## Instrucciones de uso

> **Importante:** Este proyecto usa **Yarn**.
> No uses `npm` ni `pnpm`.

### 1. Instalar dependencias

```bash
yarn install
```

### 2. Correr la app en desarrollo

```bash
yarn dev
```

### 3. Ejecutar los tests y ver cobertura

```bash
yarn test --coverage
```

---

## Cobertura de pruebas

La app cuenta con una suite de tests robusta (unitarios e integración).

**Cobertura actual:**

```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   97.39 |    92.53 |      95 |     100 |
... (resto del resumen)
---------------------------
Test Suites: 13 passed, 13 total
Tests:       98 passed, 98 total
```

✅ **La cobertura supera el 80% requerido.**

---

## Enlace de despliegue

> **Obligatorio:**
> [Enlace a tu app en producción](https://store-checkout-mu.vercel.app/)

---

## Notas sobre el diseño

- **Mobile-first:** El diseño y los formularios están optimizados para dispositivos móviles.
- **Backdrop tipo Material Design:** El resumen de compra y confirmación se muestran en un Backdrop animado, mejorando la experiencia de usuario.
- **Resiliencia:** El estado de la app se persiste en localStorage mediante un custom hook, permitiendo recuperar el flujo tras recargar la página.

---

## (Opcional) Screenshots

<!-- todo -> poner capturas cuando se implemente los servicios -->

---

## (Opcional) Estructura del proyecto

```
src/
  components/         # Componentes reutilizables y formularios
  features/           # Slices de Redux y lógica de dominio
  hooks/              # Custom hooks (persistencia, animaciones, etc.)
  schemas/            # Schemas de validación Zod
  utils/              # Utilidades y helpers
  __tests__/          # Tests unitarios e integración
  ...
```

---

## (Opcional) Decisiones técnicas

- **Redux Toolkit:** Permite escalar el estado global y manejar flujos complejos de checkout.
- **Separación de lógica:** Formularios y validaciones están modularizados, facilitando el testing y el mantenimiento.
- **Zod:** Validaciones declarativas y seguras para todos los formularios.
- **Testing Library:** Tests centrados en el usuario, cubriendo casos edge y errores.
