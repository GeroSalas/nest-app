import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();
  return data ? user && user[data] : user;
});

export default AuthUser;
