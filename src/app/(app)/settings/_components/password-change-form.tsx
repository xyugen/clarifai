"use client";

import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { passwordFormSchema } from "./schema";

export const PasswordChangeForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    const toastId = toast.loading("Changing password...");
    try {
      await authClient.changePassword(
        {
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: () => {
            toast.success(
              "Password changed successfully! Please log in again.",
              {
                id: toastId,
              },
            );
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to change password.", {
              id: toastId,
            });
          },
        },
      );

      router.push(PageRoutes.LOGIN);
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        id: toastId,
      });
      console.error("Password change error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                {...field}
                id="currentPassword"
                type="currentPassword"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                {...field}
                id="newPassword"
                type="newPassword"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                {...field}
                id="confirmPassword"
                type="confirmPassword"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="pt-4">
        <Button type="submit" variant="default">
          Change Password
        </Button>
      </div>
    </form>
  );
};
