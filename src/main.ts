import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import timezone from 'dayjs/plugin/timezone'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger'

dayjs.extend(isToday)
dayjs.extend(timezone)
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')
  const provider = configService.get<string>('provider')
  const logger = new Logger()

  if (process.env.ENABLE_SWAGGER_API_DOCUMENT === '1') {
    setupSwagger(app)
  }
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  await app.listen(port, () => {
    logger.log(`
      Application ${provider} started listen on port ${port}
      Consumer Queue: 3000
      Local Timezone guess: ${dayjs.tz.guess()}
      Local Date:    ${dayjs().toDate().toISOString()} ~ ${dayjs().format(
      'YYYY-MM-DD HH:mm:ss',
    )}
    `)
  })
}
bootstrap()
