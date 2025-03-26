import { Notify } from 'quasar';
import axios from 'axios';
import { useUserStore } from '../stores/userStore';

export function handleApiError(error: unknown): void {
  let errorMessage = 'An unexpected error occurred. Please try again later.';

  if (axios.isAxiosError(error)) {
    
    if (error.response?.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    }

    if (
      error.response?.status === 401 &&
      error.response.data?.message === 'Unauthenticated.'
    ) {
      const userStore = useUserStore();
      userStore.deleteCurrentSession();
      return;
    }
  }

  Notify.create({
    type: 'negative',
    message: errorMessage,
    timeout: 5000,
  });
}
