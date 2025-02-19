// libraries
import { createTransport, Transporter } from 'nodemailer';
// application modules
import { systemParametersSmtp } from '../../system/system';
import { SMTPParameters } from '../../system/system.model';

/**
 * Email data.
 */
export interface EmailSendData {
  sender?: string;
  recipients: string | string[];
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
} // EmailSendData

export class GeneralUtility {
  /**
   * Syncronous timeout.
   * Awaiting on return promise will execute in syncronous mode.
   * @param milliseconds number of millisecond to wait
   * @returns empty promise to await for
   */
  static sleep = (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }; // sleep

  /**
   * Send a new email.
   * @param emailSendData email data
   */
  static emailSend = async (emailSendData: EmailSendData): Promise<any> => {
    // send email to user
    const smptParameters: SMTPParameters = await systemParametersSmtp();
    const smtpTransport: any = {
      host: smptParameters.host,
      port: smptParameters.port,
      secure: smptParameters.secure,
    };
    if (smptParameters.authentication) {
      smtpTransport.auth = {
        user: smptParameters.authenticationUsername,
        pass: smptParameters.authenticationPassowrd,
      };
    }
    // prepare email message
    const mailMessage: any = {
      from: emailSendData.sender ? emailSendData.sender : smptParameters.defaultSender,
      to: emailSendData.recipients,
      subject: (smptParameters.subjectPrefix + ' ' + emailSendData.subject).trim(),
    };
    if (emailSendData.bodyHtml) {
      mailMessage.html = emailSendData.bodyHtml;
    }
    if (emailSendData.bodyText) {
      mailMessage.text = emailSendData.bodyText;
    }
    const transporter: Transporter = createTransport(smtpTransport);
    return transporter.sendMail(mailMessage);
  }; // emailSend

  /**
   *
   * @param obj
   * @param interf
   * @returns
   */
  static filterObjectByInterface = <T extends object>(obj: any, interf: T, exclusions: string[] = []): T => {
    const result: Partial<T> = {};
    for (const key in interf) {
      if (obj.hasOwnProperty(key) && !exclusions.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result as T;
  };
} // GeneralUtility
