'use client'

import * as React from 'react'
import { FormProvider, useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: {
  schema: ZodType<T>
  defaultValues: DefaultValues<T>
  onSubmit: (values: T) => void | Promise<void>
  children: React.ReactNode
  className?: string
}) {
  const methods = useForm<T>({ resolver: zodResolver(schema) as Resolver<T>, defaultValues })
  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}
