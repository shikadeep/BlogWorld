import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateBlog from './pages/CreateBlog.jsx'
import EditBlog from './component/EditBlog.jsx'
import BlogDetail from './pages/BlogDetail.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {index: true, element: <Home />},
      {path:'/home', element: <Home/>},
      {path:'/login', element: <AdminLogin/>},
      { path: '/dashboard/:userId', element: <Dashboard /> },
      {path: '/create-blog', element: <CreateBlog/>},
      {path: "/edit-blog/:id", element:<EditBlog />},
      {path: '/blog/:id', element: <BlogDetail/>}
    ],
  },
  // {
  //   path: '/dashboard',
  //   element: <AdminBlog/>,
  //   children: [
  //     {index: true, element: <AdminBlog />},
  //     {path:'/home', element: <AdminBlog/>},
      
  //   ]
  // }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
