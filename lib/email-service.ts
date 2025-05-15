import { AssessmentFormData } from "../app/types";

/**
 * Sends a notification email when user completes the personal details section
 */
export async function sendPersonalDetailsEmail(personalData: {
  fullName: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  dateCompleted: string;
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'personalDetails',
        data: personalData
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending personal details email:', error);
    throw error;
  }
}

/**
 * Sends a notification email when user completes the entire form
 */
export async function sendFormCompletionEmail(formData: AssessmentFormData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'formCompletion',
        data: formData
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending form completion email:', error);
    throw error;
  }
}

/**
 * Sends a thank you email to the user who submitted the form
 */
export async function sendThankYouEmail(userData: {
  fullName: string;
  email: string;
  language: string;
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'thankYou',
        data: userData
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw error;
  }
} 