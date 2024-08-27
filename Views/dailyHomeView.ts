import { Calendar } from "Calendar/calendar";
import { Day } from "Calendar/day";
import { ItemView, Notice, TFile, WorkspaceLeaf } from "obsidian";

export const CALENDAR_DAY_VIEW_TYPE = "calendar-day-view"

export class CalendarDayView extends ItemView {

    mCalendar:Calendar;

    constructor(leaf: WorkspaceLeaf, pCalendar:Calendar) {
        super(leaf);
        this.mCalendar = pCalendar;
    }

    getViewType(): string {
        return CALENDAR_DAY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Calendar Day";
    }

    /*
    async onload(): Promise<void> {
        let endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		this.mCalendar.update(new Date(), endDate, () => {this.showDay()});
    }
    */

    async onOpen(): Promise<void> {
        console.log("opened")
        let endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
        if (this.mCalendar.updating){

        }else{
            this.mCalendar.update(new Date(), endDate, () => {this.showDay()});
        }
    }

    /*
    onResize(): void {
        let endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1);
		this.mCalendar.update(new Date(), endDate, () => {this.showDay()});
    }
    */

    showDay():void {
        console.log("hihi")
        let day:Day = this.mCalendar.getCalendar()[0];

        // SHOW THE DAY !
        const root = this.containerEl.children[1];
        root.innerHTML = "";

        const calendar = root.createEl("div");

        const totalDayLength = this.mCalendar.getCalendar()[0].daySchedule.length;

        let i = 0;
        while (i < totalDayLength){
            let eventDuration = 0;
            let eventId = this.mCalendar.getCalendar()[0].daySchedule[i]
            do {
                eventDuration++;
                i++;
            } while (eventId == this.mCalendar.getCalendar()[0].daySchedule[i] && i < totalDayLength);
            
            calendar.createEl("div", {text:this.mCalendar.getCalendar()[0].dayEvents[eventId].name + " : " +eventDuration + "min"})

        }
    }
        

}