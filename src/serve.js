import ngrok from 'ngrok';
import nodemon from 'nodemon';

(async function() {
  const url = await ngrok.connect({
    proto: 'http',
    addr: 3000, // Change this to your local server port
  });

  console.log(`Ngrok URL: ${url}`);

  nodemon({
    script: 'src/index.js', // Change this to your server file
    ext: 'js',
    env: { NGROK_URL: url },
  });

  nodemon.on('start', function() {
    console.log('App has started');
  }).on('quit', function() {
    console.log('App has quit');
    process.exit();
  }).on('restart', function(files) {
    console.log('App restarted due to: ', files);
  });
})();
