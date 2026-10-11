import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginDto, RegisterDto, ResetPasswordDto } from "../types/auth";
import { useNavigate } from "react-router";

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (creds: LoginDto) => {
      const response = await agent.post("/auth/login", creds);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/dashboard");
    },
  });
};
export function useRegisterUser() {
  return useMutation({
    mutationFn: async (creds: RegisterDto) => {
      const response = await agent.post("/Auth/register", creds, {
           headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
  });
}

export const useForgetPasswordAsync = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await agent.post("/auth/forget-password", null, {
        params: { email },
      });
      return response.data;
    },
  });
};

export const useResetPasswordAsync = () => {
  return useMutation({
    mutationFn: async (creds: ResetPasswordDto) => {
      const response = await agent.post("/auth/reset-password", creds);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await agent.post("/auth/logout");
    },
    onSuccess: async () => {
      await queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/");
    },
  });
};
export const useConfirmEmailAsync = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await agent.patch("/auth/confirm-email", null, {
        params: { code },
      });
      return response.data;
    },
  });
};
export const useResendEmailConfirmationCodeAsync = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await agent.post("/auth/resend-email-confirmation-code");
      return response.data;
    },
  });
};