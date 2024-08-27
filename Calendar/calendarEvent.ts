import { Timer } from "Timer";
import { Repeater } from "./repeater";
import { App, Notice, TFile } from "obsidian";
import { Calendar } from "./calendar";

export abstract class CalendarEvent {

    name: string;
    description: string;
    
    group: string|undefined;
    location: string|undefined;

    repeater : Repeater;

    constructor(name:string , yamlObject: any, file:TFile, app:App) {
        
        this.name = name;

        if (yamlObject[this.name].description){
            this.description = yamlObject[this.name].description;
        } else {
            let notice:Notice = new Notice(this.name + " from " + file.name + " is missing a description");
            notice.noticeEl.onClickEvent(() => {
                const leaf = app.workspace.getLeaf(false);
                leaf.openFile(file);
            });
        }

        if (yamlObject[this.name].group){
            this.group = yamlObject[this.name].group;
        }

        if (yamlObject[this.name].location){
            this.location = yamlObject[this.name].location;
        }

        if (yamlObject[this.name].repeat){
            try{
                this.repeater = new Repeater(yamlObject[this.name].repeat);
            } catch {
                let notice:Notice = new Notice(this.name + " from " + file.name + " as a invalid repeater");
                notice.noticeEl.onClickEvent(() => {
                    const leaf = app.workspace.getLeaf(false);
                    leaf.openFile(file);
                });
            }
        }else{
            this.repeater = new Repeater(undefined);
        }
    }

    static generateEvents(yamlObject: any, file:TFile, app:App): CalendarEvent|undefined {

        let name = Object.keys(yamlObject)[0];

        if (yamlObject[name].type){
            switch(yamlObject[name].type){

                case "scheduled":{
                    return new ScheduledEvent(name, yamlObject, file, app);
                }

                case "todo":{
                    return new TodoEvent(name, yamlObject, file, app);
                }

                default:{
                    let notice:Notice = new Notice(name + " from " + file.name + " as a invalid type: " + yamlObject[name].type + " try scheduled or todo");
                    notice.noticeEl.onClickEvent(() => {
                        const leaf = app.workspace.getLeaf(false);
                        leaf.openFile(file);
                    });
                    break;
                }
            }
        } else {
            let notice:Notice = new Notice(this.name + " from " + file.name + " is missing a type");
            notice.noticeEl.onClickEvent(() => {
                const leaf = app.workspace.getLeaf(false);
                leaf.openFile(file);
            });
        }
    }

    abstract canBeIncludedInDate(date: Date) : boolean;
}

export class ScheduledEvent extends CalendarEvent {

    date: Date;
    duration: Timer;

    constructor(name: string, yamlObject: any, file:TFile, app:App){
        super(name, yamlObject, file, app);

        if (yamlObject[this.name].date){

            let date = new Date(yamlObject[this.name].date);

            if (!isNaN(date.getTime())){
                this.date = date;
            }else{
                let notice:Notice = new Notice(this.name + " from " + file.name + " as a invalid date (YYYY-MM-DDTHH:MM:SS)");
                notice.noticeEl.onClickEvent(() => {
                    const leaf = app.workspace.getLeaf(false);
                    leaf.openFile(file);
                });
            }
        }

        if (yamlObject[this.name].duration){
            try {
                this.duration = new Timer(yamlObject[this.name].duration);
            } catch {
                let notice:Notice = new Notice(this.name + " from " + file.name + " as a invalid duration");
                notice.noticeEl.onClickEvent(() => {
                    const leaf = app.workspace.getLeaf(false);
                    leaf.openFile(file);
                });
            }
        }

    }

    canBeIncludedInDate(date: Date): boolean {
        return this.repeater.equivalentDay(this.date, date);
    }

    getTime(): number {
        return this.date.getHours() * 60 + this.date.getMinutes();
    }

}

export class TodoEvent extends CalendarEvent {

    du: Date|undefined;
    estimatedDuration: Timer|undefined;
    completed: Date|undefined;

    constructor(name:string, yamlObject: any, file:TFile, app:App){
        super(name, yamlObject, file, app)

        if (yamlObject[this.name].du){

            let date = new Date(yamlObject[this.name].du);

            if (!isNaN(date.getTime())){
                this.du = date;
            }else{
                let notice:Notice = new Notice(this.name + " from " + file.name + " as a invalid du (YYYY-MM-DDTHH:MM:SS)");
                notice.noticeEl.onClickEvent(() => {
                    const leaf = app.workspace.getLeaf(false);
                    leaf.openFile(file);
                });
            }
        }

        if (yamlObject[this.name].estimatedDuration){
            try{
                this.estimatedDuration = new Timer(yamlObject[this.name].estimatedDuration);
            } catch {
                let notice:Notice = new Notice(this.name + " from " + file.name + " as a invalid estimated duration");
                notice.noticeEl.onClickEvent(() => {
                    const leaf = app.workspace.getLeaf(false);
                    leaf.openFile(file);
                });
            }
        }

        if (yamlObject[this.name].completed){

            let date = new Date(yamlObject[this.name].completed);

            if (!isNaN(date.getTime())){
                this.completed = date;
            }else{
                this.completed = undefined;
            }
            
        }

    }

    canBeIncludedInDate(date: Date): boolean {

        if (this.du){

            if (this.repeater.type != "none"){

                let nextDate = this.repeater.getNextEquivalentDay(this.du, date);
                
                if(nextDate){
                    return nextDate > date;
                } else {
                    return false;
                }
                
            } else {
                return this.completed == undefined;
            }

        } else {
            return this.completed == undefined;
        }

    }

}