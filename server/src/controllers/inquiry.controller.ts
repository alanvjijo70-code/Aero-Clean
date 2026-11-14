import { Request, Response } from 'express';
import { inquiryService } from '../services/inquiry.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ContactController {
  async submitMessage(req: Request, res: Response) {
    try {
      const message = await inquiryService.createContactMessage(req.body, req.user?.id);
      return sendSuccess(res, message, 'Thank you! Your message has been received by our engineering team.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 'CONTACT_SUBMIT_FAILED', 500);
    }
  }
}

export class DemoController {
  async requestDemo(req: Request, res: Response) {
    try {
      const demo = await inquiryService.createDemoRequest(req.body, req.user?.id);
      return sendSuccess(
        res,
        demo,
        'Enterprise demonstration request submitted successfully. An aerospace solutions engineer will contact you shortly.',
        201
      );
    } catch (err: any) {
      return sendError(res, err.message, 'DEMO_REQUEST_FAILED', 500);
    }
  }

  async getDemoRequests(req: Request, res: Response) {
    try {
      const demos = await inquiryService.getDemoRequests();
      return sendSuccess(res, demos, 'Demo requests retrieved');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_DEMOS_FAILED', 500);
    }
  }

  async updateDemoStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await inquiryService.updateDemoStatus(id, status);
      if (!updated) return sendError(res, 'Demo request not found', 'NOT_FOUND', 404);
      return sendSuccess(res, updated, 'Demo request status updated');
    } catch (err: any) {
      return sendError(res, err.message, 'UPDATE_DEMO_STATUS_FAILED', 500);
    }
  }
}

export class NewsletterController {
  async subscribe(req: Request, res: Response) {
    try {
      const { subscriber, alreadySubscribed } = await inquiryService.subscribeNewsletter(req.body);
      const message = alreadySubscribed
        ? 'You are already subscribed to AeroClean AI platform updates.'
        : 'Thank you for subscribing to AeroClean AI autonomous robotics updates.';
      return sendSuccess(res, subscriber, message, alreadySubscribed ? 200 : 201);
    } catch (err: any) {
      return sendError(res, err.message, 'NEWSLETTER_SUBSCRIBE_FAILED', 500);
    }
  }
}

export const contactController = new ContactController();
export const demoController = new DemoController();
export const newsletterController = new NewsletterController();
