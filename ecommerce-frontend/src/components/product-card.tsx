import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

   
   type ProductProps = {
    productId:string;
    photo:string;
    name:string;
    price:number;
    stock:number;
    handler: () => void;

    /*In TypeScript, handler: () => void is a type annotation that specifies the type of the handler variable. 
        This annotation means that handler is a function that takes no parameters and returns void (i.e., it
         does not return any value).*/
   };

  
   {/* The ProductCard component is a functional React component that receives various props related to a product and displays them. The props are destructured in the component's function parameter list, and a type definition (ProductProps) is used to define the shape of these props.
     This approach is commonly used with TypeScript to ensure type safety and improve code readability. 
     
     ProductProps is a TypeScript interface or type that defines the structure and types of the props that the ProductCard component expects to receive.
     
     */}

const ProductCard = ({
    productId,
    price,
    name,
    photo,
    stock,
    handler

   }:ProductProps) => {
  return (
      <div className="product-card">

        <img src={`${server}/${photo}`} alt="{name}" /> {/*src={${server}/${photo}}: Constructs the src attribute of the img tag by combining the server URL and the photo path using a template literal. This ensures the full URL of the image is correctly formed. */}
        <p> {name}</p>
        <span>₹{price}</span>
        

        <div>
            <button onClick={()=> handler()}>
                <FaPlus />  {/*this div is used jo home page par niche par jane par jo dark color aa rha hai cart ke sign ke sath uske liye use karege*/}

            </button>
        </div>

      </div>
  );
};

export default ProductCard