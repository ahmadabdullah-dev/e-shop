import { Button } from "@mui/material";
import { Link } from "react-router";
import AllOrdersList from "../order/AllOrdersList";

export default function AdminDashboard() {
  return (
    <div>
      <h1>AdminDashboard</h1>

      <Button component={Link} to="/product/add" variant="contained">
        Add Product
      </Button>
      <AllOrdersList/>
    </div>
  );
}
