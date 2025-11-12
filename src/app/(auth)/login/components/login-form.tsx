"use client";

import { Button } from "@/components/retroui/Button";
import { Checkbox } from "@/components/retroui/Checkbox";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { TextLink } from "@/components/retroui/TextLink";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { formSchema } from "./schema";

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password, rememberMe } = data;

    const toastId = toast.loading("Signing in...");
    try {
      await authClient.signIn.email(
        {
          email,
          password,
          rememberMe,
          callbackURL: PageRoutes.DASHBOARD,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful!", {
              id: toastId,
            });
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to sign in. Please try again.",
              {
                id: toastId,
              },
            );
          },
        },
      );
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        id: toastId,
      });
      console.error(error);
    }
  };

  return (
    <form
      id="form-login"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="email">Email</Label>
              <Input
                {...field}
                id="email"
                placeholder="your@email.com"
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
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="password">Password</Label>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="my-6 flex items-center justify-between">
        <FieldGroup className="w-1/2">
          <Controller
            name="rememberMe"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-row justify-center gap-2">
                <Checkbox
                  id="rememberMe"
                  className="h-5! w-6!"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  REMEMBER ME
                </Label>
              </Field>
            )}
          />
        </FieldGroup>
        <TextLink
          href={PageRoutes.FORGOT_PASSWORD}
          className="text-sm font-bold decoration-4 underline-offset-2 hover:underline"
        >
          FORGOT PASSWORD?
        </TextLink>
      </div>

      <Field>
        <Button
          type="submit"
          variant="default"
          form="form-login"
          className="mb-4 flex w-full items-center justify-center gap-2"
          disabled={form.formState.isSubmitting}
        >
          <span>LOG IN</span> <ArrowRight className="size-5" />
        </Button>
      </Field>
    </form>
  );
};

export default LoginForm;
