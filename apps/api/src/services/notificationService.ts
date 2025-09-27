import nodemailer from 'nodemailer';
import twilio from 'twilio';
import type { Customer, Hub, Order } from '@harvestlink/shared';
import { env, featureFlags } from '../config/env';
import { logger } from '../utils/logger';

const createMailer = () => {
  if (!featureFlags.emailEnabled) return null;
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

const createTwilioClient = () => {
  if (!featureFlags.smsEnabled) return null;
  return twilio(env.twilioAccountSid, env.twilioAuthToken, { lazyLoading: true });
};

export const sendOrderNotifications = async (input: {
  customer: Customer & { phone?: string };
  order: Order;
  hub: Hub;
  farmName: string;
}): Promise<void> => {
  const mailer = createMailer();
  const smsClient = createTwilioClient();
  const summary = `Your HarvestLink order from ${input.farmName} will be ready for pickup at ${input.hub.name} (${input.hub.address}).`;

  if (mailer) {
    try {
      await mailer.sendMail({
        from: `HarvestLink <${env.smtpUser}>`,
        to: input.customer.email,
        subject: 'HarvestLink order confirmed',
        text: summary,
      });
      logger.info('Sent email confirmation', { orderId: input.order.id });
    } catch (error) {
      logger.error('Email send failed', { error });
    }
  } else {
    logger.info('Email disabled — logging confirmation', { summary });
  }

  if (smsClient && input.customer.phone) {
    try {
      await smsClient.messages.create({
        from: env.twilioFrom,
        to: input.customer.phone,
        body: summary,
      });
      logger.info('Sent SMS confirmation', { orderId: input.order.id });
    } catch (error) {
      logger.error('SMS send failed', { error });
    }
  } else {
    logger.info('SMS disabled or phone missing — logging confirmation', { summary });
  }
};
