import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddProductDto, UpdateProductDto } from "../types/product";
import agent from "../api/agent";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProductDto) => {
      const response = await agent.put<string>("/Admin/update-product", dto, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationFn: async (dto: AddProductDto) => {
      const response = await agent.post("/Admin/add-product", dto, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
};