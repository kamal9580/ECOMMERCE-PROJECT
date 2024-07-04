import { ChangeEvent, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const Shipping = () => {
    const navigate = useNavigate();
    const [shippingInfo,setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      
    });

    const changeHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
        //  it is writte in typescript thats why these changeevent are writtten in this way.
        // changeHandler is defined as a constant function.
// It takes a single parameter e, which is an event of type ChangeEvent that can come from either an HTMLInputElement or an HTMLSelectElement.

// setShippingInfo is a function that updates the state (presumably from a useState hook).
// It takes a callback function as an argument, which receives the previous state (prev).
   
// The spread operator ...prev copies all the properties from the previous state.
// The computed property [e.target.name] sets the property of the state object corresponding to the name attribute of the input element that triggered the event (e.target).
// e.target.value gets the new value from the input element and assigns it to the 

      ) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };


  return (
    <div className="shipping">

        <button className="back-btn"  onClick={()=> navigate("/cart")}>
            <BiArrowBack />
        </button>

        <form>
            <h1>Shipping Address</h1>

            <input
          required

           //   If the user tries to submit the form without filling in this field, the browser will display a validation message.
        //   This attribute ensures that the input field must be filled out before the form can be submitted. 

          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

<input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select> 



        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />


      <button type="submit">Pay Now</button>

        </form>
    </div>
  )
}

export default Shipping