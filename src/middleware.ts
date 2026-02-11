import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const authHeader = request.headers.get('authorization');

  // Set your desired credentials here
  const USERNAME = 'admin';
  const PASSWORD = 'your-secret-password'; 

  if (!authHeader) {
    return new Response('Password Required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
    });
  }

  const authValue = authHeader.split(' ')[1];
  const [user, pass] = atob(authValue).split(':');

  if (user === USERNAME && pass === PASSWORD) {
    return next();
  }

  return new Response('Invalid Credentials', { status: 401 });
});