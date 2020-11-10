# Garage Companion API

## Description :

Cette API à pour but de servir de proxy à l'API de Google Calendar pour les Calendars de chaque LAB

## Liste des Routes, Requêtes, Paramètres et Réponses
Si jamais il manque des paramètres obligatoire pour chaque requète l'API renverra un code 400 "Missing Request Params" avec une liste des paramètres manquant.
La totalité des paramètres dans le corp d'une requête POST sont à envoyer sous forme de JSON avec dans le Header un champ: "Content-Type: application/json"
La totalité des réponses seront sous forme de JSON

### GET /
 * Renvoie le code de la version de l'API actuelle

### GET /calendar
 * Renvoie le code de la version de l'API actuelle

### GET /calendar/all
 * Renvoie tous les calendriers de chaque LAB avec leurs informations
 * [Réponse](https://developers.google.com/calendar/v3/reference/calendarList)

### POST /calendar/all/events
 * Renvoie tous les événements de tous les LAB avec leurs informations
 * [Paramètres optionels (voir 'Optional query parameters')](https://developers.google.com/calendar/v3/reference/events/list)
 * [Réponse (voir 'Response')](https://developers.google.com/calendar/v3/reference/events/list)

### POST /calendar/:calendarId/events
 * Renvoie tous les événements d'un LAB avec leurs informations
 * [Paramètres obligatoires](./src/routes/calendar/calendarEvents/CalendarEventsRequest.ts)
 * [Paramètres optionels (voir 'Optional query parameters')](https://developers.google.com/calendar/v3/reference/events/list)
 * [Réponse (voir 'Response')](https://developers.google.com/calendar/v3/reference/events/list)

### POST /calendar/:calendarId/events/:eventId/addParticipant
 * Ajoute un participant via son adresse mail à un événement et renvoie l'événement modifié avec l'utilisateur ajouté
 * [Paramètres obligatoires](./src/routes/calendar/calendarAddParticipant/CalendarAddParticipantRequest.ts)
 * [Réponse (voir 'Response')](https://developers.google.com/calendar/v3/reference/events/list)