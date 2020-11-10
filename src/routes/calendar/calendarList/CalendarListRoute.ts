import HTTPRequest from "../../http/HTTPRequest";
import Route from "../../Route";
import { calendar_v3 } from "googleapis";

/**
 * Liste tous les calendriers
 * Route: /calendar/calendarList/list
 */
class CalendarListRoute extends Route<void> {
	public readonly expectedData: never[];

	public async handle(request: HTTPRequest<void>) {
		try {
			const calendars = await this._calendarAPI.listCalendars()
			request.sendJsonPayload<calendar_v3.Schema$CalendarListEntry[]>(calendars);
		} catch (e) {
			this.logger.error(e);
			request.sendJsonError();
		}
	}
}

export default CalendarListRoute;