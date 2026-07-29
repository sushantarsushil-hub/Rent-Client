import { loadStripe } from '@stripe/stripe-js';
import { getEnvVar } from './env';


const stripePublishableKey =
  getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') ||
  getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY') ||
  'pk_test_51TyBg8K7Ml31U4LJk742JyHNbkviBzgP12Tvt6JEhfMbHTIHoUMccS3VciimBkctrCFbG6DUQrDIJVXEyODJry8x00hHtLMfpa';

export const stripePromise = loadStripe(stripePublishableKey);

export default stripePromise;

