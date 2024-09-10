//npm install http-proxy-middleware --save 설치
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  //네이버 API 프록시 설정
  app.use(
    '/api/naver',
    createProxyMiddleware({
      target: 'https://openapi.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/naver': '', 
      },
    })
  );

  //구글 API 프록시 설정
  app.use(
    '/api/google',
    createProxyMiddleware({
      target: 'https://maps.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/google': '',
      },
    })
  );

  app.use(
    '/oauth2',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      // CORS 요청에 대한 설정
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      },
    })
  );
  
};

