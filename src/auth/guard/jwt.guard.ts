import { AuthGuard } from "@nestjs/passport";
// Custom guard
export class JwtGuard extends AuthGuard('jwt') {

}