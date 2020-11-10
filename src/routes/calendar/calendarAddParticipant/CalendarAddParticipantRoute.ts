import HTTPRequest from "../../http/HTTPRequest";
import Route from "../../Route";
import { calendar_v3 } from "googleapis";
import CalendarAddParticipantRequest from "./CalendarAddParticipantRequest";

/**
 * Route: /calendar/:calendarId/events/:eventId/addParticipant
 * Ajoute un participant à un événement
 */
class CalendarAddParticipantRoute extends Route<CalendarAddParticipantRequest> {
	
	public readonly expectedData: (keyof CalendarAddParticipantRequest)[] = ["calendarId", "email", "eventId"];

	public async handle(request: HTTPRequest<CalendarAddParticipantRequest>) {
		try {
			const event = await this._calendarAPI.addParticipant(request.body.calendarId, request.body.eventId, request.body.email);
			request.sendJsonPayload<calendar_v3.Schema$Event>(event);
		} catch (e) {
			this.logger.error(e);
			request.sendJsonError();
		}
	}
}

export default CalendarAddParticipantRoute;