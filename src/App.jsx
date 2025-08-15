// App.js
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './pages/protexted/ProtectedRoute';

import LoginForm from './pages/protexted/LoginForm';
import Aside from './components/Aside';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';

import ListGeneros from './pages/generos/ListGeneros';
import ListUsuarios from './pages/Usuarios/ListUsuarios';
import ListPlataformas from './pages/plataformas/ListPlataformas';
import ListJuegos from './pages/juegos/ListJuegos';

const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));


//import { useUser } from './contexts/UserContext';
import ListVendedores from './pages/vendedores/ListVendedores';
// Layout protegido: solo para usuarios autenticados
const ProtectedLayout = () => (

  <div className="wrapper">
    <div className="content-wrapper">
      <Aside />
      <div className="content">
        <Header />
        <Suspense fallback={<div>Cargando...</div>}>
          <Content />
        </Suspense>
        <Footer />
      </div>
    </div>
  </div>
);

const App = () => {
    //const { user } = useUser(); // Cambiado a useUser
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Ruta pública */}
          <Route path="/login" element={<LoginForm />} />

          {/* Rutas protegidas: solo para usuarios autenticados */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            {/* Todas las rutas hijas están dentro del layout */}
            <Route path="/" element={<Content />}>
              {/* Solo admin puede ver Dashboard */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requiredRol="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                index
                element={
                  <ProtectedRoute requiredRol="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Estas rutas las ven todos los autenticados (admin y operador) */}
              <Route path="listgeneros" element={<ListGeneros />} />
              <Route path="listplataformas" element={<ListPlataformas />} />
              <Route path="listjuegos" element={<ListJuegos />} />

              {/* Solo admin puede ver y acceder a Usuarios */}


              <Route path="listvendedores" element={
                  <ProtectedRoute requiredRol="vendedor">
                    <ListVendedores />
                  </ProtectedRoute>
                } />


              <Route
                path="listusuarios"
                element={
                  <ProtectedRoute requiredRol="admin">
                    <ListUsuarios />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* Cualquier otra ruta → login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;