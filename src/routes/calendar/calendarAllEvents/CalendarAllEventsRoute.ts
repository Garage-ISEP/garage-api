import HTTPRequest from "../../http/HTTPRequest";
import Route from "../../Route";
import { calendar_v3 } from "googleapis";

/**
 * Route: /all/events
 * Lister tous les événements de tous les calendriers
 */
class CalendarAllEventsRoute extends Route<Partial<calendar_v3.Params$Resource$Events$Get>> {
	
	public readonly expectedData: never[];

	public async handle(request: HTTPRequest<Partial<calendar_v3.Params$Resource$Events$Get>>) {
		try {
			const calendars = await this._calendarAPI.getAllEvents(request.body);
			request.sendJsonPayload<calendar_v3.Schema$Event[]>(calendars);
		} catch (e) {
			this.logger.error(e);
			request.sendJsonError();
		}
	}
}

export default CalendarAllEventsRoute;