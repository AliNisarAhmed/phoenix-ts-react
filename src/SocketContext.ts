import {
	createElement,
	createContext,
	useEffect,
	useState,
	useContext,
	ReactNode,
	FC,
} from 'react';
import { Socket, SocketConnectOption } from 'phoenix';

export interface ISocketContext {
	socket: Socket | null;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

type SocketProviderProps = {
	options: SocketConnectOption;
	url: string;
	children: ReactNode;
};

export const SocketProvider = ({ children, options, url = '/socket' }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const _socket = new Socket(url, options);

		_socket.connect();
		setSocket(_socket);

		return () => {
			_socket.disconnect();
			setSocket(null);
		};
	}, [options, url]);

	const props = {
		value: {
			socket,
		},
	};

	return createElement(SocketContext.Provider, props, children);
};

export function useSocketContext() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('SocketProvider not found in component tree');
	}

	return context;
}
