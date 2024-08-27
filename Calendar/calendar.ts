import { App, TFile } from "obsidian";
import { Day } from "./day";
import { Timer } from "Timer";
import { CalendarEvent } from "./calendarEvent";

export class Calendar {

    app: App;

    cachedCalendar: Array<Day>;
    cachedEvents: Array<CalendarEvent>;

    updating:boolean = false;

    constructor(pApp: App){
        this.app = pApp;
    }

    async update(startDate:Date, endDate:Date, updated:CallableFunction){
        this.updating = true;
        this.reloadEvents();
        await sleep(300);
        this.generateCalendar(startDate, endDate);
        await sleep(300);
        updated();
        this.updating = false;
    }

    reloadEvents() : void {

        const files:TFile[] = this.app.vault.getMarkdownFiles();
        this.cachedEvents = new Array<CalendarEvent>();

        for (const file of files) {
            console.log(file.stat)
            console.log(file.name)
            console.log(file.basename)
            console.log(file.extension)
            this.app.fileManager.processFrontMatter(file, (frontmatter:any) => {
                if (frontmatter as "calendar" && frontmatter["calendar"] != undefined) {
                    frontmatter["calendar"].forEach((eventData:any) => {
                        let event = CalendarEvent.generateEvents(eventData, file, this.app)
                        if (event){
                            this.cachedEvents.push(event); 
                        }
                    });
                }
            });
        }

    }

    generateCalendar(from:Date, to:Date) : void {

        this.cachedCalendar = new Array<Day>();

        for(let curr = from; curr <= to; curr.setDate(curr.getDate() + 1)){

            let dayEvents = new Array<CalendarEvent>();

            this.cachedEvents.forEach((event:CalendarEvent) => {

                if (event.canBeIncludedInDate(curr)){
                    dayEvents.push(event);
                }

            });

            this.cachedCalendar.push(new Day(curr, dayEvents, new Timer("7h"), new Timer("23h")));

        }

    }

    getCalendar() : Array<Day> {
        return this.cachedCalendar;
    }

}