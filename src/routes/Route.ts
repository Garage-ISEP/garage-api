import HTTPRequest from './http/HTTPRequest';
import Logger from "../utils/Logger";
import Calendar from '../api/calendar';

abstract class Route<Body> {
	public logger: Logger = new Logger(this);

	public abstract expectedData: (keyof Body)[];

	constructor(
		protected _calendarAPI: Calendar
	) {	}

	public abstract handle(request: HTTPRequest<Body>): void;
}

export default Route;