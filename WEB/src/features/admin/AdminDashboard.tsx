import { Button } from "@mui/material";
import { Link } from "react-router";

export default function AdminDashboard() {
  return (
    <div>
      <h1>AdminDashboard</h1>

      <Button component={Link} to="/product/add" variant="contained">
        Add Product
      </Button>
    </div>
  );
}
