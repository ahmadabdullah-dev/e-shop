import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useDeleteProduct } from "../../lib/hooks/useProduct";

type Props = {
  id: string;
};

type Feedback = {
  severity: "success" | "error";
  message: string;
};

export default function DeleteProduct({ id }: Props) {
  const { mutate, isPending } = useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        setFeedback({
          severity: "success",
          message: "Product deleted successfully",
        });
      },
      onError: () => {
        setOpen(false);
        setFeedback({ severity: "error", message: "Failed to delete product" });
      },
    });
  };

  return (
    <>
      <Button color="error" onClick={() => setOpen(true)}>
        Delete product
      </Button>

      <Dialog open={open} onClose={() => !isPending && setOpen(false)}>
        <DialogTitle>Delete product?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback ? (
          <Alert
            severity={feedback.severity}
            variant="filled"
            onClose={() => setFeedback(null)}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
