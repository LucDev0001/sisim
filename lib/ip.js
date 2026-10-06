export function getIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  return (xff ? xff.split(',')[0].trim() : request.headers.get('x-real-ip')) || 'local';
}
