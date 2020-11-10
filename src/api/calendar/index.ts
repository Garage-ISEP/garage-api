import Logger from "../../utils/Logger";
import { calendar_v3 } from 'googleapis';
import { google } from "googleapis";
import * as publicCalendars from './calendars.json';
import PublicCalendarModel from "./PublicCalendarModel";

class Calendar {
	private readonly _logger: Logger = new Logger(this);
	private _calendar: calendar_v3.Calendar;

	public async init(): Promise<Calendar> {
		// configure a JWT auth client
		let jwtClient = new google.auth.JWT({
			email: process.env.client_email,
			key: process.env.private_key,
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets',
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/calendar'
			]
		});

		// authenticate request
		await new Promise((resolve, reject) => {
			jwtClient.authorize((err, tokens) => {
				if (err)
					this._logger.error(err)
				else
					this._logger.log("Calendar API Connected");
				resolve();
			});
		});
		
		// Google Calendar API
		this._calendar = google.calendar({
			version: 'v3',
			auth: jwtClient
		});

		return this;
	}

	/**
	 * List all events of a calendar
	 */
	public async getEvents(id: string, config?: calendar_v3.Params$Resource$Events$Get): Promise<calendar_v3.Schema$Events> {
		const response = await this._calendar.events.list({
			calendarId: id,
			alwaysIncludeEmail: true,
			...config
		});
		return response.data;
	}

	// TODO: gérer les exceptions

	/**
	 * List all events of a calendar
	 */
	public async getAllEvents(config?: calendar_v3.Params$Resource$Events$Get, orderBy: "desc" | "asc" = 'asc'): Promise<calendar_v3.Schema$Event[]> {
		let result: calendar_v3.Schema$Event[] = [];

		await Promise.all(publicCalendars.map(async el => {
			const response = await this.getEvents(el.id, config)
			const items = response.items.map(event => {
				return Object.assign({ calendarId: el.id }, event)
			})
			result = result.concat(items);
		}));
		result = result.sort((a, b) => {
			const date1 = new Date(a.start.dateTime || a.start.date)
			const date2 = new Date(b.start.dateTime || b.start.date)
			return orderBy == 'desc' ? date2.getTime() - date1.getTime() : date1.getTime() - date2.getTime()
		});
		return result;
	}

	public async getEvent(calendarId: string, eventId: string, config?: calendar_v3.Params$Resource$Events$Get): Promise<calendar_v3.Schema$Event> {
		const result = await this._calendar.events.get({
			calendarId,
			eventId,
			...config
		});
		return result.data;
	}

	/**
	 * Adds a participent to the event of a calendar
	 */
	public async addParticipant(calendarId: string, eventId: string, email: string): Promise<calendar_v3.Schema$Event> {
		// Get original attendees
		const event = await this.getEvent(calendarId, eventId);

		const res = await this._calendar.events.patch({
			calendarId: calendarId,
			eventId: eventId,
			sendNotifications: true,
			requestBody: {
				attendees: [
					...(event.attendees || []),
					{
						email: email
					}
				]
			}
		});

		return res.data;
	}

	/**
	 * List all public calendars
	 */
	public async listPublicCalendars(): Promise<PublicCalendarModel[]> {
		let result: PublicCalendarModel[] = []
		await Promise.all(publicCalendars.map(async cal => {
			try {
				const response = await this._calendar.calendars.get({
					calendarId: cal.id
				})

				result.push({
					summary: response.data.summary,
					color: cal.color,
					id: response.data.id,
					timeZone: response.data.timeZone
				})
			} catch (e) {
				console.error(`Calendar ${cal.id} was not found`);
			}
		}));
		return result;
	}

	/**
	 * Lists all accessible calendars by the user
	 */
	public async listCalendars(): Promise<calendar_v3.Schema$CalendarListEntry[]> {
		const response = await this._calendar.calendarList.list()
		return response.data.items
	}

}

export default Calendar;