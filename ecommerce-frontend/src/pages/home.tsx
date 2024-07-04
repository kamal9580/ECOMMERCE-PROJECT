import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";


const Home = () => {

  const addToCartHandler = ()=> {};

  return (
    <div className="home">

      <section></section>

    <h1>

      Latest products
      <Link to="/search" className="findmore">More</Link>"
    </h1>

    <main> 

     <ProductCard
       
       productId="adasdas"
       price={4545}
       name="Macbook"
      photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX522_.jpg"
       stock={435}
       handler={addToCartHandler}
       
      
      
      />
    </main>

    </div>
  )
};

export default Home;