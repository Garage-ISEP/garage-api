const { calendar } = require('../googleapis')
const publicCalendars = require('./calendars.json')

/**
 * List all events of a calendar
 * @param {String} id email used to diferentiate calendars
 * @param {*} from date in ISO format
 */
async function getEvents (id, config) {
    const response = await calendar.events.list({
        calendarId: id,
        alwaysIncludeEmail: true,
        ...config
    })
    return response.data
}

/**
 * List all events of a calendar from the closest to the newest
 * @param {String} calendarsIds list of all the emails used to diferentiate calendars
 * @param {String} from date in ISO format
 */
async function getOrderedEvents(calendarsIds, from) {
    let result = []
    await Promise.all(calendarsIds.map(async id => {
        const response = await getEvents(id, from)
        const items = response.items.map(event => {
            return Object.assign({calendarId: id}, event)
        })
        result = result.concat(items)
    }));
    result = result.sort((a, b) => {
        const date1 = new Date(a.start.dateTime)
        const date2 = new Date(b.start.dateTime)
        return date1.getTime()-date2.getTime()
    })
    return result
}


/**
 * Adds a participent to the event of a calendar
 * @param {String} calendarId 
 * @param {String} eventId 
 * @param {String} email 
 */
async function addParticipants (calendarId, eventId, email) {
    const response = await calendar.events.patch({
        calendarId,
        eventId,
        sendNotifications: true, // Sends a notification to the new participent
        resource: {
            attendees: [
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
    await Promise.all(publicCalendars.map(async id => {
        const response = await calendar.calendars.get({
            calendarId: id
        })

        result.push({
            summary: response.data.summary,
            id: response.data.id,
            timeZone: response.data.timeZone
        })
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
    addParticipants,
    getOrderedEvents,
    listPublicCalendars
}