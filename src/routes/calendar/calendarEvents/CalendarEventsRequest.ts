import { calendar_v3 } from "googleapis";

export default interface CalendarEventsRequest extends Partial<calendar_v3.Params$Resource$Events$Get> {
	calendarId: string;
}