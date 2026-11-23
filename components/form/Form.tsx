'use client'

import * as React from 'react'
import { FormProvider, useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'

export function Form({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: {
  schema: ZodType<any>
  defaultValues: DefaultValues<any>
  onSubmit: (values: any) => void | Promise<void>
  children: React.ReactNode
  className?: string
}) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(onSubmit)} noValidate>{children}</form>
    </FormProvider>
  )
}
