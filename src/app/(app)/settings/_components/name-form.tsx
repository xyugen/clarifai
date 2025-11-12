import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { nameFormSchema } from "./schema";

interface NameFormProps {
  currentName: string;
}

const NameForm: React.FC<NameFormProps> = ({ currentName }) => {
  const router = useRouter();

  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const onSubmit = async (data: z.infer<typeof nameFormSchema>) => {
    setSubmitting(true);
    try {
      toast.promise(
        authClient.updateUser(
          {
            name: data.name.trim(),
          },
          {
            query: {
              disableCookieCache: true,
            },
          },
        ),
        {
          loading: "Saving name...",
          success: "Name updated successfully!",
          error: "Failed to update name.",
        },
      );
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-row items-end gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-2">
                <Label htmlFor="name">Name</Label>
                {fieldState.invalid && (
                  <>
                    [<FieldError errors={[fieldState.error]} />]
                  </>
                )}
              </div>
              <Input
                {...field}
                id="name"
                type="name"
                placeholder={currentName}
                aria-invalid={fieldState.invalid}
                className="h-11"
                required
              />
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting || currentName === form.watch("name")}
          className="h-11"
          variant="default"
        >
          {isSubmitting ? "SAVING..." : "SAVE"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default NameForm;
