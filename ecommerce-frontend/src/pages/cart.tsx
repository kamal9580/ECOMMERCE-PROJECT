import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const CartItems=[

  {

      productId:"abcsidssfjdso",
      photo:"https://m.media-amazon.com/images/I/71jG+e7roXL._SX522_.jpg",
      name:"macbook",
      price:3000,
      quantity: 4,
      stock: 10,
  },
];


const subtotal =4000;
const tax=Math.round(subtotal*0.18);
const shippingCharges = 200;
const discount=400;
const total = subtotal+tax+shippingCharges;


const Cart = () => {

  const [couponCode,setCoupenCode] = useState<string>("");
  const [isValidcouponCode,setisValidcouponCode] = useState<boolean>(false);

  useEffect(()=>{
   const timeOutId = setTimeout(()=>{
    if(Math.random()>0.5) setisValidcouponCode(true);
    else setisValidcouponCode(false);

   },1000);

   return () => {
    clearTimeout(timeOutId);
    setisValidcouponCode(false);
   };

  },[couponCode]);


  return (
    <div className="cart">

      <main> 
      
      {

        CartItems.length >0 ? CartItems.map((i,idx)=>(
          <CartItem key={idx} cartItem={i} />
          
        
       )):

       (<h1>No items added</h1>)

      }

  {/*  CartItems.map((i,idx)=>(
          <CartItem key={idx} cartItem={i} /> CartItems.map((i, idx) => ( ... )):
            Iterates over the CartItems array, rendering a CartItem component for each item.
            key={idx}:
            Provides a unique key for each CartItem component to help React identify and manage the list efficiently.
            cartItem={i}:
            Passes the current item (i) as a prop to the CartItem component, allowing it to receive and display the item's data. */}


      </main>
      <aside>
      <p>Subtotal: ₹{subtotal}</p>
      <p>Shipping Charges: ₹{shippingCharges}</p>
      <p>Tax: ₹{tax}</p>

      <p>

        Discount: <em className="red"> - ₹{discount}  </em>

      </p>
      <p>
        <b>Total: ₹{discount}</b>
    
      </p>

      <input type="text"
      placeholder="Coupen Code"
       value={couponCode}
       onChange={(e)=> setCoupenCode(e.target.value)} 
       />


       {couponCode && //iska mtlab hua agar couponcode true hua tab sari condition apply hogi
         (isValidcouponCode ? (
          <span className="green">
            ₹{discount} off using the <code>{couponCode}</code>
          </span>
         ) : (
          <span className="red">Invalid Coupon <VscError />
          </span>
  
         ) )}


         {CartItems.length >0 && <Link to="/shipping">Checkout</Link>}
        {/* Here, it combines the condition (CartItems.length > 0) with the subsequent JSX element (<Link to="/shipping">Checkout</Link>).
If the condition (CartItems.length > 0) evaluates to true, the JSX element (<Link to="/shipping">Checkout</Link>) is rendered.
If the condition is false, nothing (null) is rendered.*/}
      
          
       
      </aside>
      
      
       </div>
  )
}

export default Cart