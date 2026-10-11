import { HttpInterceptorFn } from '@angular/common/http';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  const correlationId = 'web_' + Math.random().toString(36).substring(2, 12);
  const cloned = req.clone({
    setHeaders: {
      'X-Correlation-ID': correlationId
    }
  });
  return next(cloned);
};
