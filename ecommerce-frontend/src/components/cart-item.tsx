import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";


type CartItemsProps = {
    cartItem:any;
}; //this is written in typescript form.here we define props 



const CartItem = ({cartItem}:CartItemsProps) => {//here we The component receives an object of type CartItemsProps as its argument, which is currently an empty object {} 
    //ince CartItemsProps does not define any properties.

    const {photo,productId,name,price,quantity,stock} = cartItem;
  return (
    <div className="cart-item">
        <img src={photo} alt="name"/>
        <article>
            <Link to={`/product/${productId}`}>{name}</Link>
            <span>₹{price}</span>
        </article>

        <div>
            <button>-</button>
            <p>{quantity}</p>
            <button>+</button>
        </div>

        <button>
            <FaTrash />
        </button>
        
        </div>
  );
};

export default CartItem