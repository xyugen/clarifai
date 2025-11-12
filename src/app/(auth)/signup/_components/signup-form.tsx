"use client";

import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { formSchema } from "./schema";

const SignUpForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, email, password } = data;

    const toastId = toast.loading("Signing up...");
    try {
      await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: PageRoutes.LOGIN,
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful!", {
              id: toastId,
            });
            router.push(PageRoutes.LOGIN);
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to sign up. Please try again.",
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
      console.error("Sign up error:", error);
    }
  };

  return (
    <form
      id="form-signup"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="name">Name</Label>
              <Input
                {...field}
                id="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
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
          control={form.control}
          name="password"
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

      <FieldGroup className="mb-6">
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                {...field}
                id="confirmPassword"
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

      <Field>
        <Button
          type="submit"
          variant="default"
          form="form-signup"
          className="mb-4 flex w-full items-center justify-center gap-2"
          disabled={form.formState.isSubmitting}
        >
          <span>SIGN UP</span> <ArrowRight className="size-5" />
        </Button>
      </Field>
    </form>
  );
};

export default SignUpForm;
