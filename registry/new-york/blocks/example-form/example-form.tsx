"use client"

import { useId, useState, type FormEvent } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.email("Enter a valid email address."),
  message: z.string().trim().min(1, "Enter a message."),
})

export function ExampleForm() {
  const id = useId()
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof schema>, string[]>>
  >({})
  const [success, setSuccess] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = schema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    )
    setErrors(result.success ? {} : z.flattenError(result.error).fieldErrors)
    setSuccess(result.success)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>How can we help?</CardTitle>
        <CardDescription>
          Try this form to see validation in action.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <FieldGroup>
            {(["name", "email", "message"] as const).map((name) => (
              <Field key={name} data-invalid={!!errors[name]?.length}>
                <FieldLabel htmlFor={`${id}-${name}`}>
                  {name[0].toUpperCase() + name.slice(1)}
                </FieldLabel>
                {name === "message" ? (
                  <Textarea
                    id={`${id}-${name}`}
                    name={name}
                    required
                    aria-invalid={!!errors[name]?.length}
                    aria-describedby={
                      errors[name]?.length ? `${id}-${name}-error` : undefined
                    }
                  />
                ) : (
                  <Input
                    id={`${id}-${name}`}
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    autoComplete={name}
                    required
                    aria-invalid={!!errors[name]?.length}
                    aria-describedby={
                      errors[name]?.length ? `${id}-${name}-error` : undefined
                    }
                  />
                )}
                <FieldError
                  id={`${id}-${name}-error`}
                  errors={errors[name]?.map((message) => ({ message }))}
                />
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col items-start gap-3">
          <Button type="submit" size="sm">
            Validate message
          </Button>
          <p role="status" className="text-sm text-muted-foreground">
            {success
              ? "Form validated successfully. This demo does not send messages."
              : ""}
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
