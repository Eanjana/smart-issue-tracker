import { HttpInterceptorFn } from '@angular/common/http';

/**
 * @description HTTP interceptor that attaches the Bearer token
 * from localStorage to every outgoing API request.
 * @author Anjana E
 * @date 01-03-2026
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(authReq);
};
