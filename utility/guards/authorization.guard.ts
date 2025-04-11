import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from "@nestjs/common";

export const AuthorizeGuard = (allowedRoles: string[]) => {
    class RolesGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();
            const user = request?.currentUser;

            if (!user) {
                throw new UnauthorizedException('User not found.');
            }

            if (!allowedRoles.includes(user.role)) {
                throw new UnauthorizedException('Sorry, you are not authorized.');
            }

            return true;
        }
    }

    return mixin(RolesGuardMixin);
};

