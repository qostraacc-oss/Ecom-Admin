// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import AdminLayout from './components/layout/AdminLayout';
// import Dashboard from './pages/Dashboard/Dashboard';
// import Login from './pages/Login/Login';
// import ProtectedRoute from './components/layout/ProtectedRoute';
// import Categories from './pages/Categories/Categories';
// import SubCategories from './pages/SubCategories/SubCategories';
// import Attributes from './pages/Attributes/Attributes';
// import Brands from './pages/Brands/Brands';
// import Products from './pages/Products/Products';
// import ProductForm from './pages/Products/ProductForm';

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Navigate to="/admin/dashboard" replace />} />
//   <Route path="dashboard" element={<Dashboard />} />

//   {/* Products */}
//   <Route path="products" element={<Products />} />
//   <Route path='products/edit/:id' element={<ProductForm/>}/>
//   <Route path="categories" element={<Categories />} />
//   <Route path="subcategories" element={<SubCategories />} />
//   <Route path="attributes" element={<Attributes />} />
//   <Route path="brands" element={<Brands />} />
//   <Route path="products/create" element={<ProductForm/>}/>
//   <Route path='order' element={<div>orders</div>}/>
// </Route>

//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Categories from './pages/Categories/Categories';
import SubCategories from './pages/SubCategories/SubCategories';
import Attributes from './pages/Attributes/Attributes';
import Brands from './pages/Brands/Brands';
import Products from './pages/Products/Products';
import ProductForm from './pages/Products/ProductForm';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Optional: show a spinner or loader

  return (
    <Routes>
      {/* Public route — redirect to dashboard if already authenticated */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Redirect root based on authentication */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="subcategories" element={<SubCategories />} />
        <Route path="attributes" element={<Attributes />} />
        <Route path="brands" element={<Brands />} />
        <Route path="orders" element={<div>Orders</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
