import type { RequestUpdateCurrentEmailDto, UpdateCurrentEmailDto, UpdateCurrentUserNameDto, UpdateUserDto, UserDto } from "../types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
export const useCurrentUser = () =>
  useQuery<UserDto>({
    queryKey: ["currentUser"],
    queryFn: () => agent.get<UserDto>("/User/current").then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });

export const useRequestUpdateCurrentEmail = () => {
  return useMutation({
    mutationFn: async (dto: RequestUpdateCurrentEmailDto) => {
      const response = await agent.post<string>("/User/request-update-current-email", dto);
      return response.data;
    },
  });
};

export const useUpdateCurrentEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateCurrentEmailDto) => {
      const response = await agent.patch<string>("/User/update-current-email",dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useResendCurrentEmailConfirmationCode = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await agent.post<string>("/User/resend-update-current-email-confirmation-code");
      return response.data;
    },
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateUserDto) => {
      const response = await agent.put<string>("/User/current", dto, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
export const useUpdateCurrentUserName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateCurrentUserNameDto) => {
      const response = await agent.patch<string>("/User/update-current-username", dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
