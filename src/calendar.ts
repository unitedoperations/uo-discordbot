import FeedParser from 'feedparser'
import request from 'request'
import signale from 'signale'

export interface CalendarEvent {
  guid: string
  title: string
  date: Date | null
  link: string
  img: string
}

/**
 * @description Handles the RSS feed and parsing from the forums calendar
 * @export
 * @class CalendarFeed
 */
export class CalendarFeed {
  private _feed: FeedParser
  private _req: request.Request
  private _eventsCache: CalendarEvent[] = []

  constructor(url: string) {
    this._feed = new FeedParser({ feedurl: url })
    this._feed.on('readable', this._onFeedReadable)
    this._req = request(url)
  }

  /**
   * Pull all of the calendar events from the forums that
   * have not happened yet to parser them
   * @memberof CalendarFeed
   */
  pull() {
    this._req.on('error', signale.error)
    this._req.on('response', this._onResponse)
  }

  /**
   * Returns the current state of the calendar events cache
   * @returns {CalendarEvent[]}
   * @memberof CalendarFeed
   */
  getEvents(): CalendarEvent[] {
    return this._eventsCache
  }

  /**
   * Event handler for when the request to the forums calendar
   * is fulfilled with the event RSS data, it is piped to the
   * RSS feed parser
   * @private
   * @param {request.Response} res
   * @memberof CalendarFeed
   */
  private _onResponse = (res: request.Response) => {
    this._req.pipe(this._feed)
  }

  /**
   * Event handler for when the feed parser receives the
   * RSS stream from the request to the calendar to read the
   * entities. Each read RSS item is converted into a
   * {@type CalendarEvent} and stores them for later use
   * @private
   * @memberof CalendarFeed
   */
  private _onFeedReadable = () => {
    const events: CalendarEvent[] = []
    let e: FeedParser.Item

    while ((e = this._feed.read())) {
      const imgUrl: string = this._findImage(e.summary) || ''
      events.push({
        guid: e.guid,
        title: e.title,
        date: e.date,
        link: e.link,
        img: imgUrl
      })
    }

    if (events.length > 0) this._eventsCache = events
  }

  /**
   * Uses a regular expression to parse and find the header image for the
   * RSS event's summary that is being passed in
   * @param {string} html
   * @returns {string | null}
   */
  private _findImage(html: string): string | null {
    const exp: RegExp = /<img\sclass='bbc_img'\ssrc='(.*)'\salt=.*\/>/g
    const match = exp.exec(html)
    if (match) return match[1]
    return null
  }
}