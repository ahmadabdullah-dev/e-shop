import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderDto, OrderDto } from "../types/order";
import agent from "../api/agent";
import type { PaginatedList, PaginationParams } from "../types/common";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dto: CreateOrderDto) => {
      const response = await agent.post("/Order/create", dto);
      return response.data;
    },
    onSuccess: async() => {
          await queryClient.invalidateQueries({ queryKey: ["all-orders"] });
    }
  });
};
export function useGetCurrentUserOrders(pagination: PaginationParams) {
  return useQuery({
    queryKey: ["currentUserOrders", pagination],
    queryFn: async () => {
      const response = await agent.get<PaginatedList<OrderDto>>(
        "Order/current",
        { params: pagination },
      );
      return response.data;
    },
    retry: false,
  });
}
export function useGetAllOrders(pagination: PaginationParams) {
  return useQuery({
    queryKey: ["all-orders", pagination],
    queryFn: async () => {
      const response = await agent.get<PaginatedList<OrderDto>>(
        "Admin/all-orders",
        { params: pagination },
      );
      return response.data;
    },
    retry: false,
  });
}
export function useGetOrderById(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId ],
    queryFn: async () => {
      const response = await agent.get<OrderDto>(`Order/order/${orderId}`);
      return response.data;
    },
    retry: false,
  });
}
