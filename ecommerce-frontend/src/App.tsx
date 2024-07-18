

import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import {  lazy,Suspense } from "react";
import Loader from "./components/loader";
import Header from "./components/header";
import {Toaster} from "react-hot-toast";





const Home =lazy(()=> import("./pages/home"));
const Search = lazy(()=> import("./pages/search"));
const Cart = lazy(()=> import("./pages/cart"));//jo page khula bas whi aye isliye lazy loading use karte hai
const Shipping=lazy(()=> import("./pages/shipping"));
const Login=lazy(()=> import("./pages/login"));
const Orders=lazy(()=> import("./pages/orders"));
const OrderDetails=lazy(()=> import("./pages/order-details"));




// The Login component is being imported using the lazy function from React. 
// This is a technique called code splitting or lazy loading, which allows you to load components only when they are needed,
//  rather than loading everything up front. 
// This can significantly improve the initial load time of your application,
//  especially if it is large and contains many components.

//admin routes importing

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);


//loader here is used ki jab tak baki route aa rha hai tab loader ko rakho


const App = () => {
  return (
     <Router>

      <Header />
       <Suspense fallback={<Loader />}>
       <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} /> {/*in these user did not need of login */}
          <Route path="/cart" element={<Cart />} />

        {/* not logged in route jab log in nhi hai tab ye chalega */}
        <Route path="/login" element={<Login />} />



          {/* logged in user routes */}
          <Route>
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails/>} />
           {/* this :id is used to reprsent the dynamic id */}


          </Route>

         

          {/*admin routes*/}
     <Route
//   element={
//     <ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={true} />
//   }
 >
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/product" element={<Products />} />
  <Route path="/admin/customer" element={<Customers />} />
  <Route path="/admin/transaction" element={<Transaction />} />
  {/* Charts */}
  <Route path="/admin/chart/bar" element={<Barcharts />} />
  <Route path="/admin/chart/pie" element={<Piecharts />} />
  <Route path="/admin/chart/line" element={<Linecharts />} />
  {/* Apps */}
  <Route path="/admin/app/coupon" element={<Coupon />} />
  <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
  <Route path="/admin/app/toss" element={<Toss />} />

  {/* Management */}
  <Route path="/admin/product/new" element={<NewProduct />} />

  <Route path="/admin/product/:id" element={<ProductManagement />} />

  <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
</Route>;

          </Routes>
       </Suspense>

       <Toaster position="bottom-center"/>
       {/* The Toaster component from the react-hot-toast library is used in a React application to display toast notifications. Toast notifications are small, unobtrusive pop-up messages that provide feedback or updates to the user, such as successful operations, error messages, or other alerts. */}
     </Router>
  )
}

export default App