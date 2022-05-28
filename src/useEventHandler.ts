import { Channel } from 'phoenix';
import { useEffect, useRef } from 'react';

export function useEventHandler(channel: Channel | null, eventName: string, handler: any) {
	const handlerFunc = useRef(handler);

	useEffect(() => {
		if (channel) {
			const ref = channel.on(eventName, (message) => {
				handlerFunc.current(message);
			});

			return () => {
				channel?.off(eventName, ref);
			};
		}
	}, [channel, eventName]);
}
