import {  useQuery, useQueries, useQueryClient, useMutation } from "@tanstack/react-query";
import agent from "../api/agent";
import type {
  AddProductDto,
  ProductDto,
  UpdateProductDto,
} from "../types/product";
import type { PaginatedList, PaginationParams } from "../types/common";

export function useGetAllProducts(pagination: PaginationParams) {
  return useQuery({
    queryKey: ["products", pagination],
    queryFn: async () => {
      const response = await agent.get<PaginatedList<ProductDto>>(
        "Product/all",
        { params: pagination },
      );
      return response.data;
    },
    retry: false,
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () =>
      agent
        .get<ProductDto>(`/Product/${encodeURIComponent(id)}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: false,
  });
}


export function useGetProductsByIds(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["products", id],
      queryFn: async () => agent.get<ProductDto>(`/Product/${encodeURIComponent(id)}`).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });
}
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProductDto) => {
      const response = await agent.put<string>("/Product/update-product", dto, {
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
      const response = await agent.post("/Product/add-product", dto, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
};