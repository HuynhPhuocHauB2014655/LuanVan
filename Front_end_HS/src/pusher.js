import Pusher from 'pusher-js';

const pusher = new Pusher('d9c24cbffd2fe26b0429', {
    cluster: 'ap1',
    encrypted: true
});

export default pusher;
