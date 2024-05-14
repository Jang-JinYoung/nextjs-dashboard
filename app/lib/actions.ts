'use server';

import { sql } from '@vercel/postgres';

/** 
 * @docs
 * https://nextjs.org/learn/dashboard-app/mutating-data
 * trigger a new server request and re-render the table.
*/
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
/**
 * @docs
 * https://nextjs.org/docs/app/api-reference/functions/redirect
 * The redirect function allows you to redirect the user to another URL
 */
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(formData: FormData) {

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });


  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');


  //   const rawFormData = {
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  //   };
  // Test it out:
  //   console.log(rawFormData);
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export async function deleteInvoice(id: string) {
  console.log(id);
  const result = await sql`DELETE FROM invoices WHERE id = ${id}`;
  console.log(result);
  revalidatePath('/dashboard/invoices');
};