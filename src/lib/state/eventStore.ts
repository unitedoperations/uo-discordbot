/**
 * Interface type for a parsed event from the forums calendar feed
 * @export
 * @interface CalendarEvent
 */
export interface CalendarEvent {
  guid: string
  title: string
  date: Date
  link: string
  img: string
  group: string
  reminders: Map<string, boolean>
}

/**
 * State store for calendar events pulled from the forums
 * @export
 * @class EventStore
 * @property {Map<string, CalendarEvent>} cache
 */
class EventStore {
  private _events: Map<string, CalendarEvent> = new Map()

  /**
   * Returns if the argued ID exists in the events cache
   * @param {string} id
   * @returns {boolean}
   * @memberof EventStore
   */
  has(id: string): boolean {
    return this._events.has(id)
  }

  /**
   * Sets the ID in the events cache to the argued CalendarEvent
   * @param {string} id
   * @param {CalendarEvent} e
   * @memberof EventStore
   */
  add(id: string, e: CalendarEvent) {
    if (!this._events.has(id)) this._events.set(id, e)
  }
}

export default new EventStore()