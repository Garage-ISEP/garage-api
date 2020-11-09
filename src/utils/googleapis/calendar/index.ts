import { calendar_v3 } from 'googleapis';
import { MethodOptions } from 'googleapis/build/src/apis/ml';
import { calendar } from '../googleapis';
import * as publicCalendars from './calendars.json';

/**
 * List all events of a calendar
 */
async function getEvents(id: string, config: MethodOptions): Promise<calendar_v3.Schema$Events> {
    const response = await calendar.events.list({
        calendarId: id,
		alwaysIncludeEmail: true,
        ...config
    })
    return response.data
}

// TODO: gérer les exceptions

/**
 * List all events of a calendar
 * @param {*} calendarsIds list of all the emails used to diferentiate calendars
 * @param {*} orderBy order by default asc
 * @param {*} config see googleapi
 */
async function getAllEvents(calendarsIds: string[], config: MethodOptions, orderBy: "desc"|"asc" = 'asc') {
    let result = []
    await Promise.all(calendarsIds.map(async id => {
        const response = await getEvents(id, config)
        const items = response.items.map(event => {
            return Object.assign({calendarId: id}, event)
        })
        result = result.concat(items)
    }));
    result = result.sort((a, b) => {
        const date1 = new Date(a.start.dateTime || a.start.date)
        const date2 = new Date(b.start.dateTime || b.start.date)
        return orderBy == 'desc' ? date2.getTime()-date1.getTime() : date1.getTime()-date2.getTime()
    })
    return result
}

async function getEvent(calendarId, eventId, config={}) {
    const result = await calendar.events.get({
        calendarId,
        eventId
    })
    return result.data
}

/**
 * Adds a participent to the event of a calendar
 * @param {String} calendarId 
 * @param {String} eventId 
 * @param {String} email 
 */
async function addParticipant (calendarId, eventId, email) {
    // Get original attendees
    const event = await getEvent(calendarId, eventId)
    if(!event.attendees) {
        event.attendees = []
    }
    console.log({
        calendarId,
        eventId,
        sendNotifications: true, // Sends a notification to the new participent
        resource: {
            attendees: [
                ...event.attendees,
                {
                    email
                }
            ]
          }
    }.resource.attendees)
    const response = await calendar.events.patch({
        calendarId,
        eventId,
        sendNotifications: true, // Sends a notification to the new participent
        resource: {
            attendees: [
                ...event.attendees,
                {
                    email
                }
            ]
          }
    })

    return response.data
}

/**
 * List all public calendars
 */
async function listPublicCalendars () {
    let result = []
    await Promise.all(publicCalendars.map(async cal => {
        try {
            const response = await calendar.calendars.get({
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
    return result
}

/**
 * Lists all accessible calendars by the user
 */
async function listCalendars () {
    const response = await calendar.calendarList.list()
    return response.data.items
}

module.exports = {
    listCalendars,
    getEvents,
    getEvent,
    addParticipant,
    getAllEvents,
    listPublicCalendars
}