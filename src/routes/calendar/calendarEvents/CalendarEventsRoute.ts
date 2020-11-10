import HTTPRequest from "../../http/HTTPRequest";
import Route from "../../Route";
import { calendar_v3 } from "googleapis";
import CalendarEventsRequest from "./CalendarEventsRequest";

/**
 * Route: /calendar/:calendarId/events
 * Lister tous les événements d'un calendrier
 */
class CalendarEventsRoute extends Route<CalendarEventsRequest> {
	
	public readonly expectedData: (keyof CalendarEventsRequest)[] = ["calendarId"];

	public async handle(request: HTTPRequest<CalendarEventsRequest>) {
		try {
			const calendars = await this._calendarAPI.getEvents(request.body.calendarId, request.body);
			request.sendJsonPayload<calendar_v3.Schema$Events>(calendars);
		} catch (e) {
			this.logger.error(e);
			request.sendJsonError();
		}
	}
}

export default CalendarEventsRoute;