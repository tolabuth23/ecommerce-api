import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const Req = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest()
})

export default Req
