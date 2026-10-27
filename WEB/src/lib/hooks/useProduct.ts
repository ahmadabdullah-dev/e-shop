import {  useQuery, useQueries } from "@tanstack/react-query";
import agent from "../api/agent";
import type {
  ProductDto,
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