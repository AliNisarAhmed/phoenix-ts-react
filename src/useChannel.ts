import { Channel, Push } from 'phoenix';
import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from './SocketContext';

export function useChannel(topic: string, params: any, onJoin: any): Channel | null {
	const { socket } = useSocketContext();
	const [channel, setChannel] = useState<Channel | null>(null);

	const onJoinFunc = useRef(onJoin);

	useEffect(() => {
		if (socket) {
			const _channel = socket.channel(topic, params);
			_channel.join().receive('ok', (message) => onJoinFunc.current(_channel, message));
			setChannel(_channel);

			return () => {
				channel?.leave();
				setChannel(null);
			};
		}
	}, [socket, topic, params]);

	return channel;
}

export function sendMessage(
	channel: Channel,
	eventName: string,
	payload: object,
	timeout?: number
) {
	return pushPromisified(channel.push(eventName, payload, timeout));
}

function pushPromisified(push: Push) {
	return new Promise((resolve, reject) => {
		if (!push) {
			return reject('No Push');
		}

		push.receive('ok', resolve).receive('error', reject).receive('timeout', reject);
	});
}
