import HTTPRequest from './http/HTTPRequest';
import Logger from "../utils/Logger";

abstract class Route {
	public logger: Logger = new Logger(this);

	public abstract handle(request: HTTPRequest<unknown>): void;
}

export default Route;