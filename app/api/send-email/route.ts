import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { AssessmentFormData } from '../../types';

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

// Helper type for file data
interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface ExtendedFormData extends AssessmentFormData {
  orgChartFileData?: FileData;
  employeeDistributionFileData?: FileData;
}

/**
 * Process base64 data to format that nodemailer can use as an attachment
 */
function processBase64ForAttachment(fileData: FileData) {
  // Remove the data:mimetype;base64, prefix from the base64 string
  const base64Data = fileData.base64.split(';base64,').pop() || '';
  
  return {
    filename: fileData.name,
    content: base64Data,
    encoding: 'base64',
    contentType: fileData.type
  };
}

// Common email template structure
const getEmailTemplate = (content: string, isRTL: boolean = false) => {
  return `
    <!DOCTYPE html>
    <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RSM Academy</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background-color: #ffffff;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        .logo {
          max-width: 180px;
          height: auto;
        }
        h2 {
          color: #0056b3;
          margin-top: 0;
          margin-bottom: 20px;
          text-align: center;
          font-size: 22px;
        }
        p {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        .section h3 {
          color: #0056b3;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .highlight {
          font-weight: bold;
          color: #0056b3;
        }
        .contact-info {
          background-color: #0056b3;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          margin-top: 20px;
          text-align: center;
        }
        .contact-info a {
          color: white;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="logo-container">
          <img src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/rsm-international-vector-logo_2_eb7fb9d1-228a-426a-b682-c0d24dc736fa.jpg" alt="RSM Academy Logo" class="logo" onerror="this.onerror=null; this.src='/rsmlogo.jpg';">
        </div>
        ${content}
        <div class="footer">
          <p>© ${new Date().getFullYear()} RSM Academy. All rights reserved.</p>
          <p>For support, please contact <a href="mailto:info@rsmacademy.ae">info@rsmacademy.ae</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * API route to send personal details notification
 */
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (type === 'personalDetails') {
      const personalData = data;
      
      const htmlContent = getEmailTemplate(`
        <h2>New User Started Filling Form</h2>
        <div class="section">
          <h3>Personal Details:</h3>
          <p><span class="highlight">Name:</span> ${personalData.fullName}</p>
          <p><span class="highlight">Job Title:</span> ${personalData.jobTitle}</p>
          <p><span class="highlight">Department:</span> ${personalData.department}</p>
          <p><span class="highlight">Email:</span> ${personalData.email}</p>
          <p><span class="highlight">Phone:</span> ${personalData.phone}</p>
          <p><span class="highlight">Date:</span> ${personalData.dateCompleted}</p>
        </div>
        <div class="contact-info">
          <p>Please check the admin dashboard for more details.</p>
        </div>
      `);
      
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New User Started Filling Form',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    }

    if (type === 'formCompletion') {
      const formData = data as ExtendedFormData;
      
      // Create HTML content for the email with all form data
      const htmlContent = getEmailTemplate(`
        <h2>User Has Completed Form Submission</h2>
        
        <div class="section">
          <h3>Personal Information:</h3>
          <p><span class="highlight">Name:</span> ${formData.fullName}</p>
          <p><span class="highlight">Job Title:</span> ${formData.jobTitle}</p>
          <p><span class="highlight">Department:</span> ${formData.department}</p>
          <p><span class="highlight">Email:</span> ${formData.email}</p>
          <p><span class="highlight">Phone:</span> ${formData.phone}</p>
          <p><span class="highlight">Date:</span> ${formData.dateCompleted}</p>
        </div>
        
        <div class="section">
          <h3>Company Information:</h3>
          <p><span class="highlight">Company Name:</span> ${formData.companyName}</p>
          <p><span class="highlight">Industry:</span> ${formData.industry}</p>
          <p><span class="highlight">Year Established:</span> ${formData.yearEstablished}</p>
          <p><span class="highlight">Location:</span> ${formData.location}</p>
          <p><span class="highlight">Ownership Type:</span> ${formData.ownershipType}</p>
        </div>
        
        <div class="section">
          <h3>Organizational Structure:</h3>
          <p><span class="highlight">Employee Count:</span> ${formData.employeeCount}</p>
          <p><span class="highlight">Employee Distribution:</span> ${formData.employeeDistribution}</p>
          <p><span class="highlight">Organizational Levels:</span> ${formData.orgLevels}</p>
          <p><span class="highlight">Org Chart Available:</span> ${formData.orgChartAvailable}</p>
          ${formData.orgChartFileData ? `<p><span class="highlight">Org Chart File:</span> ${formData.orgChartFileData.name} (Attached)</p>` : ''}
          ${formData.employeeDistributionFileData ? `<p><span class="highlight">Employee Distribution File:</span> ${formData.employeeDistributionFileData.name} (Attached)</p>` : ''}
        </div>
        
        <div class="section">
          <h3>Corporate Culture and Values:</h3>
          <p><span class="highlight">Vision:</span> ${formData.vision}</p>
          <p><span class="highlight">Mission:</span> ${formData.mission}</p>
          <p><span class="highlight">Core Values:</span> ${formData.coreValues}</p>
          <p><span class="highlight">Policies:</span> ${formData.policies}</p>
        </div>
        
        <div class="section">
          <h3>Strategic Direction:</h3>
          <p><span class="highlight">Objectives:</span> ${formData.objectives}</p>
          <p><span class="highlight">Challenges:</span> ${formData.challenges}</p>
          <p><span class="highlight">Projects:</span> ${formData.projects}</p>
        </div>
        
        <div class="section">
          <h3>Training Experience:</h3>
          <p><span class="highlight">Has Training Department:</span> ${formData.hasTrainingDept}</p>
          <p><span class="highlight">Training Programs:</span> ${formData.trainingPrograms}</p>
          <p><span class="highlight">Evaluated Training:</span> ${formData.evaluatedTraining}</p>
          <p><span class="highlight">Evaluation Method:</span> ${formData.evaluationMethod}</p>
        </div>
      `);

      // Prepare email with attachments
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Form Submission Completed',
        html: htmlContent,
        attachments: []
      };

      // Add org chart attachment if available
      if (formData.orgChartFileData) {
        mailOptions.attachments?.push(processBase64ForAttachment(formData.orgChartFileData));
      }

      // Add employee distribution attachment if available
      if (formData.employeeDistributionFileData) {
        mailOptions.attachments?.push(processBase64ForAttachment(formData.employeeDistributionFileData));
      }

      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    }

    if (type === 'thankYou') {
      const userData = data;
      
      // Set content based on user's language
      let subject, emailContent;
      
      if (userData.language === 'ar') {
        subject = 'شكراً - تم استلام طلب التقييم المجاني الخاص بك';
        emailContent = `
          <h2 style="text-align: center;">شكراً - تم استلام طلب التقييم المجاني الخاص بك</h2>
          <div class="section">
            <p style="font-size: 16px; line-height: 1.5;">عزيزي/عزيزتي ${userData.fullName}،</p>
            <p style="font-size: 16px; line-height: 1.5;">شكراً لإكمال النموذج وطلب التقييم المجاني مع أكاديمية RSM السعودية المهنية.</p>
            <p style="font-size: 16px; line-height: 1.5;">يسرنا إبلاغك بأنه تم استلام طلبك بنجاح. سيتواصل معك أحد أعضاء فريقنا قريباً لمناقشة الخطوات التالية المتعلقة بتقييمك.</p>
            <p style="font-size: 16px; line-height: 1.5;">في حال كان لديك أي أسئلة فورية، لا تتردد في الرد على هذا البريد الإلكتروني.</p>
          </div>
          <div class="section">
            <p style="font-size: 16px; line-height: 1.5;">مع أطيب التحيات،</p>
            <p style="font-size: 16px; line-height: 1.5; font-weight: bold; color: #0056b3;">فريق أكاديمية RSM السعودية المهنية</p>
          </div>
          <div class="contact-info">
            <p>للتواصل معنا: <a href="mailto:info@rsmacademy.ae">info@rsmacademy.ae</a></p>
          </div>
        `;
        
        const htmlContent = getEmailTemplate(emailContent, true);
        
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: userData.email,
          subject: subject,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
      } else {
        subject = 'Thank You – Your Free Assessment Request Has Been Received';
        emailContent = `
          <h2>Thank You – Your Free Assessment Request Has Been Received</h2>
          <div class="section">
            <p style="font-size: 16px; line-height: 1.5;">Dear ${userData.fullName},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for completing the form and requesting your free assessment with RSM Saudi Arabia Professional Academy.</p>
            <p style="font-size: 16px; line-height: 1.5;">We're pleased to inform you that your request has been received successfully. One of our team members will be reaching out to you shortly to discuss the next steps regarding your assessment.</p>
            <p style="font-size: 16px; line-height: 1.5;">Should you have any immediate questions, feel free to reply to this email.</p>
          </div>
          <div class="section">
            <p style="font-size: 16px; line-height: 1.5;">Warm regards,</p>
            <p style="font-size: 16px; line-height: 1.5; font-weight: bold; color: #0056b3;">Team RSM Saudi Professional Academy</p>
          </div>
          <div class="contact-info">
            <p>For any inquiries, please contact: <a href="mailto:info@rsmacademy.ae">info@rsmacademy.ae</a></p>
          </div>
        `;
        
        const htmlContent = getEmailTemplate(emailContent);
        
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: userData.email,
          subject: subject,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
      }
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
} 