const { listPublicCalendars, getEvents, getAllEvents, getEvent } = require('../../utils/googleapis/calendar/index')

describe("listPublicCalendars", () => {
	test("it should return a list of object with the summary, color, timeZone and id of the clandar", async () => {
		const result = await listPublicCalendars();

		// Check if array
		expect(Array.isArray(result)).toBe(true);

		result.forEach(calendar => {
			const keys = Object.keys(calendar)
			// Check if  all the necessary elements are returned
			expect(keys).toContain('summary')
			expect(keys).toContain('color')
			expect(keys).toContain('timeZone')
			expect(keys).toContain('id')
		})
	})
})

describe("getEvents", () => {
	test("it should return a object with kind: calendar#events", async () => {
		const calendarId = '2mqb3k5gf0rb56jv7cj2qnrop4@group.calendar.google.com'

		const result = await getEvents(calendarId)

		expect(result.kind).toBe('calendar#events')
	})

	test("it should use config to do the query", async () => {
		const calendarId = '2mqb3k5gf0rb56jv7cj2qnrop4@group.calendar.google.com'

		const result = await getEvents(calendarId, {
			maxResults: 1,
			timeMin: "2020-01-06T00:00:00-00:00"
		})

		expect(result.items.length).toBe(1)
	})
})

describe("getAllEvents", () => {
	test("it should return a list of calendar#event", async () => {
		const result = await getAllEvents(['2mqb3k5gf0rb56jv7cj2qnrop4@group.calendar.google.com'])

		result.forEach(event => {
			expect(event.kind).toBe('calendar#event')
		})
	})

	test("it should set calendarId of each event with one of the calendarId in input", async () => {
		const calendars = ['2mqb3k5gf0rb56jv7cj2qnrop4@group.calendar.google.com']

		const result = await getAllEvents(calendars)

		result.forEach(event => {
			expect(event.calendarId).toEqual(expect.anything()) // Should be defined
			expect(calendars.indexOf(event.calendarId) !== -1).toBe(true) // Should be one of the calendars called
		})
	})
})

describe("getEvent", () => {
	test("it should return the calendar#event wished", async () => {
		const calendarId = "2mqb3k5gf0rb56jv7cj2qnrop4@group.calendar.google.com"
		const eventId = "2b2aegujiq04gvnt31ge310spt"

		const result = await getEvent(calendarId, eventId)

		expect(result.kind).toBe("calendar#event") // Check kind
		expect(result.id).toBe(eventId) // Check for the event id
		expect(result.organizer.email).toBe(calendarId) // Check if it's in the good calendar
	})
})