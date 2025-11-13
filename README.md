Frontend (React + Vite + Tailwind + shadcn)
📦 Requisitos

Node.js 18+

npm 9+

🗂️ Estructura (resumen)
<<<<<<< HEAD
```ecommerce-frontend/
├─ src/
│  ├─ components/
│  │  ├─ PulgashopHeader.tsx
│  │  ├─ ProductReview.tsx
│  │  ├─ StarRating.tsx
│  │  ├─ ReviewForm.tsx
│  │  ├─ ReviewHelpful.tsx
│  │  └─ ui/                # shadcn/ui
│  ├─ db/
│  │  ├─ config/api.ts      # instancia axios (usa VITE_RATINGS_BASE)
│  │  └─ services/ratingsService.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env                     # variables locales (NO commitear)
├─ .env.example
├─ package.json
└─ vite.config.ts
```

=======

```ecommerce-frontend/
├─ src/
│  ├─ components/
│  │  ├─ PulgashopHeader.tsx
│  │  ├─ ProductReview.tsx
│  │  ├─ StarRating.tsx
│  │  ├─ ReviewForm.tsx
│  │  ├─ ReviewHelpful.tsx
│  │  └─ ui/                # shadcn/ui
│  ├─ db/
│  │  ├─ config/api.ts      # instancia axios (usa VITE_RATINGS_BASE)
│  │  └─ services/ratingsService.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env                     # variables locales (NO commitear)
├─ .env.example
├─ package.json
└─ vite.config.ts
```
>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)

🔐 Variables de entorno

Crea .env (basado en .env.example):
<<<<<<< HEAD
=======

>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
```
VITE_RATINGS_BASE=http://localhost:3001
```

▶️ Levantar el front
<<<<<<< HEAD
=======

>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
```
npm install
npm run dev
```
<<<<<<< HEAD
=======

>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
Abre http://localhost:3000
Verás el banner de desarrollo, el header “Pulgashop” y la tarjeta de Valoraciones y Reseñas.
Publica con estrellas (comentario opcional). El promedio y conteo se actualizan.

🔌 Conexión con backend
El front usa src/db/config/api.ts (Axios) con VITE_RATINGS_BASE.
ratingsService.ts expone:
getAverage(productId)
listComments(productId, limit?, offset?)
rate(productId, payload)
vote(resenaId, payload)
Si cambias el puerto del backend, solo actualiza VITE_RATINGS_BASE.

🧪 Probar contra Postman
Desde el front, publica una reseña.
<<<<<<< HEAD
```
En Postman: GET http://localhost:3001/ratings/1/comments
```
Debe aparecer el comentario que dejaste.

🧰 Scripts útiles
=======

```
En Postman: GET http://localhost:3001/ratings/1/comments
```

Debe aparecer el comentario que dejaste.

🧰 Scripts útiles

>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
```
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 3000",
    "lint": "eslint ."
  }
}
```
<<<<<<< HEAD
=======

>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
🆘 Troubleshooting
404 al entrar a http://localhost:3000: asegúrate de tener index.html correcto (Vite lo genera) y que npm run dev no esté mostrando errores.

CORS: el backend debe permitir http://localhost:3000 en CORS_ORIGINS.

<<<<<<< HEAD
Axios 404: verifica que el backend esté arriba (http://localhost:3001) y rutas /ratings/* existan.
=======
Axios 404: verifica que el backend esté arriba (http://localhost:3001) y rutas /ratings/\* existan.
>>>>>>> 28deea5 (feat(front): ajustes UI + integración ratings)
