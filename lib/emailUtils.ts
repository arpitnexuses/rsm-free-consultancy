import nodemailer from 'nodemailer';
import { AssessmentFormData } from '../app/types';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Send email notification when user fills personal details section
 */
export async function sendPersonalDetailsNotification(personalData: {
  fullName: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  dateCompleted: string;
}) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New User Started Filling Form',
      html: `
        <h2>This user has started filling the form</h2>
        <h3>Personal Details:</h3>
        <p><strong>Name:</strong> ${personalData.fullName}</p>
        <p><strong>Job Title:</strong> ${personalData.jobTitle}</p>
        <p><strong>Department:</strong> ${personalData.department}</p>
        <p><strong>Email:</strong> ${personalData.email}</p>
        <p><strong>Phone:</strong> ${personalData.phone}</p>
        <p><strong>Date:</strong> ${personalData.dateCompleted}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Personal details notification sent:', result.response);
    return result;
  } catch (error) {
    console.error('Error sending personal details notification:', error);
    throw error;
  }
}

/**
 * Send email notification when user completes the form with all details
 */
export async function sendFormCompletionNotification(formData: AssessmentFormData) {
  try {
    // Create HTML content for the email with all form data
    const htmlContent = `
      <h2>User Has Completed Form Submission</h2>
      
      <h3>Personal Information:</h3>
      <p><strong>Name:</strong> ${formData.fullName}</p>
      <p><strong>Job Title:</strong> ${formData.jobTitle}</p>
      <p><strong>Department:</strong> ${formData.department}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Date:</strong> ${formData.dateCompleted}</p>
      
      <h3>Company Information:</h3>
      <p><strong>Company Name:</strong> ${formData.companyName}</p>
      <p><strong>Industry:</strong> ${formData.industry}</p>
      <p><strong>Year Established:</strong> ${formData.yearEstablished}</p>
      <p><strong>Location:</strong> ${formData.location}</p>
      <p><strong>Ownership Type:</strong> ${formData.ownershipType}</p>
      
      <h3>Organizational Structure:</h3>
      <p><strong>Employee Count:</strong> ${formData.employeeCount}</p>
      <p><strong>Employee Distribution:</strong> ${formData.employeeDistribution}</p>
      <p><strong>Organizational Levels:</strong> ${formData.orgLevels}</p>
      <p><strong>Org Chart Available:</strong> ${formData.orgChartAvailable}</p>
      
      <h3>Corporate Culture and Values:</h3>
      <p><strong>Vision:</strong> ${formData.vision}</p>
      <p><strong>Mission:</strong> ${formData.mission}</p>
      <p><strong>Core Values:</strong> ${formData.coreValues}</p>
      <p><strong>Policies:</strong> ${formData.policies}</p>
      
      <h3>Strategic Direction:</h3>
      <p><strong>Objectives:</strong> ${formData.objectives}</p>
      <p><strong>Challenges:</strong> ${formData.challenges}</p>
      <p><strong>Projects:</strong> ${formData.projects}</p>
      
      <h3>Training Experience:</h3>
      <p><strong>Has Training Department:</strong> ${formData.hasTrainingDept}</p>
      <p><strong>Training Programs:</strong> ${formData.trainingPrograms}</p>
      <p><strong>Evaluated Training:</strong> ${formData.evaluatedTraining}</p>
      <p><strong>Evaluation Method:</strong> ${formData.evaluationMethod}</p>
    `;

    const mailOptions = {
      from: 'sfernandes.rsmacademy@gmail.com',
      to: 'arpit.m@nexuses.in, sharon.f@rsmacademy-sa.info',
      subject: 'Form Submission Completed',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Form completion notification sent:', result.response);
    return result;
  } catch (error) {
    console.error('Error sending form completion notification:', error);
    throw error;
  }
} 