import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";




type DataType={

  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;

};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Orders = () => {

  // yha par jo TableHOC import kar rha hai usme columm(react ka keyword hai) hai jo uska type 
  // datatype hona chahiye uska andar jo data hai uska bhi datatype

  const [rows] = useState<DataType[]>([
    {

    _id: "dihbwhibwhcw",
  amount: 456,
  quantity: 34,
  discount: 50,
  status: <span className="red">processing</span>,
  action: <Link to={`/order/dihbwhibwhcw`}>view</Link>

    },


  ]);

    const Table = TableHOC<DataType>(column,rows,"dashboard-product-box",
      "Orders",rows.length > 6
    )(); /* () ye datatype pass kar rahe hai iske bad ek aur jo dege usme call kar rhae hai kar rhae hai usme datatype ye hona chahiye ye type script ka format hai
    
    ye jo hamara Table hai ye TableHoc se aa rha hai jo hamne import kiya hai
    uska format hai dash-classname hai,orders-headin hai,aging=true,[] ye row hai
    */

    
    
  return (
    <div className="container">

        <h1>My Orders</h1>

        {Table}

        {/* ham yha table nhi bnayege hmare pass table component hai usko use karege
        TableHoc.tsx me bas hame inport karna hai */}
    </div>
  )
}

export default Orders