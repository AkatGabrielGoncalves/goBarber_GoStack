import app from './app';
import Queue from './lib/Queue';

Queue.processQueue();
app.listen(3333, () => console.log('Servidor Online'));
