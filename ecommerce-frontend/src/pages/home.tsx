import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Loader from "../components/loader";


const Home = () => {

  const { data, isError, isLoading } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  
  return (
    <div className="home">

      <section></section>

    <h1>

      Latest products
      <Link to="/search" className="findmore">More</Link>"
    </h1>

    <main> 

       {isLoading? (
         <Loader />
       
       ) : ( data?.products.map((i) => (

             <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
       ))
      )}
    </main>

    </div>
  )
};

export default Home;