import { Timer } from "Timer";
import { CalendarEvent, ScheduledEvent, TodoEvent } from "./calendarEvent";

export class Day {

    date: Date
    dayEvents: Array<CalendarEvent>;
    daySchedule: Array<number>;
    dayStart:Timer;

    constructor(date:Date, dayEvents:Array<CalendarEvent>, dayStart:Timer, dayEnd:Timer){
        
        this.date = new Date(date);
        this.dayEvents = dayEvents;
        this.daySchedule = new Array<number>();
        this.dayStart = dayStart;
        for(let i = 0; i < (dayEnd.time - dayStart.time); i++){
            this.daySchedule.push(-1);
        }

        dayEvents.sort((event1:CalendarEvent, event2:CalendarEvent) => {
            
            if (event1 instanceof ScheduledEvent && event2 instanceof TodoEvent){
                return -1;
            }

            if (event2 instanceof ScheduledEvent && event1 instanceof TodoEvent){
                return 1;
            }

            if (event1 instanceof TodoEvent && event2 instanceof TodoEvent){
                
                if (event1.du != undefined && event2.du == undefined){
                    return -1;
                }

                if (event2.du != undefined && event1.du == undefined){
                    return 1;
                }

                if (event1.du != undefined && event2.du != undefined){
                    return event1.du.getTime() - event2.du.getTime();
                }

            }
            
            return 0;
        });


        let placingEvent = 0;

        while (placingEvent < this.dayEvents.length && this.dayEvents[placingEvent] instanceof ScheduledEvent){

            for(let j = (this.dayEvents[placingEvent] as ScheduledEvent).getTime() - this.dayStart.time; j <= this.dayStart.time + (this.dayEvents[placingEvent] as ScheduledEvent).duration.time; j++){
                if(this.daySchedule[j] == -1){
                    this.daySchedule[j] = placingEvent;
                }
            }

            placingEvent++;
        }

        while (placingEvent < this.dayEvents.length){

            let estimatedEventDuration = 30;
            if ((this.dayEvents[placingEvent] as TodoEvent).estimatedDuration != undefined){
                estimatedEventDuration = (this.dayEvents[placingEvent] as TodoEvent).estimatedDuration!.time;
            }

            for (let j = 0; j < this.daySchedule.length && estimatedEventDuration > 0; j++){
                if (this.daySchedule[j] == -1){
                    this.daySchedule[j] = placingEvent;
                    estimatedEventDuration--;
                }
            }

            placingEvent++;
        }

    }

}