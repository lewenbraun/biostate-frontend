import { Notify } from 'quasar';
import axios from 'axios';

export function handleApiError(error: unknown): void {
  let errorMessage = 'An unexpected error occurred. Please try again later.';
  console.log(error);

  if (axios.isAxiosError(error)) {
    if (error.response?.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
  }

  Notify.create({
    type: 'negative',
    message: errorMessage,
    timeout: 5000,
  });
}
