export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'Invitation' | 'Rejection' | 'Update';
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'invitation-1',
    name: 'Interview Invitation',
    type: 'Invitation',
    subject: 'Interview Invitation: {jobTitle} at {companyName}',
    body: `Hi {candidateName},

Thank you for your application for the {jobTitle} position at {companyName}. 

Our team was impressed with your background and we'd like to invite you for an initial interview to learn more about your experience and discuss the role in more detail.

Please let us know your availability for a 30-minute call next week.

Best regards,
{senderName}
{companyName}`
  },
  {
    id: 'rejection-1',
    name: 'Rejection Email',
    type: 'Rejection',
    subject: 'Update regarding your application for {jobTitle}',
    body: `Hi {candidateName},

Thank you for the time and effort you put into your application for the {jobTitle} position at {companyName}.

After careful consideration, we have decided not to move forward with your application at this time. We received many strong applications and had to make some difficult decisions.

We will keep your resume on file for future opportunities that may be a better fit.

We wish you the best in your job search.

Best regards,
{companyName} Team`
  },
  {
    id: 'update-1',
    name: 'Status Update',
    type: 'Update',
    subject: 'Application Status Update: {jobTitle}',
    body: `Hi {candidateName},

I wanted to provide a quick update on your application for the {jobTitle} position.

Our team is still reviewing applications and we expect to have more information for you by the end of this week. Thank you for your patience.

Best regards,
{senderName}
{companyName}`
  }
];

export const replacePlaceholders = (text: string, data: Record<string, string>) => {
  return text.replace(/{(\w+)}/g, (match, key) => {
    return data[key] || match;
  });
};
