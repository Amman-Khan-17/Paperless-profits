-- Add salesman columns to orders table
ALTER TABLE public.orders 
ADD COLUMN salesman_id uuid REFERENCES auth.users(id),
ADD COLUMN salesman_name text;


