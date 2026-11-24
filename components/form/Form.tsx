"use client"

import * as React from "react"
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodType } from "zod"

type BaseProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  className?: string
}

type SchemaFormProps<T extends FieldValues> = BaseProps<T> & {
  schema: ZodType<T, any, any>
  defaultValues: DefaultValues<T>
  methods?: never
}

type MethodsFormProps<T extends FieldValues> = BaseProps<T> & {
  methods: UseFormReturn<T>
  schema?: ZodType<T, any, any>
  defaultValues?: DefaultValues<T>
}

export function Form<T extends FieldValues>(
  props: SchemaFormProps<T> | MethodsFormProps<T>
) {
  const { onSubmit, children, className } = props
  const internal = useForm<T>(
    "methods" in props && props.methods
      ? undefined
      : {
          resolver: zodResolver(
            (props as SchemaFormProps<T>).schema as any
          ) as Resolver<T>,
          defaultValues: (props as SchemaFormProps<T>).defaultValues,
        }
  )
  const methods = (
    "methods" in props && props.methods ? props.methods : internal
  ) as UseFormReturn<T>

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  )
}
