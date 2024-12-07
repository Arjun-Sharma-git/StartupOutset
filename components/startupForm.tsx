'use client'

import React, { useState, useActionState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/actions';

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = React.useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        pitch: formData.get('pitch') as string
      }

      await formSchema.parseAsync(formValues);
      console.log(formValues);

      const result = await createPitch(prevState , formData , pitch)

      if (result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Your startup pitch has been created successfully',
          variant: 'destructive'
        })
        router.push(`/startup/${result._id}`);
      }

      return result 
    } catch (error) {
      if (error instanceof z.ZodError) {
        const {fieldErrors} = error.flatten();
        console.log("🚀 ~ handleFormSubmit ~ fieldErrors:", fieldErrors)

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: 'Error',
          description: 'Please check your inputs and try again',
          variant: 'destructive'
        })

        return { ...prevState, error: "Validation Failed", status: 'ERROR' };
      }

      toast({
        title: 'Error',
        description: 'An unexpected error has occurred',
        variant: 'destructive'
      })

      return { ...prevState, error: "An unexpercted error has occured", status: 'ERROR' };
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    {
      error: '',
      status: 'INITIAL'
    }
  )

  return (
    <form action={formAction} className='startup-form'>
      <div>
        <label
          htmlFor="title"
          className='startup-form_label'>
          Title
        </label>
        <Input
          id='title'
          name='title'
          required
          placeholder='Startup Title'
          className='startup-form_input' />

        {
          errors.title && (
            <p className='startup-form_error'>
              {errors.title}
            </p>
          )
        }
      </div>

      <div>
        <label
          htmlFor="description"
          className='startup-form_label'>
          Description
        </label>
        <Textarea
          id='description'
          name='description'
          required
          placeholder='Startup Title'
          className='startup-form_textarea' />

        {
          errors.description && (
            <p className='startup-form_error'>
              {errors.description}
            </p>
          )
        }
      </div>

      <div>
        <label
          htmlFor="category"
          className='startup-form_label'>
          Category
        </label>
        <Input
          id='category'
          name='category'
          required
          placeholder='Startup Category (Teach, Health, Education ...)'
          className='startup-form_input' />

        {
          errors.category && (
            <p className='startup-form_error'>
              {errors.category}
            </p>
          )
        }
      </div>

      <div>
        <label
          htmlFor="link"
          className='startup-form_label'>
          Image URL
        </label>
        <Input
          id='link'
          name='link'
          required
          placeholder='Startup Image URL'
          className='startup-form_input' />

        {
          errors.link && (
            <p className='startup-form_error'>
              {errors.link}
            </p>
          )
        }
      </div>

      <div data-color-mode="light">
        <label
          htmlFor="pitch"
          className='startup-form_label'>
          Title
        </label>

        <MDEditor
          value={pitch}
          className='mt-2'
          onChange={(value) => setPitch(value || '')}
          id='pitch'
          preview='edit'
          height={300}
          style={{
            borderRadius: 20,
            overflow: 'hidden'
          }}
          textareaProps={{
            placeholder: 'Briefly describe your idea and what problem it solves'
          }}
          previewOptions={{
            disallowedElements: ['style']
          }}
        />

        {
          errors.pitch && (
            <p className='startup-form_error'>
              {errors.pitch}
            </p>
          )
        }
      </div>

      <Button
        type='submit'
        className='startup-form_btn text-white'
        disabled={isPending}
      >
        {
          isPending ? 'Submitting...' : 'Submit Your Pitch'
        }

        <Send className='size-6 ml-2' />
      </Button>
    </form>
  )
}

export default StartupForm