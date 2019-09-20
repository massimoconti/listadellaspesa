// Iniezione gtag analytics
const s = document.createElement('script');
s.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + process.env.VUE_APP_GTAG_UA)
s.async = true;
document.head.appendChild(s);

window.dataLayer = window.dataLayer || [];
window.gtag = function(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', process.env.VUE_APP_GTAG_UA);
gtag('config', process.env.VUE_APP_GTAG_UA, { 'anonymize_ip': true });

window.onerror = function(message, source, lineno, colno, error) {
  gtag('event', 'exception', {
    'description': message +" "+ source +" "+ lineno +" "+ colno,
    'fatal': false
  });
}
