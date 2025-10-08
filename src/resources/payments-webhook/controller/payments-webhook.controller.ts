import { Body, Controller, Post } from '@nestjs/common';
import { IncomingPaymentWebhookDto } from '../dto/incoming-payment-webhook.dto';
import { PaymentsWebhookService } from '../service/payments-webhook.service';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('webhooks/payments')
export class PaymentsWebhookController {
  constructor(private readonly service: PaymentsWebhookService) {}

  @Public()
  @Post()
  async receive(@Body() body: IncomingPaymentWebhookDto) {
    return this.service.handle(body);
  }
}
